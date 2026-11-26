import { useTranslations } from 'next-intl';
import { Section } from './Section';

export function About() {
  const t = useTranslations('Home.about');

  return (
    <Section id="about" title={t('title')}>
      <p className="type-title col-span-12 max-w-[30ch] leading-[1.3] lg:col-start-5 lg:col-end-13">
        {t('text')}
      </p>
    </Section>
  );
}
