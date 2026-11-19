import { getTranslations } from 'next-intl/server';
import { LOCALES } from '@/lib/content';
import { OG_SIZE, renderOgImage } from '@/lib/og';
import { SITE_NAME } from '@/lib/seo';

export const alt = 'Frander Centeno, Full stack developer';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home.hero' });
  return renderOgImage({
    eyebrow: t('role'),
    title: SITE_NAME,
    subtitle: t('value'),
    footer: t('location'),
  });
}
