import type { MetadataRoute } from 'next';
import { getProjects, LOCALES } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

/** Inicio y casos en los dos idiomas, cada URL con sus alternativas hreflang (incluida ella misma). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...getProjects('en').map((p) => `/projects/${p.meta.slug}`)];
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]));
    return LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: { languages },
    }));
  });
}
