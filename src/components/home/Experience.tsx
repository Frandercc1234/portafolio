import { useLocale, useTranslations } from 'next-intl';
import { certifications, languages, timeline } from '@/data/experience';
import type { Locale } from '@/lib/content';
import { Eyebrow, Section } from './Section';

const rowClass = 'grid gap-2 border-t border-line py-6 md:grid-cols-[2fr_5fr] md:gap-x-6';

export function Experience() {
  const t = useTranslations('Home.experience');
  const locale = useLocale() as Locale;

  return (
    <Section id="experience" title={t('title')}>
      <div className="col-span-12 lg:col-start-5 lg:col-end-13">
        <ol>
          {timeline.map((row) => (
            <li key={row.id} className={rowClass}>
              <Eyebrow>{row.period[locale]}</Eyebrow>
              <div>
                <h3 className="type-text font-medium">{row.title[locale]}</h3>
                {row.detail[locale] && <p className="text-ink-soft">{row.detail[locale]}</p>}
              </div>
            </li>
          ))}
        </ol>
        {(
          [
            ['certifications', certifications],
            ['languages', languages],
          ] as const
        ).map(([key, text]) => (
          <div key={key} className={rowClass}>
            <h3 className="type-label text-ink-soft">{t(key)}</h3>
            <p className="text-ink-soft">{text[locale]}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
