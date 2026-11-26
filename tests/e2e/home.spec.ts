import { expect, test } from '@playwright/test';

// Orden de los destacados (campo `order`, solo los `featured: true`).
const SLUGS = ['purareserva', 'payments-service', 'nicoya-zmt', 'pipeline-bccr', 'asada-gamalotal'];

const TEXT = {
  en: {
    work: 'Selected work',
    more: 'More projects',
    caseLink: /^Case study/,
    repo: /^Repository/,
    facts: ['Now', 'Looking for', 'Before'],
  },
  es: {
    work: 'Trabajo destacado',
    more: 'Más proyectos',
    caseLink: /^Caso de estudio/,
    repo: /^Repositorio/,
    facts: ['Ahora', 'Busco', 'Antes'],
  },
} as const;

test.describe('redirección según Accept-Language', () => {
  test.describe('inglés', () => {
    test.use({ locale: 'en' });
    test('/ redirige a /en', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/en$/);
    });
  });

  test.describe('español', () => {
    test.use({ locale: 'es' });
    test('/ redirige a /es', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/es$/);
    });
  });

  test.describe('idioma no soportado', () => {
    test.use({ locale: 'fr' });
    test('/ cae en el idioma por defecto (/en)', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/en$/);
    });
  });
});

for (const locale of ['en', 'es'] as const) {
  test.describe(`inicio en ${locale}`, () => {
    test('el hero muestra el nombre y el botón de CV', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('h1')).toHaveText('Frander Centeno');
      const cv = page.locator('main a[download]').first();
      await expect(cv).toBeVisible();
      await expect(cv).toHaveAttribute(
        'href',
        new RegExp(`CV_Frander_Centeno_${locale.toUpperCase()}\\.pdf$`),
      );
    });

    test('los casos destacados enlazan a su página', async ({ page }) => {
      await page.goto(`/${locale}`);
      for (const slug of SLUGS) {
        await expect(page.locator(`#projects a[href$="/${locale}/projects/${slug}"]`)).toHaveCount(
          1,
        );
      }
      // Las filas con portada son esos cinco y van en ese orden.
      const rows = page
        .getByRole('region', { name: TEXT[locale].work })
        .getByRole('link')
        .filter({ has: page.getByRole('heading', { level: 3 }) });
      const hrefs = await rows.evaluateAll((els) =>
        els.map((el) => el.getAttribute('href')!.split('/').pop()),
      );
      expect(hrefs).toEqual(SLUGS);
      await page.locator(`#projects a[href$="/${locale}/projects/${SLUGS[0]}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/projects/${SLUGS[0]}$`), {
        timeout: 20_000,
      });
      await expect(page.locator('h1')).toBeVisible();
    });

    test('"More projects" lista turismo-cr y la suite de QA, sin imagen', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.getByRole('heading', { level: 3, name: TEXT[locale].more })).toBeVisible();
      const items = page.getByRole('list', { name: TEXT[locale].more }).locator(':scope > li');
      await expect(items).toHaveCount(2);
      await expect(items.getByRole('img')).toHaveCount(0);
      for (const [i, slug, repo] of [
        [0, 'turismo-cr', 'turismo-cr'],
        [1, 'qa-cypress', 'portafolio-qa-cypress'],
      ] as const) {
        await expect(items.nth(i).getByRole('link', { name: TEXT[locale].caseLink })).toHaveAttribute(
          'href',
          `/${locale}/projects/${slug}`,
        );
        await expect(items.nth(i).getByRole('link', { name: TEXT[locale].repo })).toHaveAttribute(
          'href',
          `https://github.com/Frandercc1234/${repo}`,
        );
      }
      await expect(items.nth(0).getByRole('link', { name: /^Demo/ })).toHaveCount(1);
      await expect(items.nth(1).getByRole('link', { name: /^Demo/ })).toHaveCount(0);
    });

    test('risk-calculator ya no aparece', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.getByText(/risk.calculator|calculadora de riesgos/i)).toHaveCount(0);
      await expect(page.locator('a[href*="risk-calculator"]')).toHaveCount(0);
    });

    test('los títulos pequeños usan la sans de su nivel, no la serif de los h1 a h3', async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      const fonts = await page
        .locator('main :is(h1, h2, h3, h4):is(.type-label, .type-text)')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).fontFamily));
      expect(fonts.length).toBeGreaterThan(5);
      expect(fonts.filter((f) => !/schibsted/i.test(f))).toEqual([]);
    });

    test('el hero muestra los tres datos', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.getByRole('term')).toHaveText(TEXT[locale].facts);
      await expect(page.getByRole('definition').first()).toContainText('Spring Boot');
    });

    test('a 1440×900 el primer proyecto entra en la primera pantalla', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      const first = page.getByRole('heading', { level: 3, name: 'PuraReserva' });
      await expect(first).toBeInViewport({ ratio: 1 });
      const box = await page.locator('#projects [data-cover]').first().boundingBox();
      // Al menos un cuarto de la primera portada se ve sin desplazarse.
      expect((900 - box!.y) / box!.height).toBeGreaterThan(0.25);
    });

    for (const width of [375, 768, 1024, 1440]) {
      test(`cada etiqueta de proyecto cabe en una línea a ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        await page.evaluate(() => document.fonts.ready);
        const labels = await page.locator('[data-project-label]').evaluateAll((els) =>
          els.map((el) => ({
            text: el.textContent,
            lines: Math.round(el.clientHeight / parseFloat(getComputedStyle(el).lineHeight)),
          })),
        );
        expect(labels).toHaveLength(7);
        expect(labels.filter((l) => l.lines !== 1)).toEqual([]);
      });
    }

    for (const [width, sizes] of [
      [375, ['13px', '16px', '28px', '44px']],
      [1440, ['13px', '18px', '36px', '88px']],
    ] as const) {
      test(`el inicio usa solo los 4 niveles de texto a ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        await page.evaluate(() => document.fonts.ready);
        const found = await page.evaluate(() => {
          const out: Record<string, string> = {};
          for (const el of document.querySelectorAll<HTMLElement>('header *, main *, footer *')) {
            // Fuera: lo oculto, lo que solo leen los lectores de pantalla y el widget externo.
            if (!el.getClientRects().length || el.closest('.sr-only, [aria-hidden="true"]')) continue;
            if (el.closest('[data-turnstile-slot]')) continue;
            const text = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent?.trim());
            if (text) out[getComputedStyle(el).fontSize] = text.textContent!.trim().slice(0, 40);
          }
          return out;
        });
        expect(
          Object.keys(found).filter((size) => !(sizes as readonly string[]).includes(size)),
          JSON.stringify(found),
        ).toEqual([]);
      });
    }

    test('no hay scroll horizontal', async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth);
    });

    // Los anchos donde el header y la sección de contacto se desbordaban (issues #1 y #2 de QA).
    for (const width of [320, 375, 768, 1024, 1440]) {
      test(`no hay scroll horizontal a ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        await page.evaluate(() => document.fonts.ready);
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth);
        // El botón del menú (o el de Download CV en escritorio) queda dentro de la pantalla.
        const right = await page.evaluate(() => {
          const el = document.querySelector('header .wrap > div:last-child');
          return el ? el.getBoundingClientRect().right : 0;
        });
        expect(right).toBeLessThanOrEqual(width);
      });
    }

    test('a 320 px el widget de Turnstile (compacto) no se sale del contenedor', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.goto(`/${locale}`, { waitUntil: 'load' });
      const slot = page.locator('[data-turnstile-slot]');
      await slot.scrollIntoViewIfNeeded();
      // El widget de prueba termina de montarse cuando deja su token en el campo oculto.
      await page.waitForFunction(
        () =>
          Boolean(document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')),
        undefined,
        { timeout: 30_000 },
      );
      // Con 272 px disponibles se usa el tamaño compacto (150×140), no el de 300×65.
      await expect(slot).toHaveCSS('height', '140px');
      const medidas = await slot.evaluate((el) => {
        const caja = el.getBoundingClientRect();
        const hijos = [...el.querySelectorAll('*')].map((h) => h.getBoundingClientRect().right);
        return { derecha: caja.right, ancho: caja.width, maxHijo: Math.max(0, ...hijos) };
      });
      expect(medidas.ancho).toBeLessThanOrEqual(300);
      expect(medidas.maxHijo).toBeLessThanOrEqual(medidas.derecha + 0.5);
      expect(medidas.derecha).toBeLessThanOrEqual(320);
    });
  });
}
