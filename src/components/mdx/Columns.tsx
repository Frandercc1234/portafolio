import type { ReactNode } from 'react';

/** Dos columnas desde 768 px; cada hijo es una columna. */
export function Columns({ children }: { children: ReactNode }) {
  return <div className="my-7 grid gap-6 md:grid-cols-2">{children}</div>;
}
