import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Link } from '@/i18n/routing';
import { otherProjects } from '@/data/other-projects';
import { Section } from './Section';

export function OtherProjects() {
  const t = useTranslations('Home.other');
  const locale = useLocale() as 'en' | 'es';

  return (
    <Section id="other" title={t('title')}>
      <ul>
        {otherProjects.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-3 border-t border-line py-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="text-[28px] tracking-[-0.01em]">{p.name}</h3>
              <p className="mt-1 text-ink-soft">{p.description[locale]}</p>
            </div>
            <div className="flex gap-6 font-medium">
              {p.caseSlug && (
                <Link
                  href={`/projects/${p.caseSlug}`}
                  className="flex min-h-11 items-center underline"
                >
                  {t('case')}
                </Link>
              )}
              {p.demo && (
                <ExternalLink href={p.demo} className="flex min-h-11 items-center underline">
                  {t('demo')}
                </ExternalLink>
              )}
              <ExternalLink href={p.repo} className="flex min-h-11 items-center underline">
                {t('repo')}
              </ExternalLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
