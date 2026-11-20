import { expect, test } from '@playwright/test';

// Orden de los casos (campo `order` del frontmatter).
const SLUGS = [
  'purareserva',
  'payments-service',
  'nicoya-zmt',
  'pipeline-bccr',
  'asada-gamalotal',
  'turismo-cr',
  'qa-cypress',
];

for (const locale of ['en', 'es'] as const) {
  for (const slug of SLUGS) {
    test(`el caso ${slug} carga en ${locale} con un h1`, async ({ page }) => {
      const res = await page.goto(`/${locale}/projects/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('article h2')).toHaveCount(6);
    });
  }

  test(`"Next project" enlaza al siguiente por order en ${locale}, y el último vuelve al primero`, async ({
    page,
  }) => {
    for (const [i, slug] of SLUGS.entries()) {
      await page.goto(`/${locale}/projects/${slug}`);
      const expected = SLUGS[(i + 1) % SLUGS.length];
      await expect(page.locator('nav a[href$="/projects/' + expected + '"]')).toHaveCount(1);
    }
  });

  test(`un slug falso da 404 en ${locale}`, async ({ page }) => {
    const res = await page.goto(`/${locale}/projects/no-existe`);
    expect(res?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}
