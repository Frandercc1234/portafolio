import type { ComponentPropsWithoutRef } from 'react';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Callout } from './Callout';
import { Columns } from './Columns';
import { Figure } from './Figure';

function Anchor({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (/^https?:\/\//.test(href)) {
    return (
      <ExternalLink href={href} {...props}>
        {children}
      </ExternalLink>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

/** Únicos componentes permitidos dentro del MDX (sección 6.2). */
export const mdxComponents = { Figure, Callout, Columns, a: Anchor };
