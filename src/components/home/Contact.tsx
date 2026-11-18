import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { SOCIAL } from '@/lib/site';
import { Eyebrow, Section } from './Section';

const field =
  'w-full rounded-control border border-ink-soft bg-paper px-3 text-ink transition-colors focus-visible:border-accent';

// El formulario se conecta a la Server Action en el paso 8; aquí solo el diseño.
export function Contact() {
  const t = useTranslations('Home.contact');

  return (
    <Section id="contact" title={t('title')} last>
      <div className="grid gap-12 lg:grid-cols-[736px_410px] lg:justify-between">
        <form noValidate>
          <div className="mb-5">
            <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
              {t('name')}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              className={`h-12 ${field}`}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
              {t('email')}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className={`h-12 ${field}`}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
              {t('message')}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              className={`min-h-[140px] py-3 ${field}`}
            />
          </div>
          <div
            data-turnstile-slot
            className="mb-5 flex h-[65px] w-[300px] max-w-full items-center justify-center rounded-control border border-dashed border-ink-soft px-2 text-center text-[13px] text-ink-soft"
          >
            {t('turnstileSlot')}
          </div>
          <Button type="button">{t('send')}</Button>
        </form>
        <ul className="space-y-5">
          <li>
            <Eyebrow>{t('email')}</Eyebrow>
            <a
              href={`mailto:${SOCIAL.email}`}
              className="inline-block font-serif text-2xl font-medium tracking-[-0.01em] break-words underline"
            >
              {SOCIAL.email}
            </a>
          </li>
          <li>
            <Eyebrow>LinkedIn</Eyebrow>
            <ExternalLink
              href={SOCIAL.linkedin}
              className="inline-block font-serif text-2xl font-medium tracking-[-0.01em] underline"
            >
              frander-centeno
            </ExternalLink>
          </li>
          <li>
            <Eyebrow>GitHub</Eyebrow>
            <ExternalLink
              href={SOCIAL.github}
              className="inline-block font-serif text-2xl font-medium tracking-[-0.01em] underline"
            >
              Frandercc1234
            </ExternalLink>
          </li>
        </ul>
      </div>
    </Section>
  );
}
