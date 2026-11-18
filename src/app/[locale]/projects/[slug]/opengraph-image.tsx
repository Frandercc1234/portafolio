import { getTranslations } from 'next-intl/server';
import { getProject, getProjectParams, type Locale } from '@/lib/content';
import { OG_SIZE, renderOgImage } from '@/lib/og';
import { SITE_NAME } from '@/lib/seo';

export const alt = 'Frander Centeno, case study';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getProjectParams();
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { meta } = getProject(locale as Locale, slug);
  const ctx = await getTranslations({ locale, namespace: 'Home.featured.context' });
  const hero = await getTranslations({ locale, namespace: 'Home.hero' });
  return renderOgImage({
    eyebrow: `${ctx(meta.context)} · ${meta.year}`,
    title: meta.title,
    subtitle: meta.summary,
    footer: `${SITE_NAME} · ${hero('role')}`,
  });
}
