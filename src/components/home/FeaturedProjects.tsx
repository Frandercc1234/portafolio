import { useTranslations } from 'next-intl';
import type { ProjectMeta } from '@/lib/content';
import { ProjectCard } from './ProjectCard';
import { Section } from './Section';

/** El primer caso ocupa más espacio; los demás van en fila de tres. */
export function FeaturedProjects({ projects }: { projects: ProjectMeta[] }) {
  const t = useTranslations('Home.featured');
  const [first, ...rest] = projects;
  if (!first) return null;

  return (
    <Section id="projects" title={t('title')}>
      <ProjectCard meta={first} featured />
      {rest.length > 0 && (
        <ul className="mt-10 grid gap-10 md:mt-6 lg:grid-cols-3 lg:gap-6">
          {rest.map((meta) => (
            <li key={meta.slug}>
              <ProjectCard meta={meta} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
