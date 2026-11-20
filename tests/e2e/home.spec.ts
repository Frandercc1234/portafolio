import { expect, test } from '@playwright/test';

const SLUGS = ['purareserva', 'nicoya-zmt', 'pipeline-bccr', 'asada-gamalotal', 'turismo-cr'];

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
      await page.locator(`#projects a[href$="/${locale}/projects/${SLUGS[0]}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/projects/${SLUGS[0]}$`), {
        timeout: 20_000,
      });
      await expect(page.locator('h1')).toBeVisible();
    });

    test('"Otros proyectos" lista la suite de QA sobre risk-calculator, fuera de los destacados', async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      const items = page.locator('#other li');
      await expect(items).toHaveCount(2);
      await expect(items.nth(0).locator('h3')).toHaveText('QA suite');
      await expect(items.nth(1).locator('h3')).toHaveText('Risk calculator');
      await expect(items.nth(0).locator(`a[href$="/${locale}/projects/qa-cypress"]`)).toHaveCount(
        1,
      );
      await expect(
        items.nth(0).locator('a[href="https://github.com/Frandercc1234/portafolio-qa-cypress"]'),
      ).toHaveCount(1);
      await expect(page.locator('#projects a[href$="/projects/qa-cypress"]')).toHaveCount(0);
    });

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
