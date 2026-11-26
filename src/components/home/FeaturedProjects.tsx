import { useTranslations } from 'next-intl';
import type { ProjectMeta } from '@/lib/content';
import { MoreProjects } from './MoreProjects';
import { ProjectCard } from './ProjectCard';

/** Los destacados en filas, en el orden de `order`, y al final la lista compacta con el resto. */
export function FeaturedProjects({ projects }: { projects: ProjectMeta[] }) {
  const t = useTranslations('Home.featured');
  const featured = projects.filter((p) => p.featured);

  return (
    // 64 px desde el hero en todos los anchos: a 1440×900 el primer proyecto entra en pantalla.
    <section id="projects" aria-labelledby="projects-title" className="pt-16">
      <div className="wrap">
        <h2 id="projects-title" className="type-title">
          {t('title')}
        </h2>
        <ul className="mt-8 space-y-12">
          {featured.map((meta, i) => (
            <li key={meta.slug}>
              <ProjectCard meta={meta} priority={i === 0} />
            </li>
          ))}
        </ul>
        <MoreProjects projects={projects.filter((p) => !p.featured)} />
      </div>
    </section>
  );
}
