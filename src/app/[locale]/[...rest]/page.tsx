import { notFound } from 'next/navigation';

// Captura rutas desconocidas dentro de un idioma para mostrar el 404 traducido.
export default function CatchAll() {
  notFound();
}
