import type { Metadata } from 'next';
import { SITE_URL } from './site';

export const SITE_NAME = 'Frander Centeno';

type Locale = 'en' | 'es';

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', es: 'es_CR' };

type Options = {
  locale: Locale;
  /** Ruta sin idioma: '' para el inicio, '/projects/<slug>' para un caso. */
  path: string;
  title: string;
  description: string;
  type: 'website' | 'article';
};

/** Metadatos de una página: título, canonical, hreflang, Open Graph y Twitter. */
export function pageMetadata({ locale, path, title, description, type }: Options): Metadata {
  const other: Locale = locale === 'en' ? 'es' : 'en';
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { en: `/en${path}`, es: `/es${path}`, 'x-default': `/en${path}` },
    },
    openGraph: {
      type,
      url: `/${locale}${path}`,
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[other]],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** JSON para un <script type="application/ld+json">: escapa "<" para que no cierre la etiqueta. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\u003c');
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
