import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { CV_URL } from '@/lib/site';
import { LocaleSwitch } from './LocaleSwitch';
import { MobileMenu } from './MobileMenu';

export async function Header() {
  const t = await getTranslations('Layout');
  const locale = (await getLocale()) as 'en' | 'es';
  const items = [
    { href: `/${locale}#projects`, label: t('nav.projects') },
    { href: `/${locale}#experience`, label: t('nav.experience') },
    { href: `/${locale}#contact`, label: t('nav.contact') },
  ];

  return (
    <header className="relative border-b border-neutral-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex min-h-11 items-center font-semibold">
          {t('name')}
        </Link>
        <nav aria-label={t('mainNav')} className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="flex min-h-11 items-center">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <a
            href={CV_URL[locale]}
            download
            className="hidden min-h-11 items-center border border-neutral-900 px-4 md:inline-flex"
          >
            {t('downloadCv')}
          </a>
          <MobileMenu
            items={items}
            openLabel={t('openMenu')}
            closeLabel={t('closeMenu')}
            cvHref={CV_URL[locale]}
            cvLabel={t('downloadCv')}
          />
        </div>
      </div>
    </header>
  );
}
