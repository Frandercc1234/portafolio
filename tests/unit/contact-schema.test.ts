import { describe, expect, it } from 'vitest';
import { MIN_FILL_MS, isBotSubmission, parseContact, readContactForm } from '@/lib/contact-schema';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hola, quiero hablar de un proyecto de dashboards.',
  locale: 'es',
  website: '',
  startedAt: '1000',
};

function fieldsOf(overrides: Record<string, string>) {
  const result = parseContact({ ...valid, ...overrides });
  return result.ok ? [] : result.fields;
}

describe('parseContact', () => {
  it('acepta un caso válido', () => {
    const result = parseContact(valid);
    expect(result.ok).toBe(true);
  });

  it('recorta los espacios de nombre, correo y mensaje', () => {
    const result = parseContact({ ...valid, name: '  Ada  ', email: ' ada@example.com ' });
    expect(result.ok && result.data.name).toBe('Ada');
    expect(result.ok && result.data.email).toBe('ada@example.com');
  });

  it.each([
    ['name', { name: 'A' }],
    ['name', { name: 'x'.repeat(81) }],
    ['name', { name: '   ' }],
    ['email', { email: 'no-es-un-correo' }],
    ['email', { email: '' }],
    ['message', { message: 'x'.repeat(19) }],
    ['message', { message: 'x'.repeat(2001) }],
    ['message', { message: ' '.repeat(40) }],
    ['locale', { locale: 'fr' }],
  ])('rechaza el campo %s inválido', (field, overrides) => {
    expect(fieldsOf(overrides)).toEqual([field]);
  });

  it('acepta los límites exactos', () => {
    expect(fieldsOf({ name: 'Al' })).toEqual([]);
    expect(fieldsOf({ name: 'x'.repeat(80) })).toEqual([]);
    expect(fieldsOf({ message: 'x'.repeat(20) })).toEqual([]);
    expect(fieldsOf({ message: 'x'.repeat(2000) })).toEqual([]);
  });

  it('con el formulario vacío marca los cuatro campos del visitante', () => {
    const result = parseContact(readContactForm(new FormData()));
    expect(result.ok).toBe(false);
    expect(!result.ok && result.fields.sort()).toEqual(['email', 'locale', 'message', 'name']);
  });

  it('el honeypot y la marca de tiempo no cuentan como errores de validación', () => {
    expect(fieldsOf({ website: 'http://spam.example', startedAt: 'abc' })).toEqual([]);
  });
});

describe('readContactForm', () => {
  it('ignora archivos y campos desconocidos', () => {
    const form = new FormData();
    form.set('name', 'Ada');
    form.set('extra', 'x');
    form.set('message', new File(['hola'], 'a.txt'));
    const raw = readContactForm(form);
    expect(raw.name).toBe('Ada');
    expect(raw.message).toBe('');
    expect('extra' in raw).toBe(false);
  });
});

describe('isBotSubmission', () => {
  const now = 10_000_000;

  it('un envío normal no es un bot', () => {
    expect(isBotSubmission({ website: '', startedAt: String(now - 10_000) }, now)).toBe(false);
  });

  it('el honeypot con texto es un bot', () => {
    expect(isBotSubmission({ website: 'x', startedAt: String(now - 10_000) }, now)).toBe(true);
  });

  it('menos de 3 s desde el render es un bot', () => {
    expect(isBotSubmission({ website: '', startedAt: String(now - 2999) }, now)).toBe(true);
    expect(isBotSubmission({ website: '', startedAt: String(now - 500) }, now)).toBe(true);
  });

  it('justo a los 3 s ya es una persona', () => {
    expect(isBotSubmission({ website: '', startedAt: String(now - MIN_FILL_MS) }, now)).toBe(false);
  });

  it('una marca de tiempo vacía, inválida o del futuro es un bot', () => {
    expect(isBotSubmission({ website: '', startedAt: '' }, now)).toBe(true);
    expect(isBotSubmission({ website: '', startedAt: 'abc' }, now)).toBe(true);
    expect(isBotSubmission({ website: '', startedAt: String(now + 60_000) }, now)).toBe(true);
  });
});
