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
export const SITE_TAGLINE = "Estudio creativo digital · México";

export const SITE_DESCRIPTION =
  "Estudio creativo digital en México: desarrollo web, diseño gráfico, apps, e-commerce, fotografía y video para negocios de todo el país. Trabajamos 100% en línea: solicita, cotiza, paga y sigue el progreso de tu proyecto en un solo lugar.";

export const CONTACT_EMAIL = "audaxcreativeproject@gmail.com";

export const SOCIAL = {
  instagram: "https://instagram.com/audaxproject",
};

// País de operación. Se atiende a todo México de forma remota.
export const COUNTRY = { name: "México", code: "MX" };

// Palabras clave de la marca/negocio — enfoque NACIONAL (todo México).
export const SITE_KEYWORDS = [
  "desarrollo web México",
  "diseño web México",
  "páginas web México",
  "agencia digital México",
  "agencia creativa México",
  "diseño gráfico México",
  "diseño de logotipos",
  "diseño de marca",
  "e-commerce México",
  "tiendas en línea México",
  "desarrollo de apps México",
  "aplicaciones móviles México",
  "diseño UI/UX",
  "fotografía de producto",
  "video para redes sociales",
  "estudio creativo digital",
];
