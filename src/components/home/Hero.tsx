import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';

const FACTS = ['now', 'looking', 'before'] as const;

/** Nombre, rol y acciones en las columnas 1 a 7; los tres datos, desde 1024, en las 9 a 12. */
export function Hero({ cvHref }: { cvHref: string }) {
  const t = useTranslations('Home.hero');
  const layout = useTranslations('Layout');

  return (
    <div className="wrap grid-12 items-start gap-y-16 pt-12">
      <div className="col-span-12 lg:col-span-7">
        <h1 className="enter enter-1 type-display">{layout('name')}</h1>
        <p className="enter enter-2 type-title mt-2 text-ink-soft">{t('role')}</p>
        <p className="enter enter-3 mt-4 max-w-[44ch]">{t('value')}</p>
        <div className="enter enter-4 mt-8 flex flex-col gap-3 md:flex-row">
          <ButtonLink href={cvHref} download className="w-full md:w-auto">
            {t('cv')}
          </ButtonLink>
          <ButtonLink href="#contact" variant="secondary" className="w-full md:w-auto">
            {t('contact')}
          </ButtonLink>
        </div>
      </div>
      <dl className="enter enter-5 col-span-12 grid gap-6 md:grid-cols-3 md:gap-x-[var(--gutter)] lg:col-start-9 lg:col-end-13 lg:grid-cols-1 lg:pt-3">
        {FACTS.map((fact) => (
          <div key={fact} className="border-t border-ink pt-3">
            <dt className="type-label text-ink-soft">{t(`facts.${fact}.label`)}</dt>
            <dd className="mt-2 max-w-[38ch]">{t(`facts.${fact}.text`)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
