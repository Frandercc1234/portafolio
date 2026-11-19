import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/home/Section';
import { Link } from '@/i18n/routing';
import type { ProjectMeta } from '@/lib/content';

/** Enlaza al siguiente caso por `order`; el último vuelve al primero. */
export function NextProject({ next }: { next: ProjectMeta }) {
  const t = useTranslations('Project');

  return (
    <nav
      aria-label={t('next')}
      className="mt-24 border-t border-line pt-14 pb-20 md:pb-28 xl:pb-32"
    >
      <Link href={`/projects/${next.slug}`} className="group inline-block">
        <Eyebrow>{t('next')}</Eyebrow>
        <p className="mt-3 font-serif text-[40px] leading-[1.1] font-medium tracking-[-0.02em] md:text-7xl">
          <span className="underline-draw">{next.title}</span>
        </p>
      </Link>
    </nav>
  );
}
