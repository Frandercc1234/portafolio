import Image from 'next/image';
import type { ProjectMeta } from '@/lib/content';

type Props = {
  meta: ProjectMeta;
  priority?: boolean;
  sizes: string;
  large?: boolean;
};

/** Portada 16:10 del caso: la captura, o un bloque tipográfico si no hay captura real. */
export function ProjectCover({ meta, priority = false, sizes, large = false }: Props) {
  if (meta.cover && meta.coverAlt) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-image bg-surface">
        <Image
          src={meta.cover}
          alt={meta.coverAlt}
          width={1440}
          height={900}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-300 ease-out-strong group-hover:scale-[1.02]"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[16/10] items-end rounded-image bg-surface p-6 md:p-8"
    >
      <span
        className={`font-serif leading-[1.1] font-medium tracking-[-0.02em] ${
          large ? 'text-[40px] md:text-7xl' : 'text-[32px] md:text-4xl'
        }`}
      >
        {meta.coverLabel ?? meta.title}
      </span>
    </div>
  );
}
