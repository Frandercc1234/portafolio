import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from './Section';

export function Hero({ cvHref }: { cvHref: string }) {
  const t = useTranslations('Home.hero');
  const layout = useTranslations('Layout');

  return (
    <div className="wrap pt-8 md:pt-16">
      <Eyebrow>{t('role')}</Eyebrow>
      <h1 className="mt-5 mb-6 text-[clamp(2.75rem,1.4rem+6vw,5.5rem)] leading-[1.02] tracking-[-0.025em]">
        {layout('name')}
      </h1>
      <p className="max-w-[36ch] text-xl leading-[1.4] md:text-2xl">{t('value')}</p>
      <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row">
        <ButtonLink href={cvHref} download className="w-full md:w-auto">
          {t('cv')}
        </ButtonLink>
        <ButtonLink href="#contact" variant="secondary" className="w-full md:w-auto">
          {t('contact')}
        </ButtonLink>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-[15px] md:mt-16 md:flex-row md:items-center md:justify-between">
        <p className="text-ink-soft">{t('location')}</p>
        <p className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          {t('status')}
        </p>
      </div>
    </div>
  );
}
