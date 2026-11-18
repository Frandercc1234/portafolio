import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { ProjectMeta } from '@/lib/content';
import { Eyebrow } from './Section';

function Cover({ meta, priority }: { meta: ProjectMeta; priority: boolean }) {
  if (meta.cover && meta.coverAlt) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-image bg-surface">
        <Image
          src={meta.cover}
          alt={meta.coverAlt}
          width={1440}
          height={900}
          sizes="(min-width: 1280px) 736px, (min-width: 1024px) 40vw, 100vw"
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-300 ease-out-strong group-hover:scale-[1.02]"
        />
      </div>
    );
  }
  // Sin captura real: bloque tipográfico con el nombre, sin imagen inventada.
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[16/10] items-end rounded-image bg-surface p-6 md:p-8"
    >
      <span className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.02em] md:text-4xl">
        {meta.coverLabel ?? meta.title}
      </span>
    </div>
  );
}

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
        <Cover meta={meta} priority={featured} />
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
