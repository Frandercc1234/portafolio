import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('Layout');
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2"
    >
      {t('skipToContent')}
    </a>
  );
}
