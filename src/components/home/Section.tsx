import type { ReactNode } from 'react';

type Props = {
  id: string;
  title: string;
  last?: boolean;
  children: ReactNode;
};

/**
 * Sección del inicio con el título al lado: desde 1024 el título ocupa las columnas 1 a 4 y el
 * contenido las 5 a 12. Cada hijo directo decide sus columnas.
 */
export function Section({ id, title, last = false, children }: Props) {
  return (
    <section id={id} className={`${sectionSpace} ${last ? sectionEnd : ''}`}>
      <div className="wrap grid-12 gap-y-8">
        <h2 className="type-title col-span-12 lg:col-span-4">{title}</h2>
        {children}
      </div>
    </section>
  );
}

/** Separación entre secciones: 64, 96 y 128 px (DESIGN.md 10.3). */
export const sectionSpace = 'pt-16 md:pt-24 wide:pt-32';
export const sectionEnd = 'pb-16 md:pb-24 wide:pb-32';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="type-label text-ink-soft">{children}</p>;
}
