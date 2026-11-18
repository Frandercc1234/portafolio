import type { ReactNode } from 'react';

type Props = {
  id: string;
  title?: string;
  last?: boolean;
  children: ReactNode;
};

/** Sección del inicio: separación vertical de DESIGN.md (80, 112 y 128 px). */
export function Section({ id, title, last = false, children }: Props) {
  return (
    <section id={id} className={`pt-20 md:pt-28 xl:pt-32 ${last ? 'pb-20 md:pb-28 xl:pb-32' : ''}`}>
      <div className="wrap">
        {title && (
          <h2 className="mb-10 text-[32px] leading-[1.1] md:mb-16 md:text-[48px]">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] leading-tight font-medium tracking-[0.04em] text-ink-soft uppercase md:text-sm">
      {children}
    </p>
  );
}
