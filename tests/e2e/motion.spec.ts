import { expect, test, type Page } from '@playwright/test';

const HERO = ['.enter-1', '.enter-2', '.enter-3', '.enter-4', '.enter-5'];

async function heroStyles(page: Page) {
  return Promise.all(
    HERO.map((selector) =>
      page
        .locator(`main ${selector}`)
        .first()
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            opacity: style.opacity,
            transform: style.transform,
            animation: style.animationName,
            delay: parseFloat(style.animationDelay),
          };
        }),
    ),
  );
}

test.describe('con movimiento reducido', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('el hero se ve completo al cargar, sin animación ni desplazamiento', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    for (const selector of HERO)
      await expect(page.locator(`main ${selector}`).first()).toBeVisible();
    for (const style of await heroStyles(page)) {
      expect(style.opacity).toBe('1');
      expect(style.transform).toBe('none');
      expect(style.animation).toBe('none');
    }
  });

  test('el menú móvil abre sin desplazamiento', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'solo en móvil');
    await page.goto('/en');
    const panel = page.locator('#mobile-menu');
    await expect(async () => {
      if (
        (await page
          .locator('button[aria-controls="mobile-menu"]')
          .getAttribute('aria-expanded')) !== 'true'
      ) {
        await page.locator('button[aria-controls="mobile-menu"]').click();
      }
      await expect(panel).toBeVisible({ timeout: 1500 });
    }).toPass({ timeout: 20_000 });
    await expect(panel).toHaveCSS('opacity', '1');
    expect(await panel.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  });

  test('un clic en una tarjeta navega sin View Transition', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __vt: number }).__vt = 0;
      const original = document.startViewTransition?.bind(document);
      if (original) {
        document.startViewTransition = ((cb: never) => {
          (window as unknown as { __vt: number }).__vt++;
          return original(cb);
        }) as typeof document.startViewTransition;
      }
    });
    await page.goto('/en');
    await page.locator('#projects a[href$="/projects/purareserva"]').click();
    await expect(page).toHaveURL(/\/en\/projects\/purareserva$/, { timeout: 20000 });
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(0);
  });
});

test.describe('sin preferencia de movimiento', () => {
  test('el hero entra escalonado y una sola vez al cargar', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    const styles = await heroStyles(page);
    for (const style of styles) expect(style.animation).toBe('enter-up');
    const delays = styles.map((s) => s.delay);
    expect([...delays].sort((a, b) => a - b)).toEqual(delays);
    expect(new Set(delays).size).toBe(delays.length);
    expect(delays[delays.length - 1]).toBeLessThanOrEqual(0.3);
    // Al terminar queda completo.
    await expect(page.locator('main .enter-5').first()).toHaveCSS('opacity', '1');
  });

  test('un clic en una tarjeta usa View Transition y llega al caso', async ({
    page,
    browserName,
  }, testInfo) => {
    test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop', 'solo desktop');
    await page.addInitScript(() => {
      (window as unknown as { __vt: number }).__vt = 0;
      const original = document.startViewTransition?.bind(document);
      if (original) {
        document.startViewTransition = ((cb: never) => {
          (window as unknown as { __vt: number }).__vt++;
          return original(cb);
        }) as typeof document.startViewTransition;
      }
    });
    await page.goto('/en');
    await page.locator('#projects a[href$="/projects/pipeline-bccr"]').click();
    await expect(page).toHaveURL(/\/en\/projects\/pipeline-bccr$/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(1);
  });

  test('con el teclado (Enter) la navegación no se anima', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'solo desktop');
    await page.addInitScript(() => {
      (window as unknown as { __vt: number }).__vt = 0;
      const original = document.startViewTransition?.bind(document);
      if (original) {
        document.startViewTransition = ((cb: never) => {
          (window as unknown as { __vt: number }).__vt++;
          return original(cb);
        }) as typeof document.startViewTransition;
      }
    });
    await page.goto('/en');
    await page.locator('#projects a[href$="/projects/nicoya-zmt"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/en\/projects\/nicoya-zmt$/, { timeout: 20000 });
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(0);
  });
});
