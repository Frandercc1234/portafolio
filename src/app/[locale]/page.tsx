import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl">Frander Centeno</h1>
      <p>{t('hero.role')}</p>
      <section id="projects" className="py-16">
        <h2 className="text-2xl">{t('featured.title')}</h2>
      </section>
      <section id="experience" className="py-16">
        <h2 className="text-2xl">{t('experience.title')}</h2>
      </section>
      <section id="contact" className="py-16">
        <h2 className="text-2xl">{t('contact.title')}</h2>
      </section>
    </div>
  );
}
