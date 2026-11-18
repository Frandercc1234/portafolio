'use client';

import { useEffect, useState } from 'react';

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
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm"
      >
        {open ? closeLabel : openLabel}
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-neutral-200 bg-white p-4"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={cvHref} download className="flex min-h-11 items-center font-semibold">
                {cvLabel}
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
