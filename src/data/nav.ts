import type { Lang } from "@/i18n/dictionary";

/**
 * Estructura de navegación (mega-menús). La usan el navbar de escritorio,
 * el menú móvil y la barra inferior — una sola fuente de verdad.
 * `icon` es el nombre de un ícono de lucide-react (mapeado en el componente).
 */
export type NavItem = {
  href: string;
  icon: string;
  label: Record<Lang, string>;
  desc: Record<Lang, string>;
};

export type NavSectionId = "productos" | "soluciones" | "recursos";

export type NavSection = {
  id: NavSectionId;
  icon: string;
  label: Record<Lang, string>;
  tagline: Record<Lang, string>;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    id: "productos",
    icon: "Code2",
    label: { es: "Productos", en: "Products" },
    tagline: {
      es: "Desarrollo web y software a la medida.",
      en: "Custom web & software development.",
    },
    items: [
      {
        href: "/servicios/detalle/business-website",
        icon: "Globe",
        label: { es: "Desarrollo web", en: "Web development" },
        desc: { es: "Sitios multipágina con SEO", en: "Multi-page sites with SEO" },
      },
      {
        href: "/servicios/detalle/landing-page",
        icon: "LayoutTemplate",
        label: { es: "Landing pages", en: "Landing pages" },
        desc: { es: "Una página que convierte", en: "One page that converts" },
      },
      {
        href: "/servicios/detalle/e-commerce",
        icon: "ShoppingBag",
        label: { es: "Tiendas en línea", en: "Online stores" },
        desc: { es: "E-commerce con pagos", en: "E-commerce with payments" },
      },
      {
        href: "/servicios/detalle/multiplatform-app",
        icon: "Smartphone",
        label: { es: "Apps móviles", en: "Mobile apps" },
        desc: { es: "iOS + Android", en: "iOS + Android" },
      },
      {
        href: "/servicios/detalle/app-ui-ux",
        icon: "PenTool",
        label: { es: "Diseño UI/UX", en: "UI/UX design" },
        desc: { es: "Interfaz y experiencia", en: "Interface & experience" },
      },
    ],
  },
  {
    id: "soluciones",
    icon: "Palette",
    label: { es: "Soluciones", en: "Solutions" },
    tagline: {
      es: "Diseño, contenido y creatividad para tu marca.",
      en: "Design, content and creative for your brand.",
    },
    items: [
      {
        href: "/servicios/detalle/logo-design",
        icon: "Sparkles",
        label: { es: "Logos & Branding", en: "Logos & Branding" },
        desc: { es: "Identidad visual", en: "Visual identity" },
      },
      {
        href: "/servicios/design",
        icon: "Palette",
        label: { es: "Diseño gráfico", en: "Graphic design" },
        desc: { es: "Tarjetas, flyers, menús", en: "Cards, flyers, menus" },
      },
      {
        href: "/servicios/detalle/restaurant-session",
        icon: "Camera",
        label: { es: "Fotografía", en: "Photography" },
        desc: { es: "Producto y ambiente", en: "Product & ambiance" },
      },
      {
        href: "/servicios/detalle/reels-social",
        icon: "Clapperboard",
        label: { es: "Reels & Redes", en: "Reels & Social" },
        desc: { es: "Contenido para redes", en: "Social media content" },
      },
      {
        href: "/servicios/detalle/video-editing",
        icon: "Film",
        label: { es: "Edición de video", en: "Video editing" },
        desc: { es: "Video profesional", en: "Professional video" },
      },
      {
        href: "/luts",
        icon: "Aperture",
        label: { es: "LUTs de color", en: "Color LUTs" },
        desc: { es: "Presets para foto y video", en: "Presets for photo & video" },
      },
    ],
  },
  {
    id: "recursos",
    icon: "LifeBuoy",
    label: { es: "Recursos", en: "Resources" },
    tagline: {
      es: "Aprende, resuelve dudas y descubre ideas.",
      en: "Learn, get answers and discover ideas.",
    },
    items: [
      {
        href: "/ayuda",
        icon: "LifeBuoy",
        label: { es: "Centro de ayuda", en: "Help Center" },
        desc: {
          es: "Cómo funciona la plataforma",
          en: "How the platform works",
        },
      },
      {
        href: "/foro",
        icon: "MessagesSquare",
        label: { es: "Foro", en: "Forum" },
        desc: { es: "Comunidad y preguntas", en: "Community & questions" },
      },
      {
        href: "/blog",
        icon: "Newspaper",
        label: { es: "Blog", en: "Blog" },
        desc: { es: "Ideas, guías y novedades", en: "Ideas, guides & news" },
      },
    ],
  },
];
