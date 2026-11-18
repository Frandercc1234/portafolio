// Saca capturas de página completa de la maqueta a 375 y 1440.
// Uso: node design/maqueta/capturar.mjs
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const dir = path.resolve('design/maqueta');
const out = path.resolve('design/capturas/maqueta');
fs.mkdirSync(out, { recursive: true });

const pages = [
  ['inicio', 'index.html'],
  ['caso-purareserva', 'caso.html'],
];
const sizes = [
  [1440, 900],
  [375, 812],
];

const browser = await chromium.launch();
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const [name, file] of pages) {
    await page.goto(pathToFileURL(path.join(dir, file)).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
    const target = path.join(out, `${name}-${w}.png`);
    await page.screenshot({ path: target, fullPage: true });
    console.log(`${name} ${w}: overflowX=${overflow}px, fonts=${[...new Set(fonts)].join(',')}`);
  }
  await ctx.close();
}
await browser.close();
