// Capturas de la maqueta v2 y medición: grilla, desbordes y contraste de cada texto sobre su fondo.
// Uso (desde la raíz): node design/maqueta-v2/generar.mjs && node design/maqueta-v2/capturar.mjs
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const OUT = 'design/capturas/maqueta-v2';
const urlOf = (f) => pathToFileURL(path.resolve(`design/maqueta-v2/${f}`)).href;
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const combos = new Map();

for (const [lang, file] of [['en', 'index.html'], ['es', 'es.html']])
for (const [w, h] of [[375, 812], [768, 1024], [1024, 768], [1440, 900]]) {
  const url = urlOf(file);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  const m = await page.evaluate(() => {
    const rgb = (c) => c.match(/[\d.]+/g).map(Number);
    const lum = ([r, g, b]) => {
      const f = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const hex = (c) => '#' + c.slice(0, 3).map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    const bgOf = (el) => {
      for (; el; el = el.parentElement) {
        const c = rgb(getComputedStyle(el).backgroundColor);
        if (c.length < 4 || c[3] > 0) return c;
      }
      return [255, 255, 255];
    };
    const pairs = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.overlay, script') || !el.getClientRects().length) continue;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const s = getComputedStyle(el);
      const fg = rgb(s.color);
      const bg = bgOf(el);
      const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      pairs.push({ fg: hex(fg), bg: hex(bg), ratio: ((a + 0.05) / (b + 0.05)).toFixed(2), size: s.fontSize });
    }
    const wrap = document.querySelector('main .wrap').getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(document.querySelector('.hero .grid')).columnGap);
    return {
      pairs,
      grid: { margen: Math.round(wrap.left), medianil: gutter, columna: +((wrap.width - 11 * gutter) / 12).toFixed(2), contenido: Math.round(wrap.width) },
      desborde: document.documentElement.scrollWidth - window.innerWidth,
      tamanos: [...new Set(pairs.map((p) => p.size))].sort(),
      nombreLineas: Math.round(document.querySelector('h1').offsetHeight / (parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) * 1.02)),
      primeraPortada: (() => {
        const r = document.querySelector('.cover').getBoundingClientRect();
        return { arriba: Math.round(r.top), visible: Math.round((100 * Math.max(0, Math.min(r.height, innerHeight - r.top))) / r.height) + '%' };
      })(),
    };
  });
  console.log(lang, w, JSON.stringify(m.grid), 'desborde:', m.desborde, 'tamaños:', m.tamanos.join(' '), 'nombre en líneas:', m.nombreLineas, '1ª portada:', JSON.stringify(m.primeraPortada));
  for (const p of m.pairs) {
    const k = `${p.fg} sobre ${p.bg}`;
    const prev = combos.get(k) ?? { ratio: p.ratio, min: Infinity };
    prev.min = Math.min(prev.min, parseFloat(p.size));
    combos.set(k, prev);
  }
  if (w === 375 || w === 1440) {
    await page.screenshot({ path: `${OUT}/inicio-${lang}-${w}.png`, fullPage: true });
    await page.screenshot({ path: `${OUT}/pantalla-${lang}-${w}.png` });
  }
  if (w === 1440) {
    await page.goto(url + '?grid');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${OUT}/grilla-${lang}-1440.png` });
  }
  await page.close();
}
for (const [k, v] of combos) console.log(k, `${v.ratio}:1`, 'tamaño mínimo', `${v.min}px`);
await browser.close();
