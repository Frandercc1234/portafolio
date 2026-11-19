import type { Locale } from '@/lib/content';

type Text = Record<Locale, string>;

export type TimelineEntry = {
  id: string;
  period: Text;
  title: Text;
  detail: Text;
};

export const timeline: TimelineEntry[] = [
  {
    id: 'asada-gamalotal',
    period: { en: 'Jul 2025 – Dec 2025', es: 'Jul 2025 – Dic 2025' },
    title: { en: 'ASADA Gamalotal', es: 'ASADA Gamalotal' },
    detail: { en: 'Professional internship.', es: 'Práctica profesional.' },
  },
  {
    id: 'nicoya-zmt',
    period: { en: '2024 – 2025', es: '2024 – 2025' },
    title: { en: 'Municipalidad de Nicoya', es: 'Municipalidad de Nicoya' },
    detail: {
      en: 'University project for the Maritime Zone department.',
      es: 'Proyecto universitario para el departamento de Zona Marítimo Terrestre.',
    },
  },
  {
    id: 'education',
    period: { en: '2025', es: '2025' },
    title: {
      en: 'Systems Engineering, Universidad Nacional',
      es: 'Ingeniería en Sistemas, Universidad Nacional',
    },
    detail: { en: '', es: '' },
  },
];

export const certifications: Text = {
  en: 'DataCamp: AI Engineer for Developers, Data Engineer, Data Analyst, Python Developer, SQL Associate. Scrum Fundamentals Certified. PM4R Professional (IDB).',
  es: 'DataCamp: AI Engineer for Developers, Data Engineer, Data Analyst, Python Developer, SQL Associate. Scrum Fundamentals Certified. PM4R Professional del BID.',
};

export const languages: Text = {
  en: 'Spanish, native. English, B1.',
  es: 'Español, nativo. Inglés, B1.',
};
