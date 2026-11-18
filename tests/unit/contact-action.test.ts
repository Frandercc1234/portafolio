import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
const verifyTurnstile = vi.fn();

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }),
}));
vi.mock('@/lib/turnstile', () => ({
  verifyTurnstile: (...args: unknown[]) => verifyTurnstile(...args),
}));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

import { sendContact } from '@/app/actions/contact';

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const base: Record<string, string> = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Hola, quiero hablar de un proyecto de dashboards.',
    locale: 'en',
    website: '',
    startedAt: String(Date.now() - 10_000),
    'cf-turnstile-response': 'token-ok',
    ...overrides,
  };
  for (const [key, value] of Object.entries(base)) data.set(key, value);
  return data;
}

beforeEach(() => {
  send.mockReset().mockResolvedValue({ data: { id: '1' }, error: null });
  verifyTurnstile.mockReset().mockResolvedValue(true);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.stubEnv('RESEND_API_KEY', 're_test');
  vi.stubEnv('CONTACT_TO_EMAIL', 'dueno@example.com');
  vi.stubEnv('CONTACT_FROM_EMAIL', 'Portfolio <onboarding@resend.dev>');
  vi.stubEnv('NODE_ENV', 'production');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('sendContact', () => {
  it('con datos inválidos devuelve VALIDATION con los campos', async () => {
    const result = await sendContact(null, form({ name: 'A', email: 'mal' }));
    expect(result).toEqual({ ok: false, error: 'VALIDATION', fields: ['name', 'email'] });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('honeypot con texto: éxito falso, sin verificar ni enviar', async () => {
    const result = await sendContact(null, form({ website: 'http://spam.example' }));
    expect(result).toEqual({ ok: true });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('envío en menos de 3 s: éxito falso, sin verificar ni enviar', async () => {
    const result = await sendContact(null, form({ startedAt: String(Date.now() - 500) }));
    expect(result).toEqual({ ok: true });
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('si Turnstile falla devuelve TURNSTILE y no envía', async () => {
    verifyTurnstile.mockResolvedValue(false);
    const result = await sendContact(null, form());
    expect(result).toEqual({ ok: false, error: 'TURNSTILE' });
    expect(send).not.toHaveBeenCalled();
  });

  it('verifica el token con la primera IP de x-forwarded-for', async () => {
    await sendContact(null, form());
    expect(verifyTurnstile).toHaveBeenCalledWith('token-ok', '203.0.113.7');
  });

  it('envía texto plano con replyTo del visitante y un asunto sin saltos de línea', async () => {
    const result = await sendContact(
      null,
      form({
        name: 'Ada <b>Lovelace</b>\nBcc: otro@example.com',
        message: '<script>x</script> '.repeat(3),
      }),
    );
    expect(result).toEqual({ ok: true });
    const payload = send.mock.calls[0][0];
    expect(payload.to).toBe('dueno@example.com');
    expect(payload.replyTo).toBe('ada@example.com');
    expect(payload.html).toBeUndefined();
    expect(payload.subject).not.toMatch(/[\r\n<>]/);
    expect(payload.text).toContain('<script>x</script>');
  });

  it('si Resend devuelve un error responde SEND', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'boom' } });
    expect(await sendContact(null, form())).toEqual({ ok: false, error: 'SEND' });
  });

  it('si Resend lanza una excepción responde SEND', async () => {
    send.mockRejectedValue(new Error('red'));
    expect(await sendContact(null, form())).toEqual({ ok: false, error: 'SEND' });
  });

  it('sin clave de Resend: en producción responde SEND', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect(await sendContact(null, form())).toEqual({ ok: false, error: 'SEND' });
    expect(send).not.toHaveBeenCalled();
  });

  it('sin clave de Resend fuera de producción responde ok sin enviar', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('NODE_ENV', 'test');
    expect(await sendContact(null, form())).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('nunca registra el mensaje del visitante, solo el código', async () => {
    verifyTurnstile.mockResolvedValue(false);
    await sendContact(null, form({ message: 'mensaje-secreto-del-visitante-1234' }));
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).toContain('TURNSTILE');
    expect(logged).not.toContain('mensaje-secreto');
  });
});
