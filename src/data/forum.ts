// Categorías del foro (fijas = temas siempre dentro del rubro de Audax).
// Config compartida cliente/servidor (sin imports server-only).

export type ForumCategory = {
  slug: string;
  icon: string; // nombre de ícono en navIcons
  label: string;
  desc: string;
};

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    slug: "desarrollo-web",
    icon: "Code2",
    label: "Desarrollo web y tech",
    desc: "Sitios, apps, herramientas y tecnología.",
  },
  {
    slug: "diseno-marca",
    icon: "Palette",
    label: "Diseño y marca",
    desc: "Identidad visual, logos y branding.",
  },
  {
    slug: "marketing",
    icon: "Clapperboard",
    label: "Marketing y redes",
    desc: "Publicidad, redes sociales y contenido.",
  },
  {
    slug: "soporte",
    icon: "LifeBuoy",
    label: "Soporte y sistema Audax",
    desc: "Dudas y comentarios sobre la plataforma.",
  },
];

export const FORUM_CATEGORY_SLUGS = FORUM_CATEGORIES.map((c) => c.slug);

export function getForumCategory(slug: string): ForumCategory | undefined {
  return FORUM_CATEGORIES.find((c) => c.slug === slug);
}

// Reglas de la comunidad (se muestran al publicar).
export const FORUM_RULES: string[] = [
  "Mantén los temas dentro del rubro: negocios, desarrollo web, diseño, marketing y la plataforma.",
  "Trato respetuoso. Nada de insultos, spam ni autopromoción sin aportar valor.",
  "No compartas datos personales, contraseñas ni información sensible.",
  "Reporta lo que no corresponda; el equipo modera y puede eliminar contenido fuera de lugar.",
];
