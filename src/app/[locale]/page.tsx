import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { About } from '@/components/home/About';
import { Contact } from '@/components/home/Contact';
import { Experience } from '@/components/home/Experience';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { Hero } from '@/components/home/Hero';
import { OtherProjects } from '@/components/home/OtherProjects';
import { Stack } from '@/components/home/Stack';
import { getProjects, type Locale } from '@/lib/content';
import { jsonLd, pageMetadata, SITE_NAME } from '@/lib/seo';
import { CV_URL, SITE_URL, SOCIAL } from '@/lib/site';

export const dynamic = 'error';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return pageMetadata({
    locale: locale as Locale,
    path: '',
    title: t('title'),
    description: t('description'),
    type: 'website',
  });
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hero = await getTranslations({ locale, namespace: 'Home.hero' });
  const projects = getProjects(locale as Locale)
    .filter((p) => p.meta.featured)
    .map((p) => p.meta);

  // Datos estructurados Person: solo lo que la página muestra.
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    jobTitle: hero('role'),
    url: `${SITE_URL}/${locale}`,
    sameAs: [SOCIAL.github, SOCIAL.linkedin],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />
      <Hero cvHref={CV_URL[locale as Locale]} />
      <FeaturedProjects projects={projects} />
      <OtherProjects />
      <Stack />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
