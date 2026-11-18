# Maqueta (paso 4)

Maqueta estática en HTML y CSS con los tokens de `DESIGN.md`. Vive fuera de `src/` y no forma parte de la app.

## Archivos

| Pieza | Ruta |
|---|---|
| Inicio | `design/maqueta/index.html` |
| Caso `purareserva` | `design/maqueta/caso.html` |
| Estilos y tokens | `design/maqueta/maqueta.css` |
| Script de capturas | `design/maqueta/capturar.mjs` (`node design/maqueta/capturar.mjs`) |

Las fuentes (Newsreader y Schibsted Grotesk) se cargan desde Google Fonts, así que abrir la maqueta necesita conexión.

## Capturas de página completa (`design/capturas/maqueta/`)

- `inicio-1440.png`
- `inicio-375.png`
- `caso-purareserva-1440.png`
- `caso-purareserva-375.png`

Sin scroll horizontal en ninguna de las cuatro (medido: `scrollWidth - innerWidth = 0`).

## Contenido de ejemplo

Textos de ejemplo del largo real. Portadas grises 16:10 y métricas en "00". Contextos y resúmenes salen del blueprint; los que no están en él quedan marcados:

- `nicoya-zmt`: stack dado por Frander: React, Next.js (como backend), TypeScript y MariaDB.
- Caso `purareserva`: el año dice "2025 (example)".
- El cuerpo del caso es texto de muestra, no contenido real.

## Casos destacados

`purareserva` grande arriba. Debajo, en una fila de tres en 1440 y apilados en 375: `nicoya-zmt` (University), `asada-gamalotal` (Internship) y `turismo-cr` (Personal).

## Figma

Descartado para este paso por el límite mensual del plan Starter. El archivo "Portafolio Frander" (https://www.figma.com/design/KnR1KtUmABzloZG6S1vaXy) queda como está, con la colección de variables "Tokens" y sin frames.

## Cambios pedidos en la revisión (aplicados)

1. Hero: sin espacio vacío bajo los botones; ubicación y estado van justo después.
2. Contacto: espacio reservado de 300×65 para Turnstile sobre el botón "Send message".
3. Caso en 375: las 3 métricas en una fila, número a 32 px.
4. Stack de `nicoya-zmt` en la tarjeta (4 etiquetas, por pedido de Frander) y en el MDX del paso 5.

Regla para el paso 5: si el README de `purareserva` no trae cifras, el bloque de métricas no se muestra.

Aprobado por Frander: 2026-11-18
