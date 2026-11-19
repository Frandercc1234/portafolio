import { useLocale, useTranslations } from 'next-intl';
import { certifications, languages, timeline } from '@/data/experience';
import type { Locale } from '@/lib/content';
import { Eyebrow, Section } from './Section';

export function Experience() {
  const t = useTranslations('Home.experience');
  const locale = useLocale() as Locale;

  return (
    <Section id="experience" title={t('title')}>
      <ol>
        {timeline.map((row) => (
          <li
            key={row.id}
            className="grid gap-2 border-t border-line py-6 md:grid-cols-[330px_1fr] md:gap-6"
          >
            <Eyebrow>{row.period[locale]}</Eyebrow>
            <div>
              <h3 className="text-2xl tracking-[-0.01em] md:text-[28px]">{row.title[locale]}</h3>
              {row.detail[locale] && <p className="mt-1.5 text-ink-soft">{row.detail[locale]}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="grid gap-8 border-t border-line pt-6 md:grid-cols-2 md:gap-6">
        <div>
          <h3 className="mb-2 text-2xl tracking-[-0.01em]">{t('certifications')}</h3>
          <p className="leading-[1.6] text-ink-soft">{certifications[locale]}</p>
        </div>
        <div>
          <h3 className="mb-2 text-2xl tracking-[-0.01em]">{t('languages')}</h3>
          <p className="leading-[1.6] text-ink-soft">{languages[locale]}</p>
        </div>
      </div>
    </Section>
  );
}
