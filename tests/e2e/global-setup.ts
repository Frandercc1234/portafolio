import { chromium } from '@playwright/test';

// Calienta el servidor de desarrollo: compila cada ruta una vez, en serie, antes de las pruebas.
// Así los procesos en paralelo no compiten por compilar lo mismo (fuente de fallos intermitentes).
const PORT = Number(process.env.E2E_PORT ?? 3100);
const SLUGS = ['purareserva', 'nicoya-zmt', 'pipeline-bccr', 'asada-gamalotal', 'turismo-cr'];

export default async function globalSetup() {
  const paths = [
    ...['en', 'es'].flatMap((l) => [
      `/${l}`,
      `/${l}/opengraph-image`,
      ...SLUGS.flatMap((s) => [`/${l}/projects/${s}`, `/${l}/projects/${s}/opengraph-image`]),
    ]),
    '/en/projects/no-existe',
    '/sitemap.xml',
    '/robots.txt',
  ];
  for (const path of paths) {
    try {
      await fetch(`http://localhost:${PORT}${path}`, { signal: AbortSignal.timeout(60_000) });
    } catch {
      // Un fallo aquí no detiene la suite: la prueba que dependa de la ruta lo mostrará.
    }
  }

  // Con un navegador real se compilan también los fragmentos de cliente (hidratación, menú móvil, Turnstile).
  const browser = await chromium.launch();
  try {
    const page = await (
      await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true })
    ).newPage();
    for (const path of ['/en', '/es', '/en/projects/purareserva', '/es/projects/pipeline-bccr']) {
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'load', timeout: 60_000 });
      await page.waitForTimeout(1500);
    }
    await page.goto(`http://localhost:${PORT}/en#contact`, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForTimeout(2500);
    await page
      .locator('button[aria-controls="mobile-menu"]')
      .click({ timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
  } catch {
    // El calentamiento no debe detener la suite.
  } finally {
    await browser.close();
  }
}
