import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('Tab llega primero a "Skip to content" y su foco es visible', async ({ page }) => {
  await page.goto('/en');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();

  // Anillo de foco visible: contorno con grosor y estilo.
  const outline = await skip.evaluate((el) => {
    const style = getComputedStyle(el);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThan(0);

  // Enter lleva al contenido principal.
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

for (const path of ['/en', '/es', '/en/projects/purareserva', '/es/projects/pipeline-bccr']) {
  test(`axe: sin violaciones serias ni críticas en ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // El contraste se mide con la opacidad real: se espera a que terminen las animaciones de entrada.
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodos`),
      'violaciones serias o críticas',
    ).toEqual([]);
  });
}
