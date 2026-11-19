'use client';

import { startTransition, useActionState, useEffect, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { sendContact } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import type { ContactResult } from '@/lib/contact-schema';
import { SOCIAL } from '@/lib/site';
import { TurnstileWidget } from './TurnstileWidget';

const inputClass =
  'w-full rounded-control border border-ink-soft bg-paper px-3 text-ink transition-colors focus-visible:border-accent aria-[invalid=true]:border-accent';

const FIELDS = ['name', 'email', 'message'] as const;

export function ContactForm() {
  const t = useTranslations('Home.contact');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(
    sendContact,
    null,
  );
  const [startedAt, setStartedAt] = useState('');
  const [resetKey, setResetKey] = useState(0);

  // La marca de tiempo se toma en el navegador, ya hidratada.
  useEffect(() => setStartedAt(String(Date.now())), []);

  const invalid = state && !state.ok && state.error === 'VALIDATION' ? (state.fields ?? []) : [];

  useEffect(() => {
    if (!state) return;
    if (!state.ok) {
      setResetKey((k) => k + 1);
      if (state.error === 'VALIDATION' && state.fields?.length) {
        document.getElementById(`contact-${state.fields[0]}`)?.focus();
      }
    }
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <div>
      <div role="status" aria-live="polite">
        {state?.ok && (
          <p className="fade-in font-serif text-2xl leading-[1.3] font-medium">{t('success')}</p>
        )}
      </div>
      {!state?.ok && (
        <form noValidate onSubmit={onSubmit}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="startedAt" value={startedAt} />
          {/* Honeypot: fuera de pantalla, sin foco y oculto a lectores de pantalla. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {FIELDS.map((field) => {
            const hasError = invalid.includes(field);
            const common = {
              id: `contact-${field}`,
              name: field,
              'aria-invalid': hasError || undefined,
              'aria-describedby': hasError ? `contact-${field}-error` : undefined,
            };
            return (
              <div key={field} className="mb-5">
                <label htmlFor={`contact-${field}`} className="mb-2 block text-sm font-medium">
                  {t(field)}
                </label>
                {field === 'message' ? (
                  <textarea
                    {...common}
                    rows={5}
                    maxLength={2000}
                    className={`min-h-[140px] py-3 ${inputClass}`}
                  />
                ) : (
                  <input
                    {...common}
                    type={field === 'email' ? 'email' : 'text'}
                    autoComplete={field}
                    maxLength={field === 'email' ? 254 : 80}
                    className={`h-12 ${inputClass}`}
                  />
                )}
                {hasError && (
                  <p id={`contact-${field}-error`} className="mt-2 text-sm text-accent">
                    {t(`errors.${field}`)}
                  </p>
                )}
              </div>
            );
          })}

          <div className="mb-5">
            <TurnstileWidget
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              locale={locale}
              resetKey={resetKey}
              placeholder={t('turnstileSlot')}
            />
          </div>

          {state && !state.ok && state.error === 'TURNSTILE' && (
            <p role="alert" className="mb-5 text-sm text-accent">
              {t('errorTurnstile')}
            </p>
          )}
          {state && !state.ok && state.error === 'SEND' && (
            <p role="alert" className="mb-5 text-sm text-accent">
              {t('errorSend')}{' '}
              <a href={`mailto:${SOCIAL.email}`} className="underline">
                {SOCIAL.email}
              </a>
              .
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? t('sending') : t('send')}
          </Button>
        </form>
      )}
    </div>
  );
}
