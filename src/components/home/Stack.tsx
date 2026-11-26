import { useLocale, useTranslations } from 'next-intl';
import { TagList } from '@/components/ui/TagList';
import { stackGroups } from '@/data/stack';
import type { Locale } from '@/lib/content';
import { Section } from './Section';

export function Stack() {
  const t = useTranslations('Home.stack');
  const locale = useLocale() as Locale;

  return (
    <Section id="stack" title={t('title')}>
      <div className="col-span-12 grid gap-6 md:grid-cols-2 md:gap-x-[var(--gutter)] lg:col-start-5 lg:col-end-13 lg:grid-cols-4">
        {stackGroups.map((group) => (
          <div key={group.id} className="border-t border-line pt-3">
            <h3 className="type-label text-ink-soft">{group.label[locale]}</h3>
            <TagList items={group.items} className="mt-2" />
          </div>
        ))}
      </div>
    </Section>
  );
}
