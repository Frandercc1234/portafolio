import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { CaseHeader } from '@/components/project/CaseHeader';
import { NextProject } from '@/components/project/NextProject';
import { ProjectCover } from '@/components/project/ProjectCover';
import { Results } from '@/components/project/Results';
import { mdxComponents } from '@/components/mdx';
import { Link } from '@/i18n/routing';
import { getProject, getProjectParams, getProjects, type Locale } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'error';
export const dynamicParams = false;

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return getProjectParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const { meta } = getProject(locale as Locale, slug);
  return pageMetadata({
    locale: locale as Locale,
    path: `/projects/${slug}`,
    title: `${meta.title} | Frander Centeno`,
    description: meta.summary,
    type: 'article',
  });
}

function BackLink() {
  const t = useTranslations('Project');
  return (
    <Link
      href="/"
      className="mt-6 inline-flex min-h-11 items-center text-[15px] text-ink-soft hover:text-ink"
    >
      <span aria-hidden="true">←&nbsp;</span>
      {t('back')}
    </Link>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { meta, content } = getProject(locale as Locale, slug);
  const all = getProjects(locale as Locale);
  const next = all[(all.findIndex((p) => p.meta.slug === slug) + 1) % all.length].meta;

  return (
    <div className="wrap overflow-x-clip">
      <BackLink />
      <CaseHeader meta={meta} />
      <div className="mt-12">
        <ProjectCover meta={meta} priority large sizes="(min-width: 1280px) 1280px, 100vw" />
      </div>
      <Results metrics={meta.metrics} />
      <article className="case-prose mt-16 md:mt-24">
        <MDXRemote source={content} components={mdxComponents} />
      </article>
      <NextProject next={next} />
    </div>
  );
}
