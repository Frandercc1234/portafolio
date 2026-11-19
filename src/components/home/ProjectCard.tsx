import { useTranslations } from 'next-intl';
import { TagLine } from '@/components/ui/TagLine';
import { TransitionLink } from '@/components/ui/TransitionLink';
import type { ProjectMeta } from '@/lib/content';
import { ProjectCover } from '@/components/project/ProjectCover';

type Props = { meta: ProjectMeta; featured?: boolean };

export function ProjectCard({ meta, featured = false }: Props) {
  const t = useTranslations('Home.featured');
  const p = useTranslations('Project');

  return (
    <TransitionLink
      href={`/projects/${meta.slug}`}
      className={`group block transition-transform duration-200 ease-out-strong hover:-translate-y-0.5 active:scale-[0.99] ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      <div className={featured ? 'md:col-span-7' : ''}>
        <ProjectCover
          meta={meta}
          priority={featured}
          sizes={
            featured
              ? '(min-width: 1280px) 736px, (min-width: 768px) 58vw, calc(100vw - 48px)'
              : '(min-width: 1280px) 628px, (min-width: 768px) calc(50vw - 72px), calc(100vw - 48px)'
          }
        />
      </div>
      <div className={featured ? 'mt-4 md:col-span-5 md:mt-0 md:self-center md:pl-6' : 'mt-5'}>
        <h3
          className={`text-[28px] leading-[1.2] tracking-[-0.01em] ${
            featured ? 'md:text-[36px]' : ''
          }`}
        >
          <span className="underline-draw">{meta.title}</span>
        </h3>
        <p className="mt-3 text-[17px] leading-[1.5] text-ink-soft md:text-lg">{meta.summary}</p>
        <TagLine
          items={[t(`context.${meta.context}`), ...meta.stack.slice(0, 4)]}
          className="mt-3 text-[15px] font-medium"
        />
        {meta.demoSleeps && <p className="mt-2 text-[13px] text-ink-soft">{p('wakeUp')}</p>}
      </div>
    </TransitionLink>
  );
}
