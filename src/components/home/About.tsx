import { useTranslations } from 'next-intl';
import { Section } from './Section';

export function About() {
  const t = useTranslations('Home.about');

  return (
    <Section id="about">
      <div className="grid gap-6 md:grid-cols-[410px_1fr]">
        <h2 className="text-[32px] leading-[1.1] md:text-[48px]">{t('title')}</h2>
        <p className="max-w-[40ch] font-serif text-2xl leading-[1.35] font-medium md:text-[28px]">
          {t('text')}
        </p>
      </div>
    </Section>
  );
}
