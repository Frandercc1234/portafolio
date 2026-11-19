# Repaso de diseño con Impeccable (paso 11)

Objetivos: el inicio (`/en` y `/es`) y el caso (`purareserva`, más los otros cuatro en las pruebas), a 375 y 1440 px. Orden: `critique`, `audit`, `polish`. Hecho el 2026-11-18 contra el build de producción local (`next start`).

Método: ⚠️ DEGRADED: single-context. La crítica pide dos sub-agentes aislados (revisión de diseño y detector). En esta sesión los sub-agentes solo se usan si se piden de forma explícita, así que la revisión de diseño se terminó y se anotó antes de leer cualquier resultado del detector, y después se corrió el detector (24 escaneos de URL: 12 páginas a 1280×800 y a 390×844) y la auditoría técnica (axe, objetivos táctiles, encabezados, Lighthouse). No se usó la superposición del detector en el navegador, porque no hay una pestaña `[Human]`.

No hay `PRODUCT.md`: son refinamientos acotados sobre la implementación existente, así que no bloqueó. Queda la oferta de correr `/impeccable init` después.

## Puntajes, antes y después

| Medida | Antes | Después |
|---|---|---|
| Crítica del inicio (Nielsen, 8 de 10 heurísticas: la 7 y la 10 son `n/a` en una página de portafolio) | 25/32 (78 %, Bueno) | 26/32 (81 %, Bueno) |
| Crítica del caso (mismas 8 heurísticas) | 26/32 (81 %, Bueno) | 28/32 (88 %, Bueno) |
| Auditoría técnica | 15/20 (Bueno) | 17/20 (Bueno) |
| Hallazgos del detector | 33 en 8 escaneos iniciales (11 de ancho de línea en los casos; el resto, palabras sueltas y títulos desbalanceados) | 0 en 24 escaneos (12 páginas a 1280×800 y a 390×844) |
| axe (WCAG 2.0 a 2.2 AA y buenas prácticas, 12 vistas) | 0 | 0 |
| Objetivos táctiles menores de 44 px (fuera del texto corrido) | 3 (los enlaces de contacto, de 32 a 34 px) | 0 |
| Lighthouse escritorio, rendimiento | 100 | 100 |
| Lighthouse móvil, rendimiento (inicio / caso) | 94 / 96 a 99 | 88 a 94 / 97 a 99 |
| Lighthouse accesibilidad, mejores prácticas, SEO | n/d | 100, 96 y 100 |

La puntuación del rendimiento móvil del inicio varía entre corridas (TBT de 100 a 310 ms). El cambio entre "antes" y "después" está dentro de ese ruido: este paso no tocó el JavaScript.

### Auditoría por dimensión (0 a 4)

| Dimensión | Antes | Después | Hallazgo principal |
|---|---|---|---|
| Accesibilidad | 3 | 4 | Antes: objetivos de 32 a 34 px y un bloqueo global de las transiciones con movimiento reducido. Ahora 44 px y se conservan las transiciones de color y opacidad |
| Rendimiento | 3 | 3 | Inicio en móvil entre 88 y 94: el elemento del LCP es la portada de PuraReserva (ver abajo) |
| Temas | 3 | 3 | Tokens en `@theme`. Quedan un `text-white` y los colores de `og.tsx`, que no pueden usar variables CSS. El modo oscuro está fuera de alcance |
| Diseño adaptable | 3 | 4 | Sin desborde horizontal en 12 vistas; los objetivos táctiles ya cumplen 44 px |
| Integridad de la implementación | 3 | 3 | Detector en 0, pero siguen las dos decisiones abiertas de abajo |
| **Total** | **15/20** | **17/20** | |

## Hallazgos corregidos (P0 y P1, más los P2 y P3 seguros)

No hubo P0.

| Severidad | Hallazgo | Corrección |
|---|---|---|
| P1 | Ancho de lectura del caso: `68ch` medía unos 87 caracteres por línea (el blueprint pide 68) | `max-width: 54ch`, que son unos 68 caracteres con Schibsted Grotesk |
| P1 | Enlaces de contacto (correo, LinkedIn, GitHub) de 32 a 34 px; el blueprint pide 44 px | `min-h-11` y alineación centrada |
| P2 | Con movimiento reducido, una regla global ponía todas las transiciones en 0,01 ms, incluido el cambio de color al pasar el puntero | Se conservan las transiciones de color, fondo, borde y opacidad; solo `transform` cambia al instante |
| P2 | El punto separador de la pila de tecnologías abría una línea ("· React · TypeScript…") | Componente `TagLine`: cada elemento y su punto van unidos con espacios de no separación |
| P2 | Las capturas claras (Nicoya, turismo) se fundían con el fondo del sitio | Anillo interior de 1 px (`ink` al 10 %) en las portadas |
| P2 | Palabras sueltas en la última línea y títulos desbalanceados | `text-wrap: balance` en h1 a h3 y `text-wrap: pretty` en párrafos, listas y definiciones |
| P3 | Detalle de relleno "Education." en la línea de tiempo | Se quitó; el detalle es opcional |
| P3 | `Callout` con filete lateral de 2 px en el acento | 1 px |
| P3 | Sombra del menú con un `rgb(...)` literal | Se arma con el token de tinta |
| P3 | Navegador con valores por defecto | Selección, cursor, `accent-color` y subrayado con la paleta; cifras tabulares en las métricas |

## Pendiente: cambios que tocan la maqueta aprobada y esperan a Frander

1. **[P2] Etiquetas sobre un título.** La guía de calidad de Impeccable prohíbe una etiqueta pequeña sobre un título. Hoy hay tres casos: el rol ("FULL STACK DEVELOPER") sobre el h1 del hero, el contexto ("PERSONAL", "UNIVERSITY") sobre el título de cada tarjeta, y los periodos de la línea de tiempo (estos van en otra columna, no encima). Está en la maqueta aprobada. Opción: el rol pasa debajo del nombre y el contexto va en la línea de las etiquetas de stack.
2. **[P2] Composición del hero en 1440.** El nombre y la línea de valor ocupan el lado izquierdo y queda vacía la mitad derecha. La ubicación (izquierda) y el estado (extremo derecho) quedan separados por 1000 px, y el primer trabajo asoma solo como un borde al pie de la pantalla. Opciones: juntar ubicación y estado en un solo renglón a la izquierda, o usar el hueco derecho para la foto opcional de Frander cuando exista.
3. **[P3] Rendimiento móvil del inicio (88 a 94 contra la meta de 95).** El elemento del LCP es la portada de PuraReserva, que asoma 119 px dentro del primer viewport de móvil. Ya lleva `fetchPriority="high"`, `sizes` exactos y 17 a 23 KB. Lighthouse la simula contra 4G lenta y el total ronda 2,9 s. Si la portada empezara 36 px más abajo, el LCP pasaría a ser texto (como en el caso, que da 97 a 99). Eso cambia el ritmo vertical de la maqueta.
4. **[P3] "Download CV" dos veces en la primera pantalla** (cabecera y hero): lo pide el blueprint (9.1 y 9.2), no se cambia.
5. **[P3] Tres cifras grandes con etiqueta pequeña** en el caso: es la plantilla de métricas que la guía de calidad desaconseja, pero la pide el blueprint (9.3), no se cambia.
