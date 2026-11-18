import { setRequestLocale } from 'next-intl/server';
import { About } from '@/components/home/About';
import { Contact } from '@/components/home/Contact';
import { Experience } from '@/components/home/Experience';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { Hero } from '@/components/home/Hero';
import { OtherProjects } from '@/components/home/OtherProjects';
import { Stack } from '@/components/home/Stack';
import { getProjects, type Locale } from '@/lib/content';
import { CV_URL } from '@/lib/site';

export const dynamic = 'error';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = getProjects(locale as Locale)
    .filter((p) => p.meta.featured)
    .map((p) => p.meta);

  return (
    <>
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
