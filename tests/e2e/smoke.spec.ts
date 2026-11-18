import { test, expect } from '@playwright/test';

test('la página responde', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.ok()).toBe(true);
});
