'use client';

import type { MouseEvent, ReactNode } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { navigateWithTransition } from '@/lib/view-transition';

type Props = { href: string; className?: string; children: ReactNode };

/** Enlace a un caso: la portada ([data-cover]) viaja a la página del caso. */
export function TransitionLink({ href, className, children }: Props) {
  const router = useRouter();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    // Un clic con teclado (detail 0) no se anima: son acciones repetidas y rápidas.
    if (event.defaultPrevented || event.button !== 0 || modified || event.detail === 0) return;
    event.preventDefault();
    navigateWithTransition(
      router,
      href,
      event.currentTarget.querySelector<HTMLElement>('[data-cover]'),
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
