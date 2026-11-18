import { useLocale, useTranslations } from 'next-intl';
import { stackGroups } from '@/data/stack';
import type { Locale } from '@/lib/content';
import { Section } from './Section';

export function Stack() {
  const t = useTranslations('Home.stack');
  const locale = useLocale() as Locale;

  return (
    <Section id="stack" title={t('title')}>
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
        {stackGroups.map((group) => (
          <div key={group.id} className="border-t border-line pt-4">
            <h3 className="mb-3 text-2xl tracking-[-0.01em]">{group.label[locale]}</h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
