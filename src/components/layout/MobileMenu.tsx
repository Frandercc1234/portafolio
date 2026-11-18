'use client';

import { useEffect, useState } from 'react';
import { buttonClass } from '@/components/ui/Button';

type Item = { href: string; label: string };

type Props = {
  items: Item[];
  openLabel: string;
  closeLabel: string;
  cvHref: string;
  cvLabel: string;
};

export function MobileMenu({ items, openLabel, closeLabel, cvHref, cvLabel }: Props) {
  const [open, setOpen] = useState(false);

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
      {open && (
        <div
          id="mobile-menu"
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
        </div>
      )}
    </div>
  );
}
