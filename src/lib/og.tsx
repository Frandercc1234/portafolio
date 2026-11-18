import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = path.join(process.cwd(), 'src', 'assets', 'fonts');

// Tokens de DESIGN.md.
const COLOR = { paper: '#FAF8F5', ink: '#1A1917', soft: '#5E5A54', accent: '#C2410C' };

async function loadFonts() {
  const [serif, sans, sansMedium] = await Promise.all([
    readFile(path.join(FONT_DIR, 'Newsreader-Medium.ttf')),
    readFile(path.join(FONT_DIR, 'SchibstedGrotesk-Regular.ttf')),
    readFile(path.join(FONT_DIR, 'SchibstedGrotesk-Medium.ttf')),
  ]);
  return [
    { name: 'Newsreader', data: serif, weight: 500 as const, style: 'normal' as const },
    { name: 'Schibsted Grotesk', data: sans, weight: 400 as const, style: 'normal' as const },
    { name: 'Schibsted Grotesk', data: sansMedium, weight: 500 as const, style: 'normal' as const },
  ];
}

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
};

function titleSize(title: string) {
  if (title.length > 44) return 68;
  if (title.length > 30) return 82;
  if (title.length > 18) return 104;
  return 132;
}

function clip(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Imagen Open Graph de 1200×630 con las fuentes y los colores del sitio. */
export async function renderOgImage({ eyebrow, title, subtitle, footer }: Props) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: COLOR.paper,
        color: COLOR.ink,
        padding: '72px 80px',
        fontFamily: 'Schibsted Grotesk',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 96, height: 8, background: COLOR.accent, marginBottom: 36 }} />
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: COLOR.soft,
          }}
        >
          {eyebrow}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'Newsreader',
            fontWeight: 500,
            fontSize: titleSize(title),
            lineHeight: 1.04,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 28, maxWidth: 980 }}>
          {clip(subtitle, 130)}
        </div>
      </div>
      <div style={{ fontSize: 28, color: COLOR.soft }}>{footer}</div>
    </div>,
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
