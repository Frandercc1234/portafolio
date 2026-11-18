import { getTranslations } from 'next-intl/server';
import { SOCIAL } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations('Layout');
  const year = new Date().getFullYear();
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm">
        <ul className="flex flex-wrap gap-x-6">
          <li>
            <a href={`mailto:${SOCIAL.email}`} className="flex min-h-11 items-center">
              {SOCIAL.email}
            </a>
          </li>
          <li>
            <a href={SOCIAL.github} {...external} className="flex min-h-11 items-center">
              GitHub<span className="sr-only"> {t('external')}</span>
            </a>
          </li>
          <li>
            <a href={SOCIAL.linkedin} {...external} className="flex min-h-11 items-center">
              LinkedIn<span className="sr-only"> {t('external')}</span>
            </a>
          </li>
        </ul>
        <p>
          © {year} {t('footer.rights')}. {t('footer.built')}.
        </p>
      </div>
    </footer>
  );
}
