import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { compileMDX } from 'next-mdx-remote/rsc';
import { describe, expect, it } from 'vitest';

async function render(source: string) {
  const { content } = await compileMDX({
    source,
    components: { Figure: () => createElement('figure', null, 'figura') },
    options: { blockJS: true, blockDangerousJS: true },
  });
  return renderToStaticMarkup(content);
}

// Comprueba la configuración real de la librería (versión 6): el MDX no ejecuta JavaScript.
describe('next-mdx-remote bloquea JavaScript en el MDX', () => {
  it('quita las expresiones {…}', async () => {
    const html = await render('Valor: {1 + 1} y {process.env.HOME} fin');
    expect(html).not.toContain('2');
    expect(html).not.toContain('process');
    expect(html).not.toContain('HOME');
    expect(html).toContain('fin');
  });

  it('no ejecuta llamadas a funciones peligrosas', async () => {
    const html = await render('Hola {eval("1+1")} {globalThis.process} fin');
    expect(html).not.toContain('eval');
    expect(html).toContain('fin');
  });

  it('quita las expresiones dentro de los atributos de un componente', async () => {
    const html = await render('<Figure src={`/projects/${process.env.X}`} alt="a" />');
    expect(html).not.toMatch(/process\.env/);
  });

  it('sigue renderizando Markdown y los componentes permitidos', async () => {
    const html = await render(
      '## Título\n\nTexto con **negrita**.\n\n<Figure src="/projects/a/b.webp" alt="alt" />',
    );
    expect(html).toContain('<h2>Título</h2>');
    expect(html).toContain('<strong>negrita</strong>');
    expect(html).toContain('figura');
  });
});
