import { useTranslations } from 'next-intl';
import type { ProjectMeta } from '@/lib/content';

/** "TIPO · 2 tecnologías · contexto", en una línea. El rol queda solo en la página del caso. */
export function ProjectLabel({ meta, className = '' }: { meta: ProjectMeta; className?: string }) {
  const t = useTranslations('Home.featured');
  const label = [
    t(`type.${meta.type}`),
    meta.cardStack.join(', '),
    t(`context.${meta.context}`),
  ].join(' · ');

  return (
    <p data-project-label className={`type-label project-label text-ink-soft ${className}`}>
      {label}
    </p>
  );
}
