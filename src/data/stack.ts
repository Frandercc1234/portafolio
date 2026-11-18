import type { Locale } from '@/lib/content';

export type StackGroup = {
  id: 'frontend' | 'backend' | 'data' | 'quality';
  label: Record<Locale, string>;
  items: string[];
};

export const stackGroups: StackGroup[] = [
  {
    id: 'frontend',
    label: { en: 'Frontend', es: 'Frontend' },
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'backend',
    label: { en: 'Backend', es: 'Backend' },
    items: ['NestJS', 'Supabase', 'PostgreSQL', 'REST'],
  },
  {
    id: 'data',
    label: { en: 'Data', es: 'Datos' },
    items: ['Python', 'pandas', 'DuckDB', 'Streamlit', 'Plotly'],
  },
  {
    id: 'quality',
    label: { en: 'Quality', es: 'Calidad' },
    items: ['Playwright', 'Vitest', 'GitHub Actions'],
  },
];
