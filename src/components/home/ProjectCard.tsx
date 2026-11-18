import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { ProjectMeta } from '@/lib/content';
import { ProjectCover } from '@/components/project/ProjectCover';
import { Eyebrow } from './Section';

type Props = { meta: ProjectMeta; featured?: boolean };

export function ProjectCard({ meta, featured = false }: Props) {
  const t = useTranslations('Home.featured');
  const p = useTranslations('Project');

  return (
    <Link
      href={`/projects/${meta.slug}`}
      className={`group block transition-transform duration-200 ease-out-strong hover:-translate-y-0.5 ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      <div className={featured ? 'md:col-span-7' : ''}>
        <ProjectCover
          meta={meta}
          priority={featured}
          sizes="(min-width: 1280px) 736px, (min-width: 1024px) 40vw, 100vw"
        />
      </div>
      <div className={featured ? 'mt-4 md:col-span-5 md:mt-0 md:self-center md:pl-6' : 'mt-5'}>
        <Eyebrow>{t(`context.${meta.context}`)}</Eyebrow>
        <h3
          className={`mt-2 text-[28px] leading-[1.2] tracking-[-0.01em] ${
            featured ? 'md:text-[36px]' : ''
          }`}
        >
          <span className="underline-draw">{meta.title}</span>
        </h3>
        <p className="mt-3 text-[17px] leading-[1.5] text-ink-soft md:text-lg">{meta.summary}</p>
        <p className="mt-3 text-[15px] font-medium">{meta.stack.slice(0, 4).join(' · ')}</p>
        {meta.demoSleeps && <p className="mt-2 text-[13px] text-ink-soft">{p('wakeUp')}</p>}
      </div>
    </Link>
  );
}
