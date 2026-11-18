import { defineConfig } from '@playwright/test';

// Puerto propio para no chocar con otros servidores locales (y no reutilizar uno ajeno).
const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, hasTouch: true },
    },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
  ],
  // Servidor de desarrollo: ahí NODE_ENV no es "production", así que el formulario de contacto
  // no llama a Resend sin clave (sección 7). Las claves de Turnstile son las de prueba y
  // RESEND_API_KEY queda vacía a propósito, aunque exista un .env.local con la clave real.
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180000,
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      RESEND_API_KEY: '',
    },
  },
});
