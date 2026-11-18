export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const SOCIAL = {
  github: 'https://github.com/Frandercc1234',
  linkedin: 'https://www.linkedin.com/in/frander-centeno-6a1982323/',
  email: 'centenofrander@gmail.com',
} as const;

// PDF del CV en el idioma de la página; el botón lo descarga.
export const CV_URL: Record<'en' | 'es', string> = {
  en: '/cv/CV_Frander_Centeno_EN.pdf',
  es: '/cv/CV_Frander_Centeno_ES.pdf',
};
