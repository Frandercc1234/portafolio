# Blueprint: portafolio de Frander Centeno

Plano para construir con Claude Code, sin preguntas. Seguir la sección 12 en orden.

## 1. Resumen

Portafolio web de Frander Centeno, desarrollador fullstack en Costa Rica.

- **Para quién:** primero reclutadores (empleo fijo o remoto) y después clientes freelance (startups y pymes).
- **Problema:** hoy su trabajo está repartido entre GitHub, LinkedIn y demos sueltas. Un reclutador necesita entender en 30 segundos qué hace, con qué stack y con qué resultados, y descargar el CV.
- **Qué es:** sitio estático, bilingüe (inglés por defecto, español), con un inicio y un caso de estudio por proyecto. Tiene que verse diseñado a mano, no como plantilla.

## 2. Alcance

### MVP

1. Inicio con hero, casos destacados, stack, experiencia, sobre mí y contacto.
2. Página de caso de estudio por proyecto, escrita en MDX.
3. Inglés y español, con selector de idioma y URLs por idioma.
4. CV en PDF descargable (uno por idioma).
5. Formulario de contacto con Resend y Cloudflare Turnstile.
6. SEO: metadatos, sitemap, robots, imágenes Open Graph generadas por página y datos estructurados `Person`.
7. Movimiento y detalles pulidos: entradas, hover, focus y transiciones entre páginas, todo con `prefers-reduced-motion`.

### Casos de estudio iniciales

| slug | Proyecto | Fuente del contenido |
|---|---|---|
| `purareserva` | Reservas de tours en Guanacaste, Next.js + Supabase + asistente IA | README, `DESIGN.md` y `PRODUCT.md` del repo `Frandercc1234/purareserva`. Demo: https://purareserva.vercel.app |
| `payments-service` | Backend de pagos con dos microservicios (pagos y notificaciones), Java 21 + Spring Boot 3 + PostgreSQL + RabbitMQ. Contexto `personal`, 2026, `featured: true`, `order: 2` | README y `docs/guia-de-estudio.md` del repo `Frandercc1234/payments-service`. Sin demo |
| `turismo-cr` | Dashboard de llegadas internacionales del ICT, Python + DuckDB + Streamlit. Sale de los destacados (`featured: false`) y va en "More projects" | README del repo `Frandercc1234/turismo-cr`. Demo: https://turismo-cr-7juydxs6ebdqwumreibouf.streamlit.app/ |
| `asada-gamalotal` | Sistema de inventario para una ASADA (práctica profesional), Next.js + Supabase | README del repo `Frandercc1234/asada-gamalotal-inventario` |
| `pipeline-bccr` | Pipeline diario de indicadores económicos del BCCR con API pública y dashboard, Python + PostgreSQL + NestJS + Next.js | README y documentos del repo `Frandercc1234/pipeline-indicadores-cr`. Demo: https://pipeline-indicadores-cr.vercel.app |
| `nicoya-zmt` | Sistema de la Zona Marítimo Terrestre, Municipalidad de Nicoya (proyecto universitario) | Texto de la sección 9.4. En producción: https://zmtmn-usuarios.municoya.go.cr |
| `qa-cypress` | Suite de QA con Cypress y TypeScript que prueba este portafolio en producción (90 pruebas, 17 casos, CI diario). Encontró 2 bugs reales de responsive. Contexto `personal`, 2026, `featured: false`, `order: 7` | README y `docs/plan-de-pruebas.md` del repo `Frandercc1234/portafolio-qa-cypress`. Sin demo |

`qa-cypress` y `turismo-cr` tienen caso propio, no entran a los destacados y van en la lista "More projects" / "Más proyectos" del inicio. `risk-calculator` salió del portafolio.

### Fuera de alcance

- Blog, CMS, base de datos, panel de administración y login.
- Modo oscuro (se evalúa después del lanzamiento).
- Dominio propio: se publica en `*.vercel.app`. El cambio a un `.dev` es solo configuración (sección 14.4).
- 3D, WebGL, GSAP, scroll-jacking y cursores personalizados.

## 3. Usuarios y roles

Un solo rol: visitante anónimo. Puede leer todo, descargar el CV y mandar el formulario. No hay login ni datos guardados en el sitio. Frander edita contenido desde el repo.

## 4. Stack

| Pieza | Versión mínima | Por qué |
|---|---|---|
| Next.js (App Router) | 15.x | Generación estática de todas las páginas, `next/og`, Server Actions para el formulario |
| React | 19 | La que trae Next 15 |
| TypeScript | 5.x, `strict` | Tipos para el frontmatter y el formulario |
| Tailwind CSS | 4.x | Tokens en `@theme`, mismo flujo que PuraReserva |
| next-intl | 4.x | Rutas `/en` y `/es`, mensajes por idioma |
| next-mdx-remote | 5.x (`/rsc`) | Renderiza MDX en Server Components sin build de contenido extra |
| gray-matter | 4.x | Lee el frontmatter |
| zod | 3.x o 4.x | Valida frontmatter y formulario |
| motion | 12.x | Solo para 2 o 3 piezas (sección 10.5). El resto, CSS |
| resend | 4.x | Envío del formulario |
| Cloudflare Turnstile | API v0 | Anti-spam gratis, sin cookies de rastreo |
| @vercel/analytics | 1.x | Visitas, gratis en Hobby |
| Playwright | 1.5x | E2E y capturas a 375 y 1440 |
| Vitest | 3.x | Pruebas de utilidades (contenido y validación) |
| ESLint + Prettier | los de `create-next-app` | Estilo uniforme |
| Vercel | Hobby | Hosting gratis |

Sin Supabase: no hay datos que guardar. Un panel para 4 o 5 proyectos sería sobreingeniería.

## 5. Estructura de carpetas

```
portafolio/
├── CLAUDE.md                     # este blueprint
├── DESIGN.md                     # dirección de arte que fija Taste (paso 3)
├── content/
│   └── projects/
│       ├── en/                   # un .mdx por proyecto, inglés
│       └── es/                   # el mismo slug, español
├── design/
│   ├── maqueta.md                # ruta de la maqueta, capturas y aprobación
│   ├── maqueta/                  # maqueta estática en HTML y CSS (paso 4)
│   └── capturas/                 # capturas de Playwright para revisión (no se versionan)
├── messages/
│   ├── en.json                   # textos de la interfaz
│   └── es.json
├── public/
│   ├── cv/                       # CV_Frander_Centeno_EN.pdf y _ES.pdf
│   ├── projects/<slug>/          # capturas de cada proyecto (.webp)
│   └── foto.webp                 # foto de Frander (opcional, ver 15)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # html lang, fuentes, header, footer, Analytics
│   │   │   ├── page.tsx          # inicio
│   │   │   ├── opengraph-image.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── projects/[slug]/
│   │   │       ├── page.tsx      # caso de estudio
│   │   │       └── opengraph-image.tsx
│   │   ├── actions/contact.ts    # Server Action del formulario
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── globals.css           # Tailwind + tokens
│   ├── components/
│   │   ├── layout/               # Header, Footer, LocaleSwitch, SkipLink
│   │   ├── home/                 # Hero, FeaturedProjects, Stack, Experience, About, Contact
│   │   ├── project/              # CaseHeader, CaseMeta, Figure, Results, NextProject
│   │   ├── mdx/                  # componentes permitidos dentro del MDX
│   │   └── ui/                   # Button, Link, Tag, Input, Textarea
│   ├── lib/
│   │   ├── content.ts            # lee y valida los MDX
│   │   ├── contact-schema.ts     # zod del formulario
│   │   ├── turnstile.ts          # verificación del token
│   │   └── site.ts               # URL base, redes, correo público
│   ├── data/
│   │   ├── experience.ts         # experiencia y educación (en/es)
│   │   └── stack.ts              # grupos de tecnologías
│   ├── i18n/
│   │   ├── routing.ts
│   │   └── request.ts
│   └── middleware.ts             # next-intl
├── tests/
│   ├── e2e/                      # Playwright
│   └── unit/                     # Vitest
├── playwright.config.ts
├── vitest.config.ts
└── .env.example
```

## 6. Modelo de datos

No hay base de datos. El contenido vive en archivos.

### 6.1 Frontmatter de cada MDX (`content/projects/<locale>/<slug>.mdx`)

```ts
// src/lib/content.ts
export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().max(60),
  summary: z.string().max(160),          // una oración, se usa en tarjetas y meta description
  tagline: z.string().max(90),           // la línea de la tarjeta del inicio
  type: z.enum(['web', 'back-end', 'data', 'qa']), // primer dato de la etiqueta de la tarjeta
  cardStack: z.array(z.string()).length(2), // las 2 tecnologías de la etiqueta; salen de stack
  role: z.string().max(80),              // ej. "Full stack developer, solo project"
  context: z.enum(['personal', 'internship', 'university', 'client']),
  year: z.number().int().min(2023).max(2030),
  stack: z.array(z.string()).min(2).max(10),
  metrics: z.array(z.object({            // máximo 3, se muestran grandes
    value: z.string().max(12),           // "99", "+50.9%", "5"
    label: z.string().max(40),
  })).max(3),
  links: z.object({
    demo: z.string().url().optional(),
    repo: z.string().url().optional(),
  }),
  cover: z.string().startsWith('/projects/').optional(),  // imagen 16:10; sin captura real, portada tipográfica
  coverAlt: z.string().min(10).optional(),                // va junto con cover
  coverLabel: z.string().max(40).optional(),              // texto del bloque tipográfico (por defecto, el título)
  demoSleeps: z.boolean().optional(),                     // el demo se duerme: se avisa "may take ~30 s to wake up"
  featured: z.boolean(),
  order: z.number().int().min(1),
});
```

Reglas:
- Cada slug existe en `en/` y en `es/`. Si falta uno, el build falla.
- `metrics` solo lleva números que aparecen en el README o en los documentos del repo de ese proyecto. Nunca se inventan.
- Las imágenes van en `.webp`, ancho máximo 2400 px, menos de 300 KB.

### 6.2 Cuerpo del MDX

Secciones en este orden, con `##`:
1. Problem / Problema
2. My role / Mi rol
3. What I built / Qué construí
4. Key decisions / Decisiones clave (2 a 4, cada una con la alternativa descartada)
5. Results / Resultados
6. What I'd do next / Qué haría después

Componentes permitidos dentro del MDX (`src/components/mdx/`): `<Figure src alt caption />`, `<Callout>`, `<Columns>`. No se permite HTML suelto ni scripts.

### 6.3 Datos fijos

- `src/data/experience.ts`: ASADA Gamalotal (práctica, jul 2025 a dic 2025), proyecto Municipalidad de Nicoya (2024 a 2025), educación (Ingeniería en Sistemas, Universidad Nacional, 2025), certificaciones (DataCamp: AI Engineer for Developers, Data Engineer, Data Analyst, Python Developer, SQL Associate; Scrum Fundamentals Certified; PM4R Professional del BID), idiomas (español nativo, inglés B1).
- `src/data/stack.ts`: Frontend (React, Next.js, TypeScript, Tailwind), Backend (NestJS, Java, Spring Boot, Supabase, PostgreSQL, RabbitMQ, REST), Datos (Python, pandas, DuckDB, Streamlit, Plotly), Calidad (Playwright, Cypress, Vitest, GitHub Actions). Todo lo que aparece en el stack tiene respaldo en algún proyecto del sitio (lo comprueba `content.test.ts`).
- `src/lib/site.ts`: `SITE_URL` desde env, GitHub `https://github.com/Frandercc1234`, LinkedIn `https://www.linkedin.com/in/frander-centeno-6a1982323/`, correo público `centenofrander@gmail.com`.

## 7. Seguridad

- **Sin autenticación.** Todo es público.
- **Formulario** (`src/app/actions/contact.ts`):
  1. Valida con zod: `name` 2 a 80 caracteres, `email` válido, `message` 20 a 2000 caracteres, `locale` `en|es`, `website` (honeypot) vacío, `startedAt` (marca de tiempo del render).
  2. Rechaza si el honeypot tiene texto o si pasaron menos de 3 s desde `startedAt` (devuelve éxito falso sin enviar, para no avisar al bot).
  3. Verifica el token de Turnstile contra `https://challenges.cloudflare.com/turnstile/v0/siteverify` con `TURNSTILE_SECRET_KEY`. Si falla, error `TURNSTILE`.
  4. Envía con Resend. `replyTo` es el correo del visitante. El asunto lleva el nombre, nunca HTML del usuario: el cuerpo es texto plano.
  5. No registra el mensaje en logs. Solo registra el código de error.
  6. Si `CONTACT_DRY_RUN=1`, la acción valida y verifica Turnstile pero no llama a Resend y devuelve `{ ok: true }` (para CI y e2e). Esa variable nunca se define en producción. Sin `CONTACT_DRY_RUN` y sin `RESEND_API_KEY` devuelve `SEND`, en cualquier entorno.
- **Encabezados** en `next.config.ts`: `Content-Security-Policy` que permita `self`, `challenges.cloudflare.com` (script y frame) y `va.vercel-scripts.com`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` sin cámara, micrófono ni geolocalización.
- **MDX:** solo se renderizan archivos del repo y solo con los componentes de la sección 6.2.
- **Enlaces externos:** `rel="noopener noreferrer"` y `target="_blank"` con texto visible que lo indique para lectores de pantalla.

## 8. API y lógica

| Pieza | Entrada | Salida | Errores |
|---|---|---|---|
| `getProjects(locale)` en `lib/content.ts` | `'en' \| 'es'` | Proyectos con frontmatter válido, ordenados por `order` | Lanza error en build si un frontmatter no valida o falta la traducción |
| `getProject(locale, slug)` | idioma y slug | `{ meta, content }` | `notFound()` si no existe |
| `generateStaticParams` en `projects/[slug]` | ninguna | Todos los pares idioma y slug | |
| `sendContact(prevState, formData)` (Server Action) | `FormData` del formulario | `{ ok: true }` o `{ ok: false, error: 'VALIDATION' \| 'TURNSTILE' \| 'SEND' , fields?: string[] }` | `VALIDATION` con campos, `TURNSTILE`, `SEND` si Resend falla |
| `verifyTurnstile(token, ip)` en `lib/turnstile.ts` | token e IP | `boolean` | `false` si la red falla |
| `sitemap.ts` | | URLs de inicio y casos en ambos idiomas con `alternates.languages` | |
| `robots.ts` | | Permite todo y apunta al sitemap | |
| `opengraph-image.tsx` (inicio y caso) | idioma y slug | PNG 1200x630 con nombre, rol o título del caso, con las fuentes del sitio | |

Todas las páginas son estáticas (`dynamic = 'error'` en páginas de contenido). El formulario es lo único que corre en el servidor.

## 9. Pantallas

### 9.1 Header y footer (todas las páginas)

- Header: nombre como enlace al inicio, enlaces a Projects, Experience y Contact (anclas del inicio), selector EN/ES que conserva la ruta, botón "Download CV". En 375: nombre, selector y un botón de menú que abre un panel con los enlaces.
- Footer: correo, GitHub, LinkedIn, año y "Built with Next.js, deployed on Vercel".
- Enlace "Skip to content" visible al recibir foco.

### 9.2 Inicio `/[locale]`

1. **Hero:** nombre, rol ("Full stack developer"), una línea de valor (web apps y dashboards de datos para pymes e instituciones públicas) y dos botones: "Download CV" (principal) y "Contact". Tres datos cortos: "Now" (graduación, en qué anda y ubicación UTC-6), "Looking for" (puestos full stack, back-end o QA, y freelance) y "Before". Desde 1024 van en las columnas 9 a 12; antes, bajo los botones.
2. **Casos destacados:** los proyectos con `featured: true` en orden, en filas con la misma estructura (portada, título, `tagline` y la etiqueta "TIPO · 2 tecnologías · contexto" en una línea; el rol solo va en el caso). Desde 1024: portada en las columnas 1 a 7 y texto en 8 a 12. Orden: `purareserva`, `payments-service`, `nicoya-zmt`, `pipeline-bccr`, `asada-gamalotal`. Toda la fila enlaza al caso.
3. **More projects / Más proyectos:** lista compacta sin imagen con `turismo-cr` y `qa-cypress`: caso y repo, y demo si existe.
4. **Stack:** los 4 grupos de `stack.ts`, como texto separado por comas, sin logos de colores.
5. **Experiencia y educación:** línea de tiempo simple con `experience.ts`.
6. **Sobre mí:** 3 o 4 oraciones en primera persona: cómo trabaja (planifica, prueba en móvil, entrega probado) y qué busca.
7. **Contacto:** formulario (nombre, correo, mensaje, Turnstile) y al costado correo, LinkedIn y GitHub.

Estados: el inicio no tiene datos remotos. El formulario tiene inicial, enviando (botón deshabilitado con texto "Sending…"), éxito (mensaje en lugar del formulario), error de validación (mensaje por campo, foco en el primero) y error de envío (mensaje con el correo como alternativa).

### 9.3 Caso de estudio `/[locale]/projects/[slug]`

1. Volver al inicio.
2. Encabezado: título, `summary`, rol, contexto, año, stack, botones a demo y repo si existen.
3. Imagen de portada.
4. Métricas (si hay) en grande.
5. Cuerpo MDX con las 6 secciones de 6.2. Ancho de lectura máximo 68 caracteres; las figuras pueden salir más anchas.
6. "Next project", que enlaza al siguiente por `order` (el último vuelve al primero).

Estado de error: slug inexistente → 404 del idioma.

### 9.4 Contenido base del caso `nicoya-zmt`

No hay repo público. El caso se escribe con esto: sistema de información para el departamento de Zona Marítimo Terrestre de la Municipalidad de Nicoya, proyecto universitario de la Universidad Nacional (2024 a 2025). Portal ciudadano para trámites y citas en línea, y dashboard administrativo con el estado de las solicitudes en 3 categorías (pendiente, aprobada, rechazada). En producción en https://zmtmn-usuarios.municoya.go.cr. Datos dados por Frander: stack React, TypeScript, Next.js (también como backend) y MariaDB, no Supabase; rol full stack en un equipo de 4 o más personas; ya tiene avisos por correo al ciudadano, pruebas y diseño para celular; en producción con ciudadanos reales, reemplazó un proceso presencial y en papel; citas en franjas fijas de media hora que la jefa del departamento administra y bloquea desde el dashboard. Sin métricas. Sin capturas de datos personales: solo pantallas sin datos o con datos de ejemplo.

### 9.5 404

Mensaje corto en el idioma, enlace al inicio y a los proyectos.

## 10. UI

### 10.1 Dirección

Editorial sobrio. Mucho aire, tipografía grande en títulos, un solo color de acento, foco en los casos. Se tiene que leer en 30 segundos. No puede parecer plantilla: nada de gradientes violetas, tarjetas con sombra en todo, iconos de colores por tecnología, emojis ni "Hi, I'm…" con mano saludando.

La skill Taste (`design-taste-frontend`) puede ajustar tipografías, paleta y layout en el paso 3, dentro de estas reglas. Lo que decida queda en `DESIGN.md` y manda sobre los valores por defecto de abajo.

### 10.2 Valores por defecto

- **Fondo:** blanco cálido `#FAF8F5`. **Texto:** `#1A1917`. **Texto suave:** `#5E5A54` (contraste AA sobre el fondo). **Bordes:** `#E4E0D9`.
- **Acento único:** `#C2410C` (botón principal, enlaces al pasar el mouse, foco). Verificar contraste AA del texto sobre el acento.
- **Tipografía:** títulos en una serif con carácter (por defecto Newsreader, 500 a 600) y texto en una sans legible (por defecto Schibsted Grotesk). No usar Inter, Roboto, Arial ni la fuente del sistema como principal. Cargar con `next/font`, solo los pesos que se usan.
- **Escala:** base 17 px en escritorio y 16 px en móvil; títulos del hero con `clamp()`, máximo cerca de 88 px.
- **Espaciado:** escala de 4 px; secciones con 96 a 160 px de separación vertical en escritorio y 64 a 96 px en móvil.
- **Radios:** 6 px en controles, 10 px en imágenes. Sin sombras salvo en el foco y en el menú móvil.

### 10.3 Responsive

Diseño para 375 y 1440, probado también en 768 y 1024. Sin scroll horizontal en ningún ancho. Objetivos táctiles de 44 px como mínimo.

### 10.4 Accesibilidad

- Contraste AA en todo el texto.
- Foco visible con anillo del color de acento.
- Jerarquía de títulos correcta: un `h1` por página.
- `alt` real en todas las imágenes.
- Formulario con `label`, errores ligados por `aria-describedby` y anuncio de éxito con `role="status"`.
- `lang` correcto en `<html>`.

### 10.5 Movimiento

Lo decide la skill de Emil (`emil-design-eng`), con estas reglas:
- Solo `transform` y `opacity`. Duraciones de 150 a 300 ms en la interfaz; entradas de sección hasta 500 ms.
- Easing de salida (`cubic-bezier(0.23, 1, 0.32, 1)` o el que defina la skill). Nunca `ease-in` en entradas.
- Motion solo para: entrada escalonada del hero, transición de la imagen de la tarjeta al caso (si el navegador soporta View Transitions, usarlo; si no, un fundido) y el panel del menú móvil. Todo lo demás, CSS.
- Con `prefers-reduced-motion: reduce`, sin desplazamientos: solo cambios de opacidad o nada.
- Nada se anima al hacer scroll más de una vez.

## 11. Variables de entorno

| Nombre | Ejemplo | Dónde se obtiene |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://frandercenteno.vercel.app` | URL de producción en Vercel (local: `http://localhost:3000`) |
| `RESEND_API_KEY` | `re_xxx` | resend.com → API Keys (plan gratis) |
| `CONTACT_TO_EMAIL` | `centenofrander@gmail.com` | Correo de la cuenta de Resend. Sin dominio propio, Resend solo envía a ese correo |
| `CONTACT_FROM_EMAIL` | `Portfolio <onboarding@resend.dev>` | Remitente de prueba de Resend. Cambia cuando haya dominio |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAA...` | dash.cloudflare.com → Turnstile → Add widget (hostnames: `localhost` y el dominio de Vercel) |
| `TURNSTILE_SECRET_KEY` | `0x4AAAA...` | El mismo widget |
| `CONTACT_DRY_RUN` | `1` | Solo CI y pruebas e2e: el formulario valida y verifica Turnstile pero no envía. Nunca se define en producción ni en Preview |

`.env.example` lleva todas con valores vacíos. Para pruebas locales y e2e, usar las claves de prueba de Turnstile: site `1x00000000000000000000AA` y secret `1x0000000000000000000000000000000AA`. En Preview de Vercel también se usan las de prueba.

## 12. Orden de construcción

Antes de cada paso de diseño, cargar la skill que se indica. Después de cada paso, correr su verificación. No avanzar si falla.

### Paso 0. Skills

- Instalar en el proyecto:
  ```
  npx -y skills add vercel-labs/skills --skill find-skills --agent claude-code
  npx -y skills add leonxlnx/taste-skill --skill design-taste-frontend --agent claude-code
  npx -y skills add emilkowalski/skill --skill emil-design-eng --agent claude-code
  npx -y skills add pbakaus/impeccable --agent claude-code
  ```
- Con find-skills, buscar skills para: SEO en Next.js, imágenes Open Graph, accesibilidad, next-intl y Playwright. Proponer como máximo 3, con nombre, instalaciones y para qué. Instalar solo las que Frander apruebe.
- **Verificación:** `ls .claude/skills` muestra `find-skills`, `design-taste-frontend`, `emil-design-eng` e `impeccable`. Existe `design/skills.md` con la lista instalada y para qué se usa cada una.

### Paso 1. Proyecto base

- `create-next-app` con TypeScript, App Router, Tailwind, ESLint y `src/`. Prettier. `strict` en tsconfig. Vitest y Playwright configurados (proyectos `mobile` 375x812 y `desktop` 1440x900).
- Estructura de carpetas de la sección 5 (vacía donde corresponda). `.env.example`.
- **Verificación:** `npm run build` y `npm run lint` pasan; `npx playwright test --list` no da error.

### Paso 2. Idiomas

- next-intl con `en` (por defecto) y `es`, `localePrefix: 'always'`. `/` redirige a `/en` o `/es` según `Accept-Language`. `messages/en.json` y `es.json` con todos los textos de la interfaz.
- Layout con `<html lang>`, header y footer de 9.1 sin estilos finales.
- **Verificación:** `npm run build`; abrir `/en` y `/es`, el selector cambia de idioma y conserva la ruta.

### Paso 3. Dirección de arte (Taste)

- Cargar `design-taste-frontend`. Con la sección 10 como brief, decidir tipografías, paleta, layout del hero, de las tarjetas y del caso. Respetar las reglas de 10.1 y el contraste AA.
- Escribir `DESIGN.md`: tokens (colores, tipos, escala, espacios, radios), layout de cada sección y lo que no se hace.
- Pasar los tokens a `@theme` en `globals.css` y cargar las fuentes con `next/font`.
- **Verificación:** `DESIGN.md` existe y nombra fuentes, colores con su contraste y el layout de cada sección de 9.2 y 9.3. `npm run build` pasa.

### Paso 4. Maqueta HTML

- Maqueta estática en `design/maqueta/` (HTML y CSS con los tokens de `DESIGN.md`, fuera de `src/`): inicio completo y el caso `purareserva`. Textos de ejemplo del largo real, portadas grises 16:10 y métricas en "00". Casos destacados: `purareserva` grande arriba y `nicoya-zmt`, `asada-gamalotal` y `turismo-cr` en fila de tres en 1440 (apilados en 375).
- Con Playwright, capturas de página completa de la maqueta (inicio y caso) a 375 y 1440 en `design/capturas/maqueta/`.
- Guardar la ruta y las capturas en `design/maqueta.md`.
- **Frander revisa la maqueta. No seguir al paso 6 sin su aprobación escrita en el chat.** Los cambios que pida se hacen en la maqueta y en `DESIGN.md`.
- **Verificación:** `design/maqueta.md` tiene la ruta, las 4 capturas y la línea "Aprobado por Frander: <fecha>".

### Paso 5. Contenido

- Clonar en `/tmp` los repos de la sección 2 y leer sus README (y `DESIGN.md`/`PRODUCT.md` en purareserva). Escribir los 5 MDX en inglés y en español con el esquema de 6.1 y las secciones de 6.2.
- Solo datos que estén en los repos o en la sección 9.4. Métricas solo si aparecen escritas ahí; si el README de un proyecto (por ejemplo `purareserva`) no trae cifras, `metrics` queda vacío y el bloque de métricas no se muestra. Tono: oraciones cortas, en primera persona, sin adjetivos de relleno ("robusto", "innovador", "seamless"), sin emojis.
- Capturas: con Playwright, sacar capturas de los demos en vivo (inicio y una pantalla clave, 1440x900) y guardarlas como `.webp` en `public/projects/<slug>/`. Para `asada-gamalotal` usar las capturas del README del repo si existen; si no, la portada es un bloque tipográfico con el nombre (sin imagen inventada).
- `src/data/experience.ts` y `stack.ts` con la sección 6.3.
- Pedirle a Frander los PDF del CV (EN y ES) y copiarlos a `public/cv/`. Si no están, el botón apunta a LinkedIn hasta que lleguen.
- **Verificación:** `npm run test` incluye una prueba que carga todos los MDX con `projectSchema` y comprueba que cada slug existe en los dos idiomas. Pasa.

### Paso 6. Inicio

- Componentes de `components/home/` según 9.2, `DESIGN.md` y la maqueta aprobada.
- **Verificación:** `npm run build`. Playwright saca capturas de `/en` y `/es` a 375 y 1440 en `design/capturas/`. Compararlas con las capturas de la maqueta (`design/capturas/maqueta/`) y anotar diferencias en el PR.

### Paso 7. Caso de estudio

- `projects/[slug]/page.tsx`, componentes de `components/project/` y `components/mdx/`, `generateStaticParams`, metadatos por caso, "Next project".
- **Verificación:** `npm run build` genera las 14 páginas de casos (7 casos × 2 idiomas). Capturas a 375 y 1440 de `purareserva` en los dos idiomas. Slug inexistente da 404.

### Paso 8. Formulario de contacto

- `contact-schema.ts`, `turnstile.ts`, `actions/contact.ts` y el componente `Contact` con `useActionState`, según 7 y 9.2.
- **Verificación:** pruebas de Vitest para el esquema (válido, cada campo inválido, honeypot, menos de 3 s). Con claves de prueba de Turnstile y `RESEND_API_KEY` real en `.env.local`, mandar un mensaje desde `/en` y confirmar que llega a `CONTACT_TO_EMAIL`.

### Paso 9. SEO y Open Graph

- `generateMetadata` en inicio y casos (título, descripción, `alternates` con `hreflang`, `openGraph`, `twitter`). `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` de inicio y de caso. JSON-LD `Person` en el inicio (nombre, cargo, URL, `sameAs` con GitHub y LinkedIn).
- Las imágenes Open Graph usan instancias estáticas de Newsreader y Schibsted Grotesk en `src/assets/fonts/` (Satori no lee WOFF2 ni fuentes variables), con su licencia OFL.
- **Verificación:** `npm run build`; `/sitemap.xml` lista 16 URLs (2 inicios y 14 casos); `/en/opengraph-image` y `/en/projects/purareserva/opengraph-image` devuelven PNG de 1200x630.

### Paso 10. Movimiento y detalles (Emil)

- Cargar `emil-design-eng`. Revisar cada interacción (hover y press de botones y tarjetas, foco, menú móvil, entradas del hero, transición tarjeta a caso) y aplicar la sección 10.5. Justificar en el PR cada animación: qué comunica, duración y easing.
- **Verificación:** `npm run build`. Prueba e2e con `reducedMotion: 'reduce'` que comprueba que el hero se ve completo al cargar. Lighthouse local (`npx lighthouse http://localhost:3000/en --preset=desktop` sobre `npm run start`) sin bajar de 95 en rendimiento.

### Paso 11. Repaso de diseño (Impeccable)

- Cargar `impeccable`. Correr `critique` sobre inicio y caso (375 y 1440), después `audit` y por último `polish`. Corregir todo lo P0 y P1. Guardar el puntaje antes y después en `design/critica.md`.
- **Verificación:** `design/critica.md` con puntaje antes y después, y sin hallazgos P0 o P1 abiertos. `npm run build` y `npm run lint` pasan.

### Paso 12. Pruebas e2e

- Escribir las pruebas de la sección 13 en `tests/e2e/`.
- Playwright corre contra `npm run build` + `next start` en el puerto 3100 (`playwright.config.ts`), con las claves de prueba de Turnstile, `RESEND_API_KEY` vacía y `CONTACT_DRY_RUN=1`: el formulario no envía correos reales y la prueba usa el mismo build que se despliega (el servidor de desarrollo fallaba de forma intermitente).
- **Verificación:** `npx playwright test` pasa en `mobile` y `desktop`.

### Paso 13. CI

- GitHub Actions en cada PR: `npm ci`, lint, typecheck (`tsc --noEmit`), `npm run test`, `npm run build` y Playwright (con claves de prueba de Turnstile y sin envío real: con `CONTACT_DRY_RUN=1` el action de contacto no llama a Resend y devuelve `{ ok: true }`; en producción esa variable nunca se define).
- **Verificación:** un PR de prueba deja el check en verde.

### Paso 14. Despliegue

- Seguir la sección 14.
- **Verificación:** la URL de producción abre `/en` y `/es`; el formulario llega al correo; Lighthouse de producción sin bajar de 95 en las cuatro categorías para `/en` y un caso, en móvil y escritorio. Anotar los puntajes en el README.

## 13. Pruebas

**Vitest (`tests/unit/`)**
- `content.test.ts`: todos los MDX validan contra `projectSchema`; cada slug existe en `en` y `es`; `order` no se repite.
- `contact-schema.test.ts`: caso válido, cada campo inválido, honeypot con texto y envío en menos de 3 s.

**Playwright (`tests/e2e/`, proyectos `mobile` y `desktop`)**
- `home.spec.ts`: `/` redirige a `/en` (con `Accept-Language: en`) y a `/es` (con `es`); el hero muestra nombre y botón de CV; los casos destacados enlazan a su página; sin scroll horizontal (`scrollWidth <= innerWidth`).
- `locale.spec.ts`: el selector cambia de `/en/projects/purareserva` a `/es/projects/purareserva`.
- `project.spec.ts`: cada caso carga en los dos idiomas con `h1`; "Next project" enlaza al siguiente; slug falso da 404.
- `contact.spec.ts`: errores por campo con el formulario vacío; envío válido con claves de prueba muestra el mensaje de éxito.
- `a11y.spec.ts`: navegación con Tab llega al "Skip to content" primero y el foco es visible; con `@axe-core/playwright`, sin violaciones serias ni críticas en inicio y un caso.
- `menu.spec.ts` (solo `mobile`): el menú abre, enlaza a las anclas y cierra con Escape.
- `capturas.spec.ts`: guarda capturas de página completa de inicio y de `purareserva`, en los dos idiomas, a 375 y 1440, en `design/capturas/` (no compara, es para revisión).

## 14. Despliegue

1. Crear el repo público `Frandercc1234/portafolio` y subir `main`.
2. Vercel → Add New → Project → importar el repo. Framework Next.js, sin cambios de build.
3. Nombre del proyecto en Vercel: `frander-centeno`, para que la URL sea `frander-centeno.vercel.app`. Estaba tomado: el proyecto quedó en `frandercenteno` y la URL de producción es `https://frandercenteno.vercel.app` (`frander-centeno-orcin.vercel.app` redirige ahí con 308).
4. Variables (Settings → Environment Variables):
   - Production: todas las de la sección 11 con los valores reales, y `NEXT_PUBLIC_SITE_URL` con la URL final.
   - Preview: las mismas, pero las claves de prueba de Turnstile.
5. En Cloudflare Turnstile, agregar el hostname de producción al widget.
6. Deploy. Revisar `/en`, `/es`, un caso, el formulario y `/sitemap.xml`.
7. Activar Vercel Analytics en el proyecto.
8. Después: agregar la URL al perfil de GitHub (`Frandercc1234/Frandercc1234`), a LinkedIn (sección Destacados y Contacto) y al CV.

**14.4 Cambio a dominio propio (más adelante):** comprar el `.dev`, agregarlo en Vercel → Domains, cambiar `NEXT_PUBLIC_SITE_URL`, agregar el hostname en Turnstile y verificar el dominio en Resend para usar `CONTACT_FROM_EMAIL` con ese dominio.

## 15. Supuestos y riesgos

- **Supuesto:** inglés por defecto porque el público principal son reclutadores y 14 de 19 vacantes revisadas estaban en inglés.
- **Supuesto:** Resend sin dominio solo envía al correo de la cuenta. Alcanza para un formulario que le llega a Frander.
- **Supuesto:** la foto de Frander es opcional. Si no la da, el hero es solo tipográfico.
- **Riesgo:** el demo de turismo-cr en Streamlit Community Cloud se duerme y tarda en despertar. En la tarjeta y en el caso se avisa "may take ~30 s to wake up".
- **Riesgo:** inglés B1. Los textos en inglés se escriben simples y Frander los revisa antes del paso 14.
- **Riesgo:** el caso de Nicoya no tiene repo público ni métricas. Se apoya en el sistema en producción y en el rol.
- **Riesgo:** Taste o Impeccable pueden proponer cambios que choquen con la maqueta aprobada. Manda la maqueta; los cambios grandes se consultan con Frander.

## 16. Reglas para el constructor

1. Seguir el orden de la sección 12. No saltar pasos.
2. Correr la verificación de cada paso y no avanzar si falla.
3. No agregar nada fuera de la sección 2: nada de blog, base de datos, modo oscuro ni librerías no listadas en la sección 4 sin preguntar.
4. Código simple y organizado. Componentes chicos con nombres claros. Tailwind, sin estilos en línea.
5. Todo responsive: probar a 375 y 1440 antes de dar algo por hecho.
6. No inventar datos de los proyectos. Si algo no está en los repos o en este documento, preguntar.
7. Un PR por paso o por grupo de pasos chico, con capturas a 375 y 1440 cuando haya cambios visuales.
8. Responder y escribir commits en español. Los textos del sitio van en el idioma de cada página.
9. Los pasos 4 (maqueta) y 14 (producción) necesitan el visto bueno de Frander.
