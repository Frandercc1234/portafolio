// Capturas de página completa del inicio (EN y ES, 375 y 1440) para el PR.
// Uso: node design/maqueta-v2/capturar-sitio.mjs <antes|despues> <url-base>
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const [name, base] = process.argv.slice(2);
const OUT = 'design/pr-home-v2';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const width of [375, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: width === 375 ? 812 : 900 },
    reducedMotion: 'reduce',
  });
  // Estas visitas no deben contar en Analytics.
  await context.route('**/_vercel/insights/**', (r) => r.fulfill({ status: 204, body: '' }));
  for (const lang of ['en', 'es']) {
    const page = await context.newPage();
    await page.goto(`${base}/${lang}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // Recorre la página para que carguen las imágenes diferidas.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(2000);
    const png = await page.screenshot({ fullPage: true });
    await sharp(png).jpeg({ quality: 78 }).toFile(`${OUT}/${name}-${lang}-${width}.jpg`);
    await page.close();
  }
  await context.close();
}
await browser.close();
