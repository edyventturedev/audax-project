/**
 * Constructores de datos estructurados (schema.org / JSON-LD).
 * Ayudan a Google a mostrar el negocio como ficha local, con servicios,
 * precios y migas de pan (breadcrumbs) en los resultados de búsqueda.
 */
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  SOCIAL,
  LOCATION,
} from "./site";
import { formatMXN, type Category, type Service } from "@/data/services";

const ORG_ID = `${SITE_URL}/#organization`;

/** Ficha del negocio (aparece como ProfessionalService/LocalBusiness). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/icon.png`,
    logo: `${SITE_URL}/icon.png`,
    email: CONTACT_EMAIL,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCATION.city,
      addressRegion: LOCATION.region,
      addressCountry: LOCATION.country,
    },
    areaServed: [
      { "@type": "City", name: "Mérida" },
      { "@type": "State", name: "Yucatán" },
      { "@type": "Country", name: "México" },
    ],
    sameAs: [SOCIAL.instagram],
  };
}

/** El sitio como WebSite (habilita el nombre del sitio en resultados). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-MX",
    publisher: { "@id": ORG_ID },
  };
}

/** Un servicio concreto, con su oferta de precio. */
export function serviceSchema(service: Service, category?: Category) {
  const isFixed = service.pricingType === "fixed";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name.es,
    description: service.desc.es,
    url: `${SITE_URL}/servicios/detalle/${service.slug}`,
    serviceType: category?.name.es,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "México" },
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: service.priceMin,
      ...(isFixed
        ? {}
        : {
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: service.priceMin,
              maxPrice: service.priceMax,
              priceCurrency: "MXN",
            },
          }),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/servicios/detalle/${service.slug}`,
      description: isFixed
        ? `Precio fijo: ${formatMXN(service.priceMin)}`
        : `Desde ${formatMXN(service.priceMin)}`,
    },
  };
}

/** Migas de pan para orientación en resultados. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Lista de servicios de una categoría (para páginas de catálogo). */
export function itemListSchema(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name.es,
      url: `${SITE_URL}/servicios/detalle/${s.slug}`,
    })),
  };
}
