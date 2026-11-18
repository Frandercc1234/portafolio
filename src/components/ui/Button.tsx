import type { ComponentPropsWithoutRef } from 'react';

type Variant = 'primary' | 'secondary';

const base =
  'inline-flex min-h-11 items-center justify-center rounded-control border px-6 py-2.5 font-medium transition-[background-color,transform] duration-200 ease-out-strong active:translate-y-px';

const variants: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-white hover:border-accent-strong hover:bg-accent-strong',
  secondary: 'border-ink bg-transparent text-ink hover:bg-surface',
};

export function buttonClass(variant: Variant, extra = '') {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

type LinkProps = ComponentPropsWithoutRef<'a'> & { variant?: Variant };

export function ButtonLink({ variant = 'primary', className = '', ...props }: LinkProps) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: Variant };

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
