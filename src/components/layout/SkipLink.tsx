import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('Layout');
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-control focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
    >
      {t('skipToContent')}
    </a>
  );
}
