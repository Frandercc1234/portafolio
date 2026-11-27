import { useTranslations } from 'next-intl';
import { TransitionLink } from '@/components/ui/TransitionLink';
import type { ProjectMeta } from '@/lib/content';
import { ProjectCover } from '@/components/project/ProjectCover';
import { ProjectLabel } from './ProjectLabel';

type Props = { meta: ProjectMeta; priority?: boolean };

/** Fila de proyecto: la misma estructura en todas. Desde 1024, portada en 1 a 7 y texto en 8 a 12. */
export function ProjectCard({ meta, priority = false }: Props) {
  const p = useTranslations('Project');

  return (
    <TransitionLink
      href={`/projects/${meta.slug}`}
      className="group grid-12 gap-y-4 transition-transform duration-200 ease-out-strong hover:-translate-y-0.5 active:scale-[0.99]"
    >
      <div className="col-span-12 lg:col-span-7">
        <ProjectCover
          meta={meta}
          priority={priority}
          sizes="(min-width: 1440px) 736px, (min-width: 1024px) 531px, calc(100vw - 48px)"
        />
      </div>
      <div className="col-span-12 self-start lg:col-start-8 lg:col-end-13 lg:border-t lg:border-line lg:pt-4">
        <h3 className="type-title">
          <span className="underline-draw">{meta.title}</span>
        </h3>
        <p className="mt-3 max-w-[38ch] text-ink-soft">{meta.tagline}</p>
        <ProjectLabel meta={meta} className="mt-4" />
        {meta.demoSleeps && <p className="mt-2 text-ink-soft">{p('wakeUp')}</p>}
      </div>
    </TransitionLink>
  );
}
