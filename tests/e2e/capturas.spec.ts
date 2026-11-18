import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

// Capturas de página completa para revisión (no comparan nada).
const OUT = path.join(process.cwd(), 'design', 'capturas');

for (const locale of ['en', 'es']) {
  test(`captura del inicio (${locale})`, async ({ page }, testInfo) => {
    fs.mkdirSync(OUT, { recursive: true });
    // El widget de Turnstile mantiene conexiones abiertas: no se espera a networkidle.
    await page.goto(`/${locale}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, 'scroll horizontal').toBeLessThanOrEqual(0);
    const width = testInfo.project.name === 'mobile' ? 375 : 1440;
    await page.screenshot({
      path: path.join(OUT, `inicio-${locale}-${width}.png`),
      fullPage: true,
    });
  });
}

for (const locale of ['en', 'es']) {
  test(`captura del caso purareserva (${locale})`, async ({ page }, testInfo) => {
    fs.mkdirSync(OUT, { recursive: true });
    await page.goto(`/${locale}/projects/purareserva`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, 'scroll horizontal').toBeLessThanOrEqual(0);
    const width = testInfo.project.name === 'mobile' ? 375 : 1440;
    await page.screenshot({
      path: path.join(OUT, `caso-purareserva-${locale}-${width}.png`),
      fullPage: true,
    });
  });
}
