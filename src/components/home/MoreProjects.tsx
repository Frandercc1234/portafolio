import { useTranslations } from 'next-intl';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Link } from '@/i18n/routing';
import type { ProjectMeta } from '@/lib/content';
import { ProjectLabel } from './ProjectLabel';

const linkClass = 'flex min-h-11 items-center font-medium underline hover:text-accent';

/** Lista compacta, sin imagen: los casos que no son destacados. */
export function MoreProjects({ projects }: { projects: ProjectMeta[] }) {
  const t = useTranslations('Home.featured');
  const p = useTranslations('Project');
  if (projects.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 id="more-projects" className="type-label border-t border-ink pt-3">
        {t('more')}
      </h3>
      <ul aria-labelledby="more-projects" className="mt-6">
        {projects.map((meta) => (
          <li key={meta.slug} className="grid-12 gap-y-2 border-t border-line py-4">
            <h4 className="type-text col-span-12 font-medium md:col-span-4 md:py-2">
              {meta.title}
            </h4>
            <p className="col-span-12 text-ink-soft md:col-span-3 md:py-2">
              {meta.tagline}
              {meta.demoSleeps && ` ${p('wakeUp')}`}
            </p>
            <div className="col-span-12 md:col-span-5 md:py-2">
              <ProjectLabel meta={meta} />
              <div className="flex flex-wrap gap-x-6">
                <Link href={`/projects/${meta.slug}`} className={linkClass}>
                  {t('links.case')}
                </Link>
                {meta.links.demo && (
                  <ExternalLink href={meta.links.demo} className={linkClass}>
                    {t('links.demo')}
                  </ExternalLink>
                )}
                {meta.links.repo && (
                  <ExternalLink href={meta.links.repo} className={linkClass}>
                    {t('links.repo')}
                  </ExternalLink>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
