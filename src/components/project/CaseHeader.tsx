import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/home/Section';
import type { ProjectMeta } from '@/lib/content';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function CaseHeader({ meta }: { meta: ProjectMeta }) {
  const t = useTranslations('Project');
  const layout = useTranslations('Layout');
  const ctx = useTranslations('Home.featured.context');
  const info: [string, string][] = [
    [t('role'), meta.role],
    [t('context'), ctx(meta.context)],
    [t('year'), String(meta.year)],
    [t('stack'), meta.stack.join(' · ')],
  ];

  return (
    <header className="pt-6">
      <h1 className="text-[44px] leading-[1.05] tracking-[-0.025em] md:text-[72px]">
        {meta.title}
      </h1>
      <p className="mt-5 max-w-[36ch] text-xl leading-[1.4] md:text-2xl">{meta.summary}</p>
      <dl className="mt-10 grid gap-4 border-t border-line pt-6 md:grid-cols-4 md:gap-6">
        {info.map(([label, value]) => (
          <div key={label}>
            <dt>
              <Eyebrow>{label}</Eyebrow>
            </dt>
            <dd className="mt-1 text-[15px] font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      {(meta.links.demo || meta.links.repo) && (
        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          {meta.links.demo && (
            <ButtonLink href={meta.links.demo} {...external} className="w-full md:w-auto">
              {t('demo')}
              <span className="sr-only"> {layout('external')}</span>
            </ButtonLink>
          )}
          {meta.links.repo && (
            <ButtonLink
              href={meta.links.repo}
              variant="secondary"
              {...external}
              className="w-full md:w-auto"
            >
              {t('repo')}
              <span className="sr-only"> {layout('external')}</span>
            </ButtonLink>
          )}
        </div>
      )}
      {meta.demoSleeps && <p className="mt-3 text-sm text-ink-soft">{t('wakeUp')}</p>}
    </header>
  );
}
