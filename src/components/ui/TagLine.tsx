const NBSP = ' ';

/**
 * Lista en una línea con separadores. Cada elemento y su punto van unidos con espacios de no
 * separación: la línea solo se parte entre elementos y un punto nunca abre una línea.
 */
export function TagLine({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <p className={className}>{items.map((item) => item.replaceAll(' ', NBSP)).join(`${NBSP}· `)}</p>
  );
}
