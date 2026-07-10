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

type BilingualPost = {
  title: string;
  title_en?: string | null;
  excerpt: string;
  excerpt_en?: string | null;
  body?: string;
  body_en?: string | null;
  tag: string;
  tag_en?: string | null;
};

export type LocalizedBlog = {
  title: string;
  excerpt: string;
  body: string;
  tag: string;
};

/** Devuelve los campos del post en el idioma pedido (con respaldo al español). */
export function localizeBlog(p: BilingualPost, lang: "es" | "en"): LocalizedBlog {
  const en = lang === "en";
  return {
    title: (en && p.title_en) || p.title,
    excerpt: (en && p.excerpt_en) || p.excerpt || "",
    body: (en && p.body_en) || p.body || "",
    tag: (en && p.tag_en) || p.tag,
  };
}
