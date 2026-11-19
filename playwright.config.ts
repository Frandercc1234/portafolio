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
  // Build de producción + next start: lo mismo que se despliega. CONTACT_DRY_RUN=1 evita que el
  // formulario envíe correos (valida y verifica Turnstile, pero no llama a Resend), y las claves
  // de Turnstile son las de prueba. RESEND_API_KEY queda vacía aunque exista un .env.local.
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 240000,
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      RESEND_API_KEY: '',
      CONTACT_DRY_RUN: '1',
    },
  },
});
