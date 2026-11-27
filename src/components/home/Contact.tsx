import { useTranslations } from 'next-intl';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { SOCIAL } from '@/lib/site';
import { ContactForm } from './ContactForm';
import { Eyebrow, Section } from './Section';

const linkClass = 'inline-flex min-h-11 items-center wrap-anywhere underline hover:text-accent';

export function Contact() {
  const t = useTranslations('Home.contact');

  return (
    <Section id="contact" title={t('title')} last>
      <div className="col-span-12 min-w-0 md:col-span-8 lg:col-start-5 lg:col-end-10">
        <ContactForm />
      </div>
      <ul className="col-span-12 min-w-0 space-y-6 md:col-span-4 lg:col-start-10 lg:col-end-13">
        <li>
          <Eyebrow>{t('email')}</Eyebrow>
          <a href={`mailto:${SOCIAL.email}`} className={linkClass}>
            {SOCIAL.email}
          </a>
        </li>
        <li>
          <Eyebrow>LinkedIn</Eyebrow>
          <ExternalLink href={SOCIAL.linkedin} className={linkClass}>
            frander-centeno
          </ExternalLink>
        </li>
        <li>
          <Eyebrow>GitHub</Eyebrow>
          <ExternalLink href={SOCIAL.github} className={linkClass}>
            Frandercc1234
          </ExternalLink>
        </li>
      </ul>
    </Section>
  );
}
