# Movimiento (paso 10)

Revisado con la skill `emil-design-eng` y las reglas de la sección 10.5 de `CLAUDE.md`. Solo `transform` y `opacity`. Salida con `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out-strong`); nunca `ease-in` en entradas. Con `prefers-reduced-motion: reduce` no hay desplazamientos.

## Lo que se anima

| Interacción                                                     | Qué comunica                                                                      | Duración                                                                                              | Easing          | Propiedades                                                                                          | Cómo                                                                                                                                                 |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entrada del hero (rol, nombre, línea de valor, botones, estado) | Que la página llegó y en qué orden leerla. Pasa una sola vez, al cargar           | 500 ms por pieza, retrasos de 0, 60, 120, 190 y 270 ms (no uniformes, el último termina a los 770 ms) | ease-out fuerte | `opacity` y `translateY(12px)`                                                                       | CSS (`@keyframes enter-up`). No usa JavaScript: el texto está en el HTML y nada queda en `opacity: 0` esperando a hidratar, así no se retrasa el LCP |
| Presión de botones                                              | Que la interfaz oyó el toque                                                      | 150 ms                                                                                                | ease-out fuerte | `transform: scale(0.97)` en `:active`; el color de fondo cambia a la vez                             | CSS                                                                                                                                                  |
| Hover de botones                                                | Que el botón es pulsable                                                          | 150 ms                                                                                                | ease-out fuerte | `background-color`                                                                                   | CSS                                                                                                                                                  |
| Hover de tarjetas de caso                                       | Que toda la tarjeta es un enlace                                                  | 200 ms la tarjeta, 300 ms la imagen                                                                   | ease-out fuerte | tarjeta `translateY(-2px)`, imagen `scale(1.02)` dentro de su marco, y el título dibuja su subrayado | CSS, solo con `hover: hover` (Tailwind 4 ya lo condiciona; en táctil no se queda pegado)                                                             |
| Presión de tarjetas                                             | Confirmación del toque                                                            | 200 ms                                                                                                | ease-out fuerte | `scale(0.99)` en `:active`                                                                           | CSS                                                                                                                                                  |
| Enlaces de texto                                                | Que el texto es un enlace                                                         | 250 ms                                                                                                | ease-out fuerte | el subrayado se dibuja de izquierda a derecha                                                        | CSS (`.underline-draw`)                                                                                                                              |
| Menú móvil: abrir                                               | Que el panel cuelga del botón                                                     | 200 ms                                                                                                | ease-out fuerte | `opacity` y `translateY(-8px)`, origen arriba                                                        | Motion (`LazyMotion` + `m`, con `transform` completo para que corra en el compositor). Las funciones de animación se cargan aparte                   |
| Menú móvil: cerrar                                              | Que el sistema responde ya                                                        | 150 ms (sale más rápido de lo que entra)                                                              | ease-out fuerte | `opacity` y `translateY(-8px)`                                                                       | Motion (`AnimatePresence`). Escape cierra el menú                                                                                                    |
| Tarjeta a caso                                                  | Que la imagen de la tarjeta es la misma portada del caso: da continuidad espacial | 320 ms la portada, 200 ms el resto de la página                                                       | ease-out fuerte | la imagen se mueve y escala; el resto hace un fundido                                                | View Transitions API (`startViewTransition`). La portada pulsada recibe `view-transition-name: project-cover` y la del caso lo trae en su CSS        |
| Fundido de la página del caso                                   | Reemplaza a la transición anterior en navegadores sin View Transitions            | 200 ms                                                                                                | ease-out fuerte | `opacity`                                                                                            | CSS, bajo `@supports not (view-transition-name: none)`                                                                                               |
| Mensaje de envío exitoso                                        | Que el formulario cambió de estado                                                | 200 ms                                                                                                | ease-out fuerte | `opacity`                                                                                            | CSS                                                                                                                                                  |

## Lo que no se anima

- **Navegación con teclado.** Un clic generado por Enter (`event.detail === 0`) navega sin View Transition: son acciones repetidas y no conviene demorarlas.
- **Foco.** El anillo de foco aparece al instante.
- **Scroll.** Nada se anima por hacer scroll.
- **Anclas del header y del menú.** Saltan sin animación (`scroll-behavior: auto`).
- **Errores del formulario.** Aparecen al instante junto con el foco al primer campo.

## Con `prefers-reduced-motion: reduce`

- La entrada del hero no corre: todo se ve completo desde el primer cuadro (`animation: none`).
- El menú móvil abre y cierra solo con `opacity`, sin `translateY`.
- La transición de la tarjeta al caso no se usa: se navega directo.
- Las transiciones de color, fondo, borde y opacidad se conservan: son la respuesta al puntero. `transform` queda fuera de la lista de propiedades animadas, así que el hover y la presión de botones y tarjetas cambian de estado al instante, sin desplazarse.
- El mensaje de éxito mantiene su fundido de opacidad, que está permitido.

## Pruebas

`tests/e2e/motion.spec.ts`:

- Con `reducedMotion: 'reduce'` el hero se ve completo al cargar (opacidad 1, sin transformación ni animación).
- Con movimiento reducido el menú abre sin desplazamiento y un clic en una tarjeta no usa View Transition.
- Sin preferencia, el hero entra escalonado con retrasos crecientes y el último a 0,3 s o menos.
- Un clic en una tarjeta llama a `startViewTransition` y llega al caso; con Enter no lo llama.

## Rendimiento

Lighthouse local (`npx lighthouse http://localhost:3101/en --preset=desktop`, sobre `next start`): 100 de rendimiento en tres corridas (LCP 0,6 s, TBT 0 ms, CLS 0). El caso `purareserva` en escritorio: 100. El inicio en móvil (preset por defecto, 4G simulada): 94. La verificación del paso 14 pide 95 o más en móvil y escritorio, así que ese número se revisa de nuevo con producción.
