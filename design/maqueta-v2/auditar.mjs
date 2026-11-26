// Auditoría medible del sitio construido: axe, objetivos táctiles, desbordes y orden de títulos.
// Uso: node design/maqueta-v2/auditar.mjs http://localhost:3300
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = process.argv[2];
const browser = await chromium.launch();
for (const width of [320, 375, 768, 1024, 1440]) {
  for (const path of ['/en', '/es', '/en/projects/payments-service', '/es/projects/nicoya-zmt']) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    await context.route('**/_vercel/insights/**', (r) => r.fulfill({ status: 204, body: '' }));
    const page = await context.newPage();
    await page.goto(base + path, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const small = [...document.querySelectorAll('a, button, input:not([type=hidden]), textarea')]
        .filter((el) => !el.closest('[aria-hidden="true"], [data-turnstile-slot]'))
        // Fuera: el enlace de salto (oculto hasta tener foco) y los enlaces dentro de texto corrido.
        .filter((el) => !el.closest('p') || el.closest('p').textContent.trim() === el.textContent.trim())
        .map((el) => [el, el.getBoundingClientRect()])
        .filter(([, r]) => r.width > 1 && r.height > 1 && (r.height < 44 || r.width < 44))
        .map(([el, r]) => `${el.textContent.trim().slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      const levels = [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map((h) => +h.tagName[1]);
      return {
        desborde: document.documentElement.scrollWidth - window.innerWidth,
        pequenos: small,
        h1: levels.filter((l) => l === 1).length,
        saltos: levels.filter((l, i) => i > 0 && l - levels[i - 1] > 1).length,
      };
    });
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    console.log(width, path, JSON.stringify(m), 'axe:', axe.violations.map((v) => `${v.id}(${v.impact})`).join(', ') || 0);
    await context.close();
  }
}
await browser.close();
