'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { notifyRouteReady } from '@/lib/view-transition';

/** Avisa a la transición de vista que la nueva ruta ya está en pantalla. */
export function ViewTransitionReady() {
  const pathname = usePathname();
  useEffect(() => {
    notifyRouteReady();
  }, [pathname]);
  return null;
}
