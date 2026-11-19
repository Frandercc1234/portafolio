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

    test('no hay scroll horizontal', async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth);
    });
  });
}
