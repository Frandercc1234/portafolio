import { expect, test } from '@playwright/test';

const FILES = { en: '/cv/CV_Frander_Centeno_EN.pdf', es: '/cv/CV_Frander_Centeno_ES.pdf' };

for (const locale of ['en', 'es'] as const) {
  test(`los botones de CV de /${locale} apuntan al PDF y responde 200`, async ({
    page,
  }, testInfo) => {
    await page.goto(`/${locale}`);
    const expected = FILES[locale];

    // Botón del hero: está en los dos tamaños.
    const hero = page.locator('main a[download]').first();
    await expect(hero).toHaveAttribute('href', expected);

    // Botón de la cabecera (escritorio) o del menú (móvil).
    if (testInfo.project.name === 'mobile') {
      // Hasta que hidrata, el clic no abre nada: se repite hasta que el panel aparece.
      await expect(async () => {
        await page.locator('button[aria-controls="mobile-menu"]').click();
        await expect(page.locator('#mobile-menu')).toBeVisible({ timeout: 1500 });
      }).toPass({ timeout: 20_000 });
      await expect(page.locator('#mobile-menu a[download]')).toHaveAttribute('href', expected);
    } else {
      await expect(page.locator('header a[download]')).toHaveAttribute('href', expected);
    }

    const res = await page.request.get(expected);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
    expect((await res.body()).subarray(0, 4).toString()).toBe('%PDF');
  });
}
