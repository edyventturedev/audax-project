/**
 * Configuración central del sitio — fuente única de verdad para SEO:
 * URL canónica, marca, contacto, ubicación y redes. La usan el layout,
 * el sitemap, robots y los datos estructurados (JSON-LD).
 */

// Dominio canónico para Google. Preferimos la env de producción, pero
// nunca usamos localhost como canónico (rompería sitemap/OG en prod).
const CANONICAL_FALLBACK = "https://audax-project.vercel.app";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
export const SITE_URL =
  envUrl && !envUrl.includes("localhost") ? envUrl : CANONICAL_FALLBACK;

export const SITE_NAME = "Audax Project";
export const SITE_TAGLINE = "Estudio creativo · Mérida, Yucatán";

export const SITE_DESCRIPTION =
  "Estudio creativo en Mérida, Yucatán: desarrollo web, diseño gráfico, apps, fotografía y video para negocios. Solicita, cotiza y paga en línea, y sigue el progreso de tu proyecto en un solo lugar.";

export const CONTACT_EMAIL = "audaxcreativeproject@gmail.com";

export const SOCIAL = {
  instagram: "https://instagram.com/audaxproject",
};

export const LOCATION = {
  city: "Mérida",
  region: "Yucatán",
  country: "MX",
};

// Palabras clave de la marca/negocio para el posicionamiento local.
export const SITE_KEYWORDS = [
  "desarrollo web Mérida",
  "diseño web Yucatán",
  "páginas web Mérida",
  "diseño gráfico Mérida",
  "diseño de logotipos",
  "e-commerce México",
  "aplicaciones móviles",
  "fotografía de producto",
  "fotografía de restaurantes",
  "video para redes sociales",
  "agencia creativa Mérida",
  "estudio de diseño Yucatán",
];
