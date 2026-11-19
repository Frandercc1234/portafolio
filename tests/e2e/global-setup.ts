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
}
