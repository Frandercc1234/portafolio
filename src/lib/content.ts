import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { notFound } from 'next/navigation';

export type Locale = 'en' | 'es';

export const LOCALES: Locale[] = ['en', 'es'];

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().max(60),
    summary: z.string().max(160), // una oración, se usa en tarjetas y meta description
    role: z.string().max(80),
    context: z.enum(['personal', 'internship', 'university', 'client']),
    year: z.number().int().min(2023).max(2030),
    stack: z.array(z.string()).min(2).max(10),
    metrics: z
      .array(
        z.object({
          value: z.string().max(12),
          label: z.string().max(40),
        }),
      )
      .max(3),
    links: z.object({
      demo: z.string().url().optional(),
      repo: z.string().url().optional(),
    }),
    // Sin captura real, la portada es un bloque tipográfico: cover y coverAlt faltan juntos.
    cover: z.string().startsWith('/projects/').optional(),
    coverAlt: z.string().min(10).optional(),
    // Texto del bloque tipográfico cuando no hay captura (por defecto, el título).
    coverLabel: z.string().max(40).optional(),
    // El demo se duerme (Streamlit Community Cloud): la tarjeta y el caso lo avisan.
    demoSleeps: z.boolean().optional(),
    featured: z.boolean(),
    order: z.number().int().min(1),
  })
  .refine((p) => Boolean(p.cover) === Boolean(p.coverAlt), {
    message: 'cover y coverAlt van juntos',
    path: ['coverAlt'],
  });

export type ProjectMeta = z.infer<typeof projectSchema>;

export type Project = { meta: ProjectMeta; content: string };

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects');

function readLocale(locale: Locale): Project[] {
  const dir = path.join(CONTENT_DIR, locale);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const parsed = projectSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Frontmatter inválido en ${locale}/${file}: ${parsed.error.message}`);
    }
    const expected = file.replace(/\.mdx$/, '');
    if (parsed.data.slug !== expected) {
      throw new Error(`El slug "${parsed.data.slug}" no coincide con el archivo ${locale}/${file}`);
    }
    return { meta: parsed.data, content };
  });
}

/** Proyectos de un idioma, ordenados por `order`. Falla si falta la traducción. */
export function getProjects(locale: Locale): Project[] {
  const own = readLocale(locale);
  for (const other of LOCALES.filter((l) => l !== locale)) {
    const otherSlugs = new Set(readLocale(other).map((p) => p.meta.slug));
    for (const p of own) {
      if (!otherSlugs.has(p.meta.slug)) {
        throw new Error(`Falta la traducción "${other}" del proyecto ${p.meta.slug}`);
      }
    }
    const ownSlugs = new Set(own.map((p) => p.meta.slug));
    for (const slug of otherSlugs) {
      if (!ownSlugs.has(slug))
        throw new Error(`Falta la traducción "${locale}" del proyecto ${slug}`);
    }
  }
  return own.sort((a, b) => a.meta.order - b.meta.order);
}

export function getProject(locale: Locale, slug: string): Project {
  const found = getProjects(locale).find((p) => p.meta.slug === slug);
  if (!found) notFound();
  return found;
}

/** Pares idioma y slug para `generateStaticParams`. */
export function getProjectParams(): { locale: Locale; slug: string }[] {
  return LOCALES.flatMap((locale) =>
    getProjects(locale).map((p) => ({ locale, slug: p.meta.slug })),
  );
}
