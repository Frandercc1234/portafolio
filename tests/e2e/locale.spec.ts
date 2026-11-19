import { expect, test } from '@playwright/test';

test('el selector cambia de /en/projects/purareserva a /es/projects/purareserva', async ({
  page,
}) => {
  await page.goto('/en/projects/purareserva');
  await page
    .getByRole('navigation', { name: 'Language' })
    .getByRole('link', { name: 'es' })
    .click();
  await expect(page).toHaveURL(/\/es\/projects\/purareserva$/, { timeout: 20_000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('PuraReserva');
  // El enlace del idioma actual queda marcado.
  await expect(
    page.getByRole('navigation', { name: 'Idioma' }).getByRole('link', { name: 'es' }),
  ).toHaveAttribute('aria-current', 'true');
});

test('y de vuelta: /es/projects/purareserva a /en/projects/purareserva', async ({ page }) => {
  await page.goto('/es/projects/purareserva');
  await page.getByRole('navigation', { name: 'Idioma' }).getByRole('link', { name: 'en' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/purareserva$/, { timeout: 20_000 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('en el inicio el selector conserva la ruta', async ({ page }) => {
  await page.goto('/en');
  await page
    .getByRole('navigation', { name: 'Language' })
    .getByRole('link', { name: 'es' })
    .click();
  await expect(page).toHaveURL(/\/es$/, { timeout: 20_000 });
});
