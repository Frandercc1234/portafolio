import { getTranslations } from 'next-intl/server';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { SOCIAL } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations('Layout');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-4 pt-8 pb-10 fs-label md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-col gap-1 md:flex-row md:gap-8">
          <li>
            <a
              href={`mailto:${SOCIAL.email}`}
              className="flex min-h-11 min-w-11 items-center hover:text-accent"
            >
              {SOCIAL.email}
            </a>
          </li>
          <li>
            <ExternalLink
              href={SOCIAL.github}
              className="flex min-h-11 min-w-11 items-center hover:text-accent"
            >
              GitHub
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href={SOCIAL.linkedin}
              className="flex min-h-11 min-w-11 items-center hover:text-accent"
            >
              LinkedIn
            </ExternalLink>
          </li>
        </ul>
        <p className="text-ink-soft">
          © {year} {t('footer.rights')}. {t('footer.built')}.
        </p>
      </div>
    </footer>
  );
}
