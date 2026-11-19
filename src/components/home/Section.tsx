import type { ReactNode } from 'react';

type Props = {
  id: string;
  title?: string;
  last?: boolean;
  /** Relleno superior si debe ser menor que el de las demás secciones (por ejemplo, tras el hero). */
  padTop?: string;
  /** Separación entre el título y el contenido. */
  titleGap?: string;
  children: ReactNode;
};

/** Sección del inicio: separación vertical de DESIGN.md (80, 112 y 128 px). */
export function Section({
  id,
  title,
  last = false,
  padTop = 'pt-20 md:pt-28 xl:pt-32',
  titleGap = 'mb-10 md:mb-16',
  children,
}: Props) {
  return (
    <section id={id} className={`${padTop} ${last ? 'pb-20 md:pb-28 xl:pb-32' : ''}`}>
      <div className="wrap">
        {title && (
          <h2 className={`${titleGap} text-[32px] leading-[1.1] md:text-[48px]`}>{title}</h2>
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
