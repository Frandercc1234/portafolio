import type { ReactNode } from 'react';

export function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="my-7 border-l-2 border-accent py-1 pl-5 font-serif text-[22px] leading-[1.35] font-medium">
      {children}
    </aside>
  );
}
