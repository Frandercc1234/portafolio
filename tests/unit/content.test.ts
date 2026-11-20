import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { projectSchema, getProjects, LOCALES, type Locale } from '@/lib/content';

const SLUGS = [
  'purareserva',
  'payments-service',
  'nicoya-zmt',
  'pipeline-bccr',
  'asada-gamalotal',
  'turismo-cr',
  'qa-cypress',
];

const HEADINGS: Record<Locale, string[]> = {
  en: ['Problem', 'My role', 'What I built', 'Key decisions', 'Results', "What I'd do next"],
  es: ['Problema', 'Mi rol', 'Qué construí', 'Decisiones clave', 'Resultados', 'Qué haría después'],
};

function files(locale: Locale) {
  const dir = path.join(process.cwd(), 'content', 'projects', locale);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ file: f, raw: fs.readFileSync(path.join(dir, f), 'utf8') }));
}

describe.each(LOCALES)('proyectos (%s)', (locale) => {
  it('todos los MDX validan contra projectSchema', () => {
    for (const { file, raw } of files(locale)) {
      const result = projectSchema.safeParse(matter(raw).data);
      expect(result.success, `${locale}/${file}`).toBe(true);
    }
  });

  it('el slug coincide con el nombre del archivo', () => {
    for (const { file, raw } of files(locale)) {
      expect(matter(raw).data.slug).toBe(file.replace(/\.mdx$/, ''));
    }
  });

  it('tiene los 7 casos de estudio', () => {
    expect(
      files(locale)
        .map((f) => f.file.replace(/\.mdx$/, ''))
        .sort(),
    ).toEqual([...SLUGS].sort());
  });

  it('el cuerpo trae las 6 secciones en orden', () => {
    for (const { file, raw } of files(locale)) {
      const h2 = [...matter(raw).content.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
      expect(h2, `${locale}/${file}`).toEqual(HEADINGS[locale]);
    }
  });

  it('cada imagen referenciada existe en public/', () => {
    for (const { file, raw } of files(locale)) {
      const { data, content } = matter(raw);
      const refs = [data.cover, ...[...content.matchAll(/src="([^"]+)"/g)].map((m) => m[1])].filter(
        Boolean,
      );
      for (const ref of refs) {
        expect(
          fs.existsSync(path.join(process.cwd(), 'public', ref)),
          `${locale}/${file}: ${ref}`,
        ).toBe(true);
      }
    }
  });
});

describe.each(LOCALES)('MDX seguro (%s)', (locale) => {
  it('solo usa los componentes permitidos y no trae HTML suelto ni scripts', () => {
    const allowed = new Set(['Figure', 'Callout', 'Columns']);
    for (const { file, raw } of files(locale)) {
      const body = matter(raw)
        .content.replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '');
      expect(body, `${locale}/${file}`).not.toMatch(/<script/i);
      expect(body, `${locale}/${file}`).not.toMatch(/\{[^}]*\}/); // sin expresiones JS
      for (const m of body.matchAll(/<\/?([A-Za-z][\w-]*)/g)) {
        expect(allowed.has(m[1]), `${locale}/${file}: <${m[1]}>`).toBe(true);
      }
    }
  });
});

describe('traducciones', () => {
  it('cada slug existe en en y es', () => {
    const en = files('en')
      .map((f) => f.file)
      .sort();
    const es = files('es')
      .map((f) => f.file)
      .sort();
    expect(es).toEqual(en);
  });

  it('el order no se repite y es el mismo en los dos idiomas', () => {
    const orders = (l: Locale) => getProjects(l).map((p) => [p.meta.slug, p.meta.order]);
    const en = orders('en');
    expect(new Set(en.map(([, o]) => o)).size).toBe(en.length);
    expect(orders('es')).toEqual(en);
  });

  it('los datos que no cambian de idioma coinciden', () => {
    const en = getProjects('en');
    const es = getProjects('es');
    en.forEach((p, i) => {
      const q = es[i].meta;
      expect(q.slug).toBe(p.meta.slug);
      expect(q.context).toBe(p.meta.context);
      expect(q.year).toBe(p.meta.year);
      expect(q.stack).toEqual(p.meta.stack);
      expect(q.links).toEqual(p.meta.links);
      expect(q.cover).toBe(p.meta.cover);
      expect(q.featured).toBe(p.meta.featured);
      expect(q.metrics.map((m) => m.value)).toEqual(p.meta.metrics.map((m) => m.value));
    });
  });
});
