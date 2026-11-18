import { useTranslations } from 'next-intl';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { SOCIAL } from '@/lib/site';
import { ContactForm } from './ContactForm';
import { Eyebrow, Section } from './Section';

export function Contact() {
  const t = useTranslations('Home.contact');

  return (
    <Section id="contact" title={t('title')} last>
      <div className="grid gap-12 lg:grid-cols-[736px_410px] lg:justify-between">
        <ContactForm />
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
