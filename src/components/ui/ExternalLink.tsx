import type { ComponentPropsWithoutRef } from 'react';
import { useTranslations } from 'next-intl';

/** Enlace externo: abre en pestaña nueva y lo anuncia a lectores de pantalla. */
export function ExternalLink({ children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const t = useTranslations('Layout');
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {t('external')}</span>
    </a>
  );
}
