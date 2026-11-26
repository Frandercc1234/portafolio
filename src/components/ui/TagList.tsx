/**
 * Lista de tecnologías escrita como texto corrido, separada por comas. Cada nombre se mantiene
 * entero: la línea solo se parte entre elementos.
 */
export function TagList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={item} className="inline">
          <span className="whitespace-nowrap">
            {item}
            {i < items.length - 1 && ','}
          </span>{' '}
        </li>
      ))}
    </ul>
  );
}
