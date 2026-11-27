'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: { sitekey: string; theme?: 'light'; language?: string; size?: 'normal' | 'compact' },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Props = {
  siteKey: string | undefined;
  locale: string;
  /** Al cambiar, el widget se reinicia (el token de Turnstile sirve una sola vez). */
  resetKey: number;
  placeholder: string;
};

/** Widget de Cloudflare Turnstile en un hueco de 300×65 px (150×140 si no caben 300 px). */
export function TurnstileWidget({ siteKey, locale, resetKey, placeholder }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // El script de Cloudflare pesa y el formulario está al final: se pide solo al acercarse.
  const [near, setNear] = useState(false);

  const render = useCallback(() => {
    if (!siteKey || !box.current || !window.turnstile || widgetId.current) return;
    // El widget normal mide 300 px: si el hueco es más angosto se usa el compacto (150×140).
    const compact = box.current.clientWidth < 300;
    box.current.style.height = compact ? '140px' : '';
    widgetId.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      theme: 'light',
      language: locale,
      size: compact ? 'compact' : 'normal',
    });
  }, [siteKey, locale]);

  useEffect(() => {
    const el = box.current;
    if (!el || near) return;
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, siteKey]);

  useEffect(() => {
    const id = widgetId;
    return () => {
      if (id.current && window.turnstile) window.turnstile.remove(id.current);
      id.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  }, [resetKey]);

  if (!siteKey) {
    return (
      <div
        data-turnstile-slot
        className="flex h-[65px] w-[300px] max-w-full items-center justify-center rounded-control border border-dashed border-ink-soft px-2 text-center fs-label text-ink-soft"
      >
        {placeholder}
      </div>
    );
  }

  return (
    <>
      {near && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={render}
        />
      )}
      <div ref={box} data-turnstile-slot className="h-[65px] w-[300px] max-w-full" />
    </>
  );
}
