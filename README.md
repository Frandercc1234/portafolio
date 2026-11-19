# Portafolio de Frander Centeno

Sitio estático y bilingüe (inglés y español) con un inicio y un caso de estudio por proyecto.

- Producción: https://frandercenteno.vercel.app
- Plano de construcción: [`CLAUDE.md`](CLAUDE.md). Dirección de arte: [`DESIGN.md`](DESIGN.md).

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind 4, next-intl, MDX (`next-mdx-remote`), Motion, Resend, Cloudflare Turnstile, Vercel Analytics.

## Comandos

```powershell
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest
npx playwright test  # e2e: build + start en el puerto 3100, sin envío real de correos
```

Variables de entorno: ver `.env.example`.

## Lighthouse de producción

Medido con `lighthouse` (CLI) sobre https://frandercenteno.vercel.app el 2026-11-18, con Vercel Analytics activo (commit `fcd710e`).

| Página                     | Dispositivo | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| -------------------------- | ----------- | ----------- | ------------- | ---------------- | --- |
| `/en`                      | Móvil       | 96          | 100           | 100              | 100 |
| `/en`                      | Escritorio  | 100         | 100           | 100              | 100 |
| `/en/projects/purareserva` | Móvil       | 99          | 100           | 100              | 100 |
| `/en/projects/purareserva` | Escritorio  | 100         | 100           | 100              | 100 |

El rendimiento del inicio en móvil es la mediana de 4 corridas (81, 95, 97, 97). La de 81 fue atípica: bloqueo total de 650 ms contra 120 a 180 ms en las otras tres. El resto es una sola corrida.

## Pendientes

- Migrar a Next 16. `npm audit` marca un aviso de `postcss` dentro de Next 15 y no hay una versión 15 estable corregida. Solo afecta al build.
- Íconos monocromos de tecnologías.
