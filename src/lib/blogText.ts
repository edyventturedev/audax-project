// Utilidades de texto del blog, seguras para cliente y servidor (sin imports).

/** Convierte un título en slug (minúsculas, sin acentos, guiones). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD") // separa letra y acento; el acento se elimina abajo
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Estima minutos de lectura a partir del texto (200 palabras/min). */
export function estimateReadMin(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
