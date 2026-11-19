# DESIGN.md: dirección de arte del portafolio

Fijada en el paso 3 con la skill `design-taste-frontend`, usando la sección 10 de `CLAUDE.md` como brief. Manda sobre los valores por defecto de 10.2. Si la maqueta de Figma aprobada (paso 4) difiere, manda la maqueta y este archivo se actualiza.

## 1. Dirección

Editorial sobrio. Tipo de página según Taste: **servicio** (una persona que se contrata), sin efectos, sin escenas, sin fondos con gradiente. El trabajo es la imagen: capturas reales de los proyectos, una por pantalla como máximo. Un solo acento. Se lee en 30 segundos.

Reglas de Taste que se adoptan:

- El hero va solo en la primera pantalla; no asoma la sección siguiente.
- Bordes izquierdo y derecho iguales: todo vive en el mismo contenedor.
- Una acción principal por pantalla.
- Toda tarjeta o enlace con imagen responde al puntero (sección 6).
- Sin pie de foto bajo las imágenes; el crédito, si hace falta, va en el pie de página.
- Sin violeta, sin gradientes, sin sombras decorativas, sin iconos de colores por tecnología.

Reglas de Taste que **no** se adoptan, porque chocan con el blueprint: secciones de exactamente 1 o 2 pantallas de alto (`100svh`). Aquí mandan los espacios de 10.2 (96 a 160 px en escritorio, 64 a 96 px en móvil) y el contenido decide la altura.

## 2. Color

| Token                   | Valor     | Uso                                             | Contraste                                                      |
| ----------------------- | --------- | ----------------------------------------------- | -------------------------------------------------------------- |
| `--color-paper`         | `#FAF8F5` | fondo                                           | base                                                           |
| `--color-surface`       | `#F2EFEA` | bandas y bloques de apoyo (uso mínimo)          | ink 15.32:1                                                    |
| `--color-ink`           | `#1A1917` | texto                                           | 16.57:1 sobre fondo (AAA)                                      |
| `--color-ink-soft`      | `#5E5A54` | texto secundario, bordes de campos              | 6.46:1 sobre fondo (AA)                                        |
| `--color-line`          | `#E4E0D9` | filetes y separadores (decorativos)             | 1.24:1, nunca lleva texto ni delimita un campo                 |
| `--color-accent`        | `#C2410C` | botón principal, enlaces en hover, foco, estado | 4.89:1 como texto sobre fondo (AA); blanco sobre acento 5.18:1 |
| `--color-accent-strong` | `#9A3412` | hover y press del botón principal               | blanco sobre él 7.31:1                                         |

Reglas: el acento no se usa como fondo de secciones ni en más de un elemento principal por pantalla. Sobre `--color-surface` el acento como texto da 4.52:1, solo en tamaño normal o mayor (AA pasa por 0.02). Los campos del formulario usan `--color-ink-soft` en el borde (mínimo 3:1 para componentes de interfaz).

## 3. Tipografía

Cargadas con `next/font/google`, solo los pesos usados, `display: swap`.

| Rol     | Fuente                                          | Pesos          | Uso                                  |
| ------- | ----------------------------------------------- | -------------- | ------------------------------------ |
| Títulos | **Newsreader** (serif con carácter, eje óptico) | 500 y 600      | h1 a h3, cifras de métricas, citas   |
| Texto   | **Schibsted Grotesk**                           | 400, 500 y 600 | cuerpo, interfaz, botones, etiquetas |

Escala (base 16 px en móvil, 17 px desde 768 px):

| Nivel                          | Móvil                                               | Escritorio  | Interlineado | Tracking           |
| ------------------------------ | --------------------------------------------------- | ----------- | ------------ | ------------------ |
| Hero h1 (nombre)               | `clamp(2.75rem, 1.4rem + 6vw, 5.5rem)` (44 a 88 px) | hasta 88 px | 1.02         | -0.025em           |
| h2 de sección                  | 32 px                                               | 48 px       | 1.1          | -0.02em            |
| h3 (tarjetas, decisiones)      | 24 px                                               | 28 px       | 1.2          | -0.01em            |
| Lead (línea de valor, summary) | 20 px                                               | 24 px       | 1.4          | 0                  |
| Cuerpo                         | 16 px                                               | 17 px       | 1.65         | 0                  |
| Etiqueta (eyebrow, meta)       | 13 px                                               | 14 px       | 1.3          | 0.04em, mayúsculas |

Ancho de lectura del cuerpo MDX: 68 caracteres por línea. Con Schibsted Grotesk eso es `max-width: 54ch` (con `68ch` las líneas medían unos 87 caracteres). Los títulos van con `text-wrap: balance` y los párrafos con `text-wrap: pretty`, para que no quede una palabra sola en la última línea. Nunca Inter, Roboto, Arial ni la fuente del sistema como principal (la pila de respaldo solo sirve mientras carga).

## 4. Espacio, forma y contenedor

- Escala de 4 px. Contenedor máximo 1280 px, márgenes laterales 24 px (móvil), 48 px (768+) y automáticos a 1440 (queda 80 px a cada lado).
- Separación vertical entre secciones: 64 a 96 px en móvil (`clamp`), 96 a 160 px en escritorio. Una sección nunca empieza pegada al borde de la anterior ni deja el h2 colgando.
- Radios: 6 px controles y botones, 10 px imágenes. Sin sombras, salvo el anillo de foco y el panel del menú móvil.
- Filetes de 1 px `--color-line` para separar filas (experiencia, otros proyectos, métricas). Nada de cajas anidadas.
- Objetivos táctiles de 44 px como mínimo.
- Cuadrícula de 12 columnas con 24 px de hueco (16 en móvil).

## 5. Layout por sección

### Cabecera y pie (9.1)

- Cabecera de 72 px (56 en móvil), fondo `--color-paper`, filete inferior. Nombre a la izquierda en Newsreader 600; enlaces centrados; selector EN/ES y botón "Download CV" (secundario, borde ink) a la derecha. En 375: nombre, selector y botón de menú; el panel baja bajo la cabecera, ancho completo, sin sombra salvo la del menú.
- Pie: filete superior, tres enlaces en fila (correo, GitHub, LinkedIn), línea de año y "Built with Next.js, deployed on Vercel". Sin columnas decorativas.

### Inicio (9.2)

1. **Hero (tipográfico, sin foto).** Altura según su contenido. Escritorio: columnas 1 a 9. El h1 con el nombre va a 88 px. Debajo, el rol ("Full stack developer") como subtítulo en Newsreader 500 de 28 px (22 px en móvil) y color suave; ninguna etiqueta va encima del nombre. Después la línea de valor en Lead (`max-width: 36ch`) y los botones: "Download CV" (principal) y "Contact" (secundario). Bajo los botones, en un solo renglón y sin filete, la ubicación a la izquierda y el estado ("Open to full stack roles and freelance projects") con un punto de acento de 8 px. En 1440×900 la primera tarjeta ya asoma en la primera pantalla (la imagen se ve a más de la mitad): por eso "Selected work" empieza 80 px bajo el hero y su título deja 40 px antes de la tarjeta. Si Frander da `foto.webp`, ocupa las columnas 10 a 12, 4:5, radio 10; si no, esas columnas quedan vacías. Móvil: todo en una columna, botones a ancho completo, ubicación y estado apilados.
2. **Casos destacados.** h2 a la izquierda en la primera fila. El primer caso ocupa las 12 columnas: imagen 16:10 en columnas 1 a 7 y texto en 8 a 12 (título h3, `summary` y una línea que empieza por el contexto seguido del stack, por ejemplo "Internship · Next.js · Supabase", sin pastillas de color). Los demás van de a dos (columnas 1 a 6 y 7 a 12), imagen arriba y texto abajo. Toda la tarjeta es un enlace. Móvil: una columna, imagen arriba.
3. **Otros proyectos.** Lista de filas separadas por filetes: nombre en h3, una línea, enlaces "Demo" y "Repository" a la derecha. Sin imagen.
4. **Stack.** Cuatro grupos en 4 columnas (2 en tablet, 1 en móvil). Título de grupo en Newsreader 500, tecnologías como lista de texto, una por línea. Sin logos.
5. **Experiencia y educación.** Línea de tiempo simple: columna izquierda con el periodo (etiqueta), columna derecha con el cargo en h3 y una línea. Filetes entre filas. Certificaciones e idiomas como dos bloques de texto debajo.
6. **Sobre mí.** h2 en columnas 1 a 4; texto en columnas 6 a 12, en Newsreader 500 a 24 px (28 en escritorio), 3 o 4 oraciones, `max-width: 40ch`.
7. **Contacto.** Formulario en columnas 1 a 7 (etiquetas visibles arriba de cada campo, campo con borde `--color-ink-soft`, radio 6, errores bajo el campo en acento) y a la derecha, columnas 9 a 12, correo, LinkedIn y GitHub como enlaces grandes. Entre el campo de mensaje y el botón va un espacio reservado de 300×65 px para el widget de Turnstile (en la maqueta, un recuadro punteado). Botón "Send message" principal.

### Caso de estudio (9.3)

1. Enlace "Back to home" arriba, texto pequeño con flecha.
2. Encabezado: h1 en Newsreader (hasta 72 px) en columnas 1 a 9; `summary` en Lead debajo. Una lista de definición en 4 columnas (Role, Context, Year, Stack) sobre un filete; botones "View demo" (principal) y "View repository" (secundario) si existen.
3. Portada 16:10 en las 12 columnas, radio 10, sin pie de foto.
4. Métricas (si hay): hasta 3, cifra en Newsreader 600 a 72 px y etiqueta debajo; filetes arriba y abajo. En 375 las tres van en una sola fila, con la cifra a 32 px y la etiqueta a 13 px. Si el proyecto no tiene cifras en su README, el bloque no se muestra.
5. Cuerpo MDX en columna centrada de 68ch. h2 de cada sección en Newsreader 500, con un número pequeño opcional (01 a 06) a la izquierda en escritorio. Las `Figure` pueden ocupar hasta 1000 px de ancho; `Callout` con filete lateral de acento de 2 px; `Columns` en dos columnas desde 768.
6. "Next project": bloque con filete superior, etiqueta y el título del siguiente caso en Newsreader grande como enlace; en hover el título se subraya con una línea que se dibuja.

### 404 (9.5)

Mensaje en h1 serif, una línea, dos enlaces en fila. Centrado a la izquierda del contenedor, no al centro de la pantalla.

## 6. Interacción (la afina el paso 10, con `emil-design-eng`)

- Botón: en hover el fondo pasa a `--color-accent-strong`; en press baja 1 px (`translateY(1px)`). Foco: anillo de 2 px en acento con 2 px de separación.
- Tarjeta de caso: en hover sube 2 px, la imagen hace zoom a 1.02 dentro de su marco con `overflow: hidden`, y el título dibuja un subrayado.
- Enlaces de texto: subrayado que se dibuja de izquierda a derecha.
- Solo `transform` y `opacity`, 150 a 300 ms, easing `cubic-bezier(0.23, 1, 0.32, 1)`. Con `prefers-reduced-motion: reduce` no hay desplazamientos.
- Nada se anima al hacer scroll, salvo la entrada del hero (una vez al cargar).

## 7. Lo que no se hace

- Gradientes, sombras en tarjetas, violeta, iconos de colores por tecnología, emojis, "Hi, I'm…" con mano saludando.
- Pies de foto bajo las imágenes. Capturas inventadas: una portada tipográfica sustituye a la imagen que no existe.
- Más de un acento. Fondo oscuro (queda fuera de alcance).
- Efectos, shaders, escenas, parallax, tilt, carruseles y cursores personalizados.
- Cifras o métricas que no estén en los repos de cada proyecto.
- Imágenes sin `alt` real. Texto en `--color-line`.

## 8. Fuentes de la decisión

- Paleta y tipografía: los valores por defecto de 10.2 se mantienen; la skill ofrecía azules y sans únicas, que chocan con la regla de serif y acento cálido del blueprint.
- Contrastes calculados con la fórmula WCAG 2.x sobre `#FAF8F5`.

## 9. Detalles del navegador y de las imágenes (paso 11)

- Las portadas llevan un anillo interior de 1 px (`ink` al 10 %) para que las capturas claras no se fundan con el fondo.
- La selección de texto usa el acento al 22 % sobre el fondo; el cursor de los campos y el `accent-color` usan el acento; el subrayado de enlaces va a 0,18 em de distancia y 1 px de grosor.
- Las cifras de las métricas usan numerales tabulares.
- Las listas en una línea (etiquetas de stack) unen cada elemento con su punto con espacios de no separación: el punto nunca abre una línea.
- El filete lateral de un `Callout` es de 1 px.
- Objetivos táctiles de 44 px también en los enlaces de contacto.
