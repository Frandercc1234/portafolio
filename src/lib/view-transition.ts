// Transición de la portada de la tarjeta a la del caso con la View Transitions API.
// Si el navegador no la soporta, o la persona pidió menos movimiento, se navega sin animación
// (y la página del caso entra con un fundido, ver .vt-fallback en globals.css).

type Router = { push: (href: string) => void };

let resolveReady: (() => void) | null = null;

/** La nueva ruta ya se pintó: la transición puede capturar el estado final. */
export function notifyRouteReady() {
  resolveReady?.();
  resolveReady = null;
}

export function navigateWithTransition(router: Router, href: string, cover: HTMLElement | null) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('startViewTransition' in document) || reduce || !cover) {
    router.push(href);
    return;
  }
  // Solo la portada pulsada lleva el nombre; la del caso lo trae en su CSS.
  cover.style.viewTransitionName = 'project-cover';
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        resolveReady = resolve;
        router.push(href);
        // Salvaguarda: si la ruta tarda, la transición no se queda esperando.
        window.setTimeout(notifyRouteReady, 1500);
      }),
  );
  void transition.finished.finally(() => cover.style.removeProperty('view-transition-name'));
}
