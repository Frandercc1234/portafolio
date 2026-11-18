import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl">{t('title')}</h1>
      <p>{t('text')}</p>
      <ul className="mt-4 flex gap-6">
        <li>
          <Link href="/" className="flex min-h-11 items-center underline">
            {t('home')}
          </Link>
        </li>
        <li>
          <Link href="/#projects" className="flex min-h-11 items-center underline">
            {t('projects')}
          </Link>
        </li>
      </ul>
    </div>
  );
}
