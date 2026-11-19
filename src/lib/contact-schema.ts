import { z } from 'zod';

/** Menos de este tiempo entre el render y el envío se considera un bot. */
export const MIN_FILL_MS = 3000;

export const CONTACT_FIELDS = ['name', 'email', 'message', 'locale'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(254).pipe(z.email()),
  message: z.string().trim().min(20).max(2000),
  locale: z.enum(['en', 'es']),
  // Honeypot: un humano lo deja vacío; el contenido se revisa en isBotSubmission.
  website: z.string().default(''),
  // Marca de tiempo del render (ms), como texto.
  startedAt: z.string().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  { ok: true } | { ok: false; error: 'VALIDATION' | 'TURNSTILE' | 'SEND'; fields?: string[] };

/** Lee del FormData solo los campos conocidos y solo como texto. */
export function readContactForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };
  return {
    name: get('name'),
    email: get('email'),
    message: get('message'),
    locale: get('locale'),
    website: get('website'),
    startedAt: get('startedAt'),
  };
}

export function parseContact(
  raw: Record<string, string>,
): { ok: true; data: ContactInput } | { ok: false; fields: string[] } {
  const parsed = contactSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  const fields = new Set<string>();
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0]);
    if ((CONTACT_FIELDS as readonly string[]).includes(key)) fields.add(key);
  }
  return { ok: false, fields: [...fields] };
}

/** Bot: honeypot con texto, marca de tiempo inválida o envío en menos de 3 s. */
export function isBotSubmission(
  data: Pick<ContactInput, 'website' | 'startedAt'>,
  now: number = Date.now(),
): boolean {
  if (data.website.trim() !== '') return true;
  const started = Number(data.startedAt);
  if (!Number.isFinite(started) || started <= 0) return true;
  return now - started < MIN_FILL_MS;
}
