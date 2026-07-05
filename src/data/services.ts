import type { Lang } from "@/i18n/dictionary";

export type PricingType = "fixed" | "quote";

export type Service = {
  slug: string;
  category: CategorySlug;
  name: { es: string; en: string };
  desc: { es: string; en: string };
  /** MXN. For `fixed`, priceMin is the checkout price. For `quote`, it's the range floor. */
  priceMin: number;
  priceMax: number;
  unit?: { es: string; en: string };
  pricingType: PricingType;
  popular?: boolean;
};

export type CategorySlug = "design" | "tech" | "photo" | "packages";

export type Category = {
  slug: CategorySlug;
  icon: string; // lucide icon name
  name: { es: string; en: string };
  tagline: { es: string; en: string };
};

export const categories: Category[] = [
  {
    slug: "design",
    icon: "Palette",
    name: { es: "Diseño gráfico", en: "Graphics & Design" },
    tagline: {
      es: "Identidad visual que comunica quiénes son y por qué elegirlos.",
      en: "Visual identity that communicates who you are and why to choose you.",
    },
  },
  {
    slug: "tech",
    icon: "Code2",
    name: { es: "Programación & Tech", en: "Programming & Tech" },
    tagline: {
      es: "Sitios web y apps que convierten visitantes en clientes reales.",
      en: "Websites and apps that convert visitors into real customers.",
    },
  },
  {
    slug: "photo",
    icon: "Camera",
    name: { es: "Video & Foto", en: "Video & Photo" },
    tagline: {
      es: "Contenido visual de alta calidad para restaurantes, bares y hoteles.",
      en: "High-quality visual content for restaurants, bars and hotels.",
    },
  },
  {
    slug: "packages",
    icon: "Package",
    name: { es: "Paquetes", en: "Packages" },
    tagline: {
      es: "Todo en uno. Ahorra hasta 30% combinando diseño, web y contenido.",
      en: "All-in-one. Save up to 30% by combining design, web and content.",
    },
  },
];

export const services: Service[] = [
  // ── Design ──
  {
    slug: "logo-design",
    category: "design",
    name: { es: "Diseño de logo", en: "Logo Design" },
    desc: {
      es: "Logotipo profesional con variantes y guía de uso básica.",
      en: "Professional logo with variants and a basic usage guide.",
    },
    priceMin: 5500,
    priceMax: 12000,
    pricingType: "quote",
    popular: true,
  },
  {
    slug: "business-cards",
    category: "design",
    name: { es: "Tarjetas de presentación", en: "Business Cards" },
    desc: {
      es: "Diseño de tarjetas listo para imprenta.",
      en: "Print-ready business card design.",
    },
    priceMin: 1200,
    priceMax: 2500,
    pricingType: "fixed",
  },
  {
    slug: "flyers",
    category: "design",
    name: { es: "Flyers", en: "Flyers" },
    desc: {
      es: "Flyer promocional digital o para imprenta.",
      en: "Promotional flyer for digital or print.",
    },
    priceMin: 900,
    priceMax: 2000,
    pricingType: "fixed",
  },
  {
    slug: "menu-design",
    category: "design",
    name: { es: "Diseño de menú", en: "Menu Design" },
    desc: {
      es: "Menú para restaurante o bar, físico o digital.",
      en: "Restaurant or bar menu, physical or digital.",
    },
    priceMin: 3500,
    priceMax: 8000,
    pricingType: "quote",
  },
  {
    slug: "packaging-labels",
    category: "design",
    name: { es: "Packaging & etiquetas", en: "Packaging & Labels" },
    desc: {
      es: "Diseño de empaque y etiquetas de producto.",
      en: "Product packaging and label design.",
    },
    priceMin: 4000,
    priceMax: 9000,
    pricingType: "quote",
  },
  // ── Tech ──
  {
    slug: "landing-page",
    category: "tech",
    name: { es: "Landing page", en: "Landing Page" },
    desc: {
      es: "Página de una sola sección optimizada para conversión.",
      en: "Single-page site optimized for conversion.",
    },
    priceMin: 9000,
    priceMax: 18000,
    pricingType: "quote",
    popular: true,
  },
  {
    slug: "business-website",
    category: "tech",
    name: { es: "Sitio web de negocio", en: "Business Website" },
    desc: {
      es: "Sitio multipágina con CMS y buenas prácticas SEO.",
      en: "Multi-page website with CMS and SEO best practices.",
    },
    priceMin: 22000,
    priceMax: 55000,
    pricingType: "quote",
  },
  {
    slug: "e-commerce",
    category: "tech",
    name: { es: "E-commerce", en: "E-Commerce" },
    desc: {
      es: "Tienda en línea con pagos y gestión de inventario.",
      en: "Online store with payments and inventory management.",
    },
    priceMin: 45000,
    priceMax: 120000,
    pricingType: "quote",
  },
  {
    slug: "app-ui-ux",
    category: "tech",
    name: { es: "Diseño UI/UX de app", en: "App UI/UX Design" },
    desc: {
      es: "Diseño de interfaz y experiencia para tu aplicación.",
      en: "Interface and experience design for your app.",
    },
    priceMin: 12000,
    priceMax: 30000,
    pricingType: "quote",
  },
  {
    slug: "multiplatform-app",
    category: "tech",
    name: { es: "App multiplataforma", en: "Multiplatform App" },
    desc: {
      es: "Aplicación iOS + Android desde una base de código.",
      en: "iOS + Android application from a single codebase.",
    },
    priceMin: 55000,
    priceMax: 200000,
    pricingType: "quote",
  },
  // ── Photo / Video ──
  {
    slug: "restaurant-session",
    category: "photo",
    name: { es: "Sesión restaurante & bar", en: "Restaurant & Bar Session" },
    desc: {
      es: "Sesión fotográfica de platillos, bebidas y ambiente.",
      en: "Photo session of dishes, drinks and atmosphere.",
    },
    priceMin: 4500,
    priceMax: 9000,
    pricingType: "quote",
    popular: true,
  },
  {
    slug: "photo-editing",
    category: "photo",
    name: { es: "Edición de fotos", en: "Photo Editing" },
    desc: {
      es: "Retoque y edición profesional por foto.",
      en: "Professional retouching and editing per photo.",
    },
    priceMin: 80,
    priceMax: 200,
    unit: { es: "/ foto", en: "/ photo" },
    pricingType: "fixed",
  },
  {
    slug: "video-editing",
    category: "photo",
    name: { es: "Edición de video", en: "Video Editing" },
    desc: {
      es: "Edición profesional por minuto de video final.",
      en: "Professional editing per minute of final video.",
    },
    priceMin: 500,
    priceMax: 1200,
    unit: { es: "/ min", en: "/ min" },
    pricingType: "quote",
  },
  {
    slug: "reels-social",
    category: "photo",
    name: { es: "Reels / Redes sociales", en: "Reels / Social Media" },
    desc: {
      es: "Paquete mensual de reels y contenido para redes.",
      en: "Monthly package of reels and social content.",
    },
    priceMin: 3500,
    priceMax: 7000,
    unit: { es: "/ mes", en: "/ month" },
    pricingType: "quote",
  },
];

export function servicesByCategory(cat: CategorySlug): Service[] {
  return services.filter((s) => s.category === cat);
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function localized<T extends { es: string; en: string }>(
  field: T,
  lang: Lang,
): string {
  return field[lang];
}
