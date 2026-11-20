import { expect, test } from '@playwright/test';

const SLUGS = [
  'purareserva',
  'payments-service',
  'nicoya-zmt',
  'pipeline-bccr',
  'asada-gamalotal',
  'turismo-cr',
  'qa-cypress',
];

test.describe('SEO', () => {
  test.beforeEach(async ({ browserName }, testInfo) => {
    test.skip(
      browserName !== 'chromium' || testInfo.project.name !== 'desktop',
      'no depende del tamaño',
    );
  });

  test('el sitemap lista 16 URLs (2 inicios y 14 casos) con hreflang', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toHaveLength(16);
    expect(new Set(locs).size).toBe(16);
    for (const slug of SLUGS) {
      expect(locs.some((l) => l.endsWith(`/en/projects/${slug}`))).toBe(true);
      expect(locs.some((l) => l.endsWith(`/es/projects/${slug}`))).toBe(true);
    }
    // Cada URL trae sus dos alternativas (incluida ella misma).
    expect([...xml.matchAll(/hreflang="/g)]).toHaveLength(32);
  });

  test('robots.txt permite todo y apunta al sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toMatch(/Allow: \//);
    expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
  });

  test('/icon.svg devuelve 200 como SVG, sin pasar por el middleware de idioma', async ({
    request,
  }) => {
    const res = await request.get('/icon.svg', { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/svg+xml');
    expect(await res.text()).toContain('<svg');
  });

  test('/favicon.ico y otros archivos de la raíz no caen en [locale]', async ({ request }) => {
    // Sin redirección a /en y sin pasar por el segmento [locale] (antes daba 500/ENOENT).
    const ico = await request.get('/favicon.ico', { maxRedirects: 0 });
    expect(ico.status()).toBe(200);
    expect(ico.headers()['content-type']).toContain('image');
    expect(ico.headers()['location']).toBeUndefined();
    for (const path of ['/robots.txt', '/sitemap.xml']) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(200);
    }
  });

  test('el inicio declara el ícono en el <head>', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
      'href',
      /\/icon\.svg/,
    );
  });

  for (const path of [
    '/en/opengraph-image',
    '/es/opengraph-image',
    '/en/projects/purareserva/opengraph-image',
    '/es/projects/nicoya-zmt/opengraph-image',
  ]) {
    test(`${path} devuelve un PNG de 1200x630`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('image/png');
      const png = await res.body();
      expect(png.subarray(1, 4).toString()).toBe('PNG');
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);
    });
  }

  test('el inicio trae canonical, hreflang, Open Graph, Twitter y JSON-LD Person', async ({
    page,
  }) => {
    await page.goto('/en');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en$/);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      /\/es$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/en\/opengraph-image/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    const ld = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '{}',
    );
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe('Frander Centeno');
    expect(ld.sameAs).toEqual(
      expect.arrayContaining([
        'https://github.com/Frandercc1234',
        'https://www.linkedin.com/in/frander-centeno-6a1982323/',
      ]),
    );
  });

  test('un caso en español trae su canonical y el alternate en inglés', async ({ page }) => {
    await page.goto('/es/projects/pipeline-bccr');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/es\/projects\/pipeline-bccr$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      /\/en\/projects\/pipeline-bccr$/,
    );
  });
});
