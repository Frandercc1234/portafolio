import type { ProjectMeta } from '@/lib/content';

/** Métricas en grande. Sin cifras en el proyecto, el bloque no se muestra. */
export function Results({ metrics }: { metrics: ProjectMeta['metrics'] }) {
  if (metrics.length === 0) return null;
  return (
    <ul className="mt-12 grid grid-cols-3 gap-3 border-y border-line py-8 md:gap-6">
      {metrics.map((m) => (
        <li key={m.label}>
          <p className="font-serif text-[32px] leading-none font-semibold tracking-[-0.02em] md:text-7xl">
            {m.value}
          </p>
          <p className="mt-2 text-[13px] leading-[1.35] text-ink-soft md:text-[15px]">{m.label}</p>
        </li>
      ))}
    </ul>
  );
}
