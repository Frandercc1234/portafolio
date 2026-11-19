'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, m, useReducedMotion } from 'motion/react';
import { buttonClass } from '@/components/ui/Button';

type Item = { href: string; label: string };

type Props = {
  items: Item[];
  openLabel: string;
  closeLabel: string;
  cvHref: string;
  cvLabel: string;
};

// Las funciones de animación se cargan aparte, solo cuando el menú existe.
const loadFeatures = () => import('motion/react').then((mod) => mod.domAnimation);

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function MobileMenu({ items, openLabel, closeLabel, cvHref, cvLabel }: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  // Transform completo (acelerado por hardware). Con movimiento reducido solo cambia la opacidad.
  const hidden = { opacity: 0, transform: reduce ? 'none' : 'translateY(-8px)' };
  const shown = { opacity: 1, transform: reduce ? 'none' : 'translateY(0px)' };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className={buttonClass('secondary', 'px-3.5 text-[15px]')}
      >
        {open ? closeLabel : openLabel}
      </button>
      <LazyMotion features={loadFeatures} strict>
        <AnimatePresence>
          {open && (
            <m.div
              id="mobile-menu"
              initial={hidden}
              animate={{ ...shown, transition: { duration: 0.2, ease: EASE_OUT } }}
              exit={{ ...hidden, transition: { duration: 0.15, ease: EASE_OUT } }}
              style={{ transformOrigin: 'top' }}
              className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper px-6 py-4 shadow-[0_12px_24px_rgb(26_25_23/0.08)]"
            >
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
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
    </div>
  );
}
