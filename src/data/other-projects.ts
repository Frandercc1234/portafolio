export type OtherProject = {
  id: string;
  name: string;
  description: { en: string; es: string };
  /** Demo en vivo; los proyectos sin demo (suite de QA) no lo muestran. */
  demo?: string;
  repo: string;
  /** Si tiene página de caso (en `content/projects`), se enlaza desde la lista. */
  caseSlug?: string;
};

export const otherProjects: OtherProject[] = [
  {
    id: 'qa-cypress',
    name: 'QA suite',
    description: {
      en: 'Cypress suite with E2E and API tests that checks this live portfolio. It found two real responsive bugs.',
      es: 'Suite de Cypress con pruebas E2E y de API que revisa este portafolio en producción. Encontró dos bugs reales de responsive.',
    },
    repo: 'https://github.com/Frandercc1234/portafolio-qa-cypress',
    caseSlug: 'qa-cypress',
  },
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
