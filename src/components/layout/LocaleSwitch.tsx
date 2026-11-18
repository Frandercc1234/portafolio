'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, routing, usePathname } from '@/i18n/routing';

export function LocaleSwitch() {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t('language')} className="flex items-center">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center text-sm uppercase ${
            l === locale ? 'font-semibold text-ink underline' : 'text-ink-soft hover:text-ink'
          }`}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
