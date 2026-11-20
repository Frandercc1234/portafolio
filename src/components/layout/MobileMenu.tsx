'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { buttonClass } from '@/components/ui/Button';

type Item = { href: string; label: string };

type Props = {
  items: Item[];
  openLabel: string;
  closeLabel: string;
  cvHref: string;
  cvLabel: string;
};

// Motion y el panel no se descargan hasta que alguien toca el botón: así no pesan en la carga.
const loadPanel = () => import('./MobileMenuPanel');
const MobileMenuPanel = dynamic(loadPanel, { ssr: false });

export function MobileMenu({ items, openLabel, closeLabel, cvHref, cvLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        // Empieza a bajar el panel al apoyar el dedo, antes de que termine el toque.
        onPointerDown={() => void loadPanel()}
        onClick={() => {
          setUsed(true);
          setOpen((v) => !v);
        }}
        className={buttonClass('secondary', 'px-3.5 text-[15px]')}
      >
        {open ? closeLabel : openLabel}
      </button>
      {used && (
        <MobileMenuPanel
          open={open}
          items={items}
          cvHref={cvHref}
          cvLabel={cvLabel}
          onNavigate={() => setOpen(false)}
        />
      )}
    </div>
  );
}
