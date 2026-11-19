import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // `\\.` (doble barra): en un string normal `\.` se pierde y el patrón no excluía
  // archivos con extensión (favicon.ico, robots.txt, sitemap.xml, icon.svg...).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
