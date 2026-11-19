import { getLocale, getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
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
    <header className="relative border-b border-line">
      <div className="wrap flex min-h-14 items-center justify-between gap-4 md:min-h-[72px]">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center font-serif text-lg font-semibold whitespace-nowrap max-[359px]:shrink max-[359px]:leading-tight max-[359px]:whitespace-normal md:text-[22px]"
        >
          {t('name')}
        </Link>
        <nav aria-label={t('mainNav')} className="hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center font-medium hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 lg:gap-5">
          <LocaleSwitch />
          <div className="hidden lg:block">
            <ButtonLink href={CV_URL[locale]} download variant="secondary">
              {t('downloadCv')}
            </ButtonLink>
          </div>
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
