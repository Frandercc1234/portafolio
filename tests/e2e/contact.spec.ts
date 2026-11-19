import { expect, test } from '@playwright/test';

test('con el formulario vacío muestra un error por campo y enfoca el primero', async ({ page }) => {
  await page.goto('/en#contact');
  // startedAt se llena al hidratar: antes de eso el envío sería el nativo del navegador.
  await page.waitForFunction(
    () => document.querySelector<HTMLInputElement>('input[name="startedAt"]')?.value,
  );
  await page.getByRole('button', { name: 'Send message' }).click();

  for (const field of ['name', 'email', 'message']) {
    await expect(page.locator(`#contact-${field}-error`)).toBeVisible();
    await expect(page.locator(`#contact-${field}`)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(`#contact-${field}`)).toHaveAttribute(
      'aria-describedby',
      `contact-${field}-error`,
    );
  }
  await expect(page.locator('#contact-name')).toBeFocused();
});

for (const locale of ['en', 'es'] as const) {
  test(`un envío válido con las claves de prueba muestra el éxito (${locale})`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.goto(`/${locale}#contact`);
    await page.locator('#contact-name').fill('Ada Lovelace');
    await page.locator('#contact-email').fill('ada@example.com');
    await page
      .locator('#contact-message')
      .fill('Hola, quiero hablar de un proyecto de dashboards.');

    // El widget de prueba de Turnstile se resuelve solo y deja el token en un campo oculto.
    await page.waitForFunction(
      () => {
        const input = document.querySelector<HTMLInputElement>(
          'input[name="cf-turnstile-response"]',
        );
        return Boolean(input?.value);
      },
      undefined,
      { timeout: 60_000 },
    );
    // Pasaron al menos 3 s desde el render: no es un envío de bot.
    await page.waitForTimeout(3200);

    await page.getByRole('button', { name: /send message|enviar mensaje/i }).click();
    await expect(page.getByRole('status')).toContainText(locale === 'en' ? 'Thanks' : 'Gracias');
    await expect(page.locator('form')).toHaveCount(0);
  });
}
