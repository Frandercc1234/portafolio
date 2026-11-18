import Image from 'next/image';

type Props = { src: string; alt: string; caption?: string };

/** Figura del caso: solo imágenes de public/projects, más anchas que el texto. */
export function Figure({ src, alt, caption }: Props) {
  if (!src.startsWith('/projects/')) {
    throw new Error(`Figure solo acepta imágenes de /projects/: ${src}`);
  }
  return (
    <figure className="case-fig">
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        sizes="(min-width: 1100px) 1000px, 100vw"
        className="h-auto w-full rounded-image"
      />
      {caption && <figcaption className="mt-2 text-sm text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}
