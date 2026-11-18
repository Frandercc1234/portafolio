'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import {
  isBotSubmission,
  parseContact,
  readContactForm,
  type ContactResult,
} from '@/lib/contact-schema';
import { verifyTurnstile } from '@/lib/turnstile';

function fail(error: 'VALIDATION' | 'TURNSTILE' | 'SEND', fields?: string[]): ContactResult {
  // Solo se registra el código de error, nunca el mensaje del visitante.
  console.error(`[contact] ${error}`);
  return fields ? { ok: false, error, fields } : { ok: false, error };
}

/** Quita saltos de línea y caracteres de control: el asunto nunca lleva HTML ni cabeceras extra. */
function cleanSubject(text: string) {
  return text
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function sendContact(
  _prevState: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  const parsed = parseContact(readContactForm(formData));
  if (!parsed.ok) return fail('VALIDATION', parsed.fields);
  const data = parsed.data;

  // Bot: éxito falso, sin enviar y sin avisarle.
  if (isBotSubmission(data)) return { ok: true };

  const token = formData.get('cf-turnstile-response');
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (!(await verifyTurnstile(typeof token === 'string' ? token : '', ip))) {
    return fail('TURNSTILE');
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave: en desarrollo y en CI no se envía; en producción es un error.
    return process.env.NODE_ENV !== 'production' ? { ok: true } : fail('SEND');
  }
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!to || !from) return fail('SEND');

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Portfolio: message from ${cleanSubject(data.name)}`,
      // Texto plano: nada del visitante se interpreta como HTML.
      text: `Name: ${data.name}\nEmail: ${data.email}\nLanguage: ${data.locale}\n\n${data.message}`,
    });
    return error ? fail('SEND') : { ok: true };
  } catch {
    return fail('SEND');
  }
}
