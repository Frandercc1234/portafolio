export type OtherProject = {
  id: string;
  name: string;
  description: { en: string; es: string };
  demo: string;
  repo: string;
};

export const otherProjects: OtherProject[] = [
  {
    id: 'risk-calculator',
    name: 'Risk calculator',
    description: {
      en: 'Risk calculator with qualitative and quantitative assessment, built with NestJS and React.',
      es: 'Calculadora de riesgos con evaluación cualitativa y cuantitativa, hecha con NestJS y React.',
    },
    demo: 'https://risk-calculator-web.vercel.app',
    repo: 'https://github.com/Frandercc1234/risk-calculator',
  },
];
