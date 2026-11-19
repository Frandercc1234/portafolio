'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

type Item = { href: string; label: string };

type Props = {
  open: boolean;
  items: Item[];
  cvHref: string;
  cvLabel: string;
  onNavigate: () => void;
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Panel del menú móvil con Motion. Se carga aparte, la primera vez que se abre el menú. */
export default function MobileMenuPanel({ open, items, cvHref, cvLabel, onNavigate }: Props) {
  const reduce = useReducedMotion();
  // Transform completo (acelerado por hardware). Con movimiento reducido solo cambia la opacidad.
  const hidden = { opacity: 0, transform: reduce ? 'none' : 'translateY(-8px)' };
  const shown = { opacity: 1, transform: reduce ? 'none' : 'translateY(0px)' };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={hidden}
            animate={{ ...shown, transition: { duration: 0.2, ease: EASE_OUT } }}
            exit={{ ...hidden, transition: { duration: 0.15, ease: EASE_OUT } }}
            style={{ transformOrigin: 'top' }}
            className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper px-6 py-4 md:px-12 shadow-[0_12px_24px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
          >
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={cvHref}
                  download
                  className="flex min-h-11 items-center font-semibold text-accent"
                >
                  {cvLabel}
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
