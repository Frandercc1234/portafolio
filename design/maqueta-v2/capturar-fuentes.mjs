// Capturas de origen para las portadas (solo páginas públicas, sin sesión).
// Uso: node design/maqueta-v2/capturar-fuentes.mjs
import { chromium } from '@playwright/test';

const OUT = 'design/capturas/maqueta-v2';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const [name, url] of [
  ['nicoya', 'https://zmtmn-usuarios.municoya.go.cr'],
  ['asada', 'https://asada-gamalotal-inventario.vercel.app/'],
]) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(2500);
  // Oculta los controles del carrusel: botones sin texto y puntos indicadores.
  const hidden = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('button, [role="button"], li, span, div')) {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const round = parseFloat(s.borderTopLeftRadius) >= r.width / 2 - 1;
      const empty = el.textContent.trim() === '';
      const isArrow = el.tagName === 'BUTTON' && empty && r.top > 100;
      const isDot = empty && round && r.width > 4 && r.width <= 28 && Math.abs(r.width - r.height) < 2 && r.top > 300;
      if (isArrow || isDot) {
        el.style.visibility = 'hidden';
        n++;
      }
    }
    return n;
  });
  await page.screenshot({ path: `${OUT}/fuente-${name}.png` });
  console.log(name, 'controles ocultos:', hidden);
  await page.close();
}
await browser.close();
