// Genera las 5 portadas (el diagrama sale en inglés y en español) con el mismo marco, más el diagrama de payments-service.
// Uso (desde la raíz): node design/maqueta-v2/capturar-fuentes.mjs && node design/maqueta-v2/portadas.mjs
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const SRC = 'design/capturas/maqueta-v2';
const OUT = 'design/maqueta-v2/portadas';
const C = { paper: '#FAF8F5', surface: '#F2EFEA', ink: '#1A1917', soft: '#5E5A54', line: '#E4E0D9', accent: '#C2410C' };
const b64 = (f) => fs.readFileSync(f).toString('base64');
const font = (family, file, weight) =>
  `@font-face{font-family:${family};font-weight:${weight};src:url(data:font/ttf;base64,${b64(`src/assets/fonts/${file}`)})}`;
const FONTS =
  font('News', 'Newsreader-Medium.ttf', 500) +
  font('Schib', 'SchibstedGrotesk-Regular.ttf', 400) +
  font('Schib', 'SchibstedGrotesk-Medium.ttf', 500);

// Diagrama: mismos nodos y flechas que el flowchart del README de payments-service.
function node(x, y, title, sub, accent = false) {
  return `<rect x="${x}" y="${y}" width="360" height="136" rx="10" fill="${C.surface}" stroke="${accent ? C.accent : C.ink}" stroke-width="${accent ? 3 : 1.5}"/>
  <text x="${x + 180}" y="${y + 62}" class="t">${title}</text>
  <text x="${x + 180}" y="${y + 104}" class="s">${sub}</text>`;
}
const arrow = (d, accent = false) =>
  `<path d="${d}" fill="none" stroke="${accent ? C.accent : C.soft}" stroke-width="${accent ? 4 : 2.5}" marker-end="url(#${accent ? 'a' : 'g'})"/>`;
const head = (id, color) =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`;

const TEXT = {
  en: [
    ['Client', 'Idempotency-Key'], ['Provider', 'simulated, signed webhook'], ['payments API', 'Spring Boot'],
    ['PostgreSQL', 'payment, ledger, outbox'], ['Outbox relay', 'separate process'], ['RabbitMQ', 'publisher confirms'],
    ['notifications', 'idempotent consumer'], ['PostgreSQL', 'notifications'], ['Dead-letter queue', 'after retries'],
  ],
  es: [
    ['Cliente', 'Idempotency-Key'], ['Proveedor', 'simulado, webhook firmado'], ['API de pagos', 'Spring Boot'],
    ['PostgreSQL', 'pago, libro mayor, outbox'], ['Relay del outbox', 'proceso aparte'], ['RabbitMQ', 'confirma cada envío'],
    ['notificaciones', 'consumidor idempotente'], ['PostgreSQL', 'notificaciones'], ['DLQ', 'tras los reintentos'],
  ],
};
const diagram = (t) => `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
<style>.t{font:500 38px News;fill:${C.ink};text-anchor:middle}.s{font:400 25px Schib;fill:${C.soft};text-anchor:middle}</style>
<defs>${head('g', C.soft)}${head('a', C.accent)}</defs>
<rect width="1440" height="900" fill="${C.paper}"/>
${node(60, 70, ...t[0])}
${node(60, 236, ...t[1])}
${node(540, 153, ...t[2])}
${node(1020, 153, ...t[3], true)}
${node(1020, 460, ...t[4], true)}
${node(540, 460, ...t[5], true)}
${node(60, 460, ...t[6])}
${node(60, 696, ...t[7])}
${node(540, 696, ...t[8])}
${arrow('M420 138 C480 138 480 195 532 195')}
${arrow('M420 304 C480 304 480 247 532 247')}
${arrow('M900 221 H1012', true)}
${arrow('M1200 289 V452', true)}
${arrow('M1020 528 H908', true)}
${arrow('M540 528 H428', true)}
${arrow('M720 596 V688')}
${arrow('M240 596 V688')}
</svg>`;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const lang of ['en', 'es']) {
  await page.setContent(`<style>${FONTS}body{margin:0}</style>${diagram(TEXT[lang])}`);
  await page.evaluate(() => document.fonts.ready);
  // Ningún texto puede salirse de su caja (360 px).
  const wide = await page.evaluate(() => [...document.querySelectorAll('text')].filter((t) => t.getComputedTextLength() > 340).map((t) => t.textContent));
  if (wide.length) throw new Error(`Texto fuera de la caja (${lang}): ${wide.join(', ')}`);
  await page.screenshot({ path: `${SRC}/fuente-payments-${lang}.png` });
}

// Mismo marco para las 5: placa surface, pantalla a 1248 px, 96 px de margen, 120 arriba, apoyada abajo.
const sources = {
  purareserva: 'public/projects/purareserva/cover.webp',
  'payments-service': `${SRC}/fuente-payments-en.png`,
  'payments-service.es': `${SRC}/fuente-payments-es.png`,
  'nicoya-zmt': `${SRC}/fuente-nicoya.png`,
  'pipeline-bccr': 'public/projects/pipeline-bccr/cover.webp',
  'asada-gamalotal': `${SRC}/fuente-asada.png`,
};
for (const [slug, file] of Object.entries(sources)) {
  const mime = file.endsWith('.png') ? 'png' : 'webp';
  await page.setContent(`<style>body{margin:0;width:1440px;height:900px;overflow:hidden;background:${C.surface}}
  img{position:absolute;left:96px;top:120px;width:1248px;height:780px;border-radius:14px 14px 0 0;box-shadow:0 0 0 1px rgb(26 25 23 / 14%)}</style>
  <img src="data:image/${mime};base64,${b64(file)}">`);
  await page.evaluate(() => document.images[0].decode());
  const png = await page.screenshot();
  const info = await sharp(png).webp({ quality: 82 }).toFile(`${OUT}/${slug}.webp`);
  console.log(slug, Math.round(info.size / 1024), 'KB');
}
await browser.close();
