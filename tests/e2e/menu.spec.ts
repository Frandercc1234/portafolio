import { expect, test } from '@playwright/test';

test('el menú abre, lleva a las anclas y cierra con Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'solo en móvil');
  await page.goto('/en');
  const toggle = page.locator('button[aria-controls="mobile-menu"]');
  const panel = page.locator('#mobile-menu');

  await expect(panel).toHaveCount(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();

  // Los tres enlaces llevan a su ancla y el menú se cierra.
  for (const [name, id] of [
    ['Projects', 'projects'],
    ['Experience', 'experience'],
    ['Contact', 'contact'],
  ]) {
    await panel.getByRole('link', { name }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(panel).toHaveCount(0);
    await toggle.click();
    await expect(panel).toBeVisible();
  }

  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
