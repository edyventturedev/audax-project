import type { Metadata } from "next";
import { services } from "@/data/services";
import { ServicesCatalogClient } from "@/components/site/ServicesCatalogClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Catálogo de servicios — Diseño, web, apps, foto y video",
  description:
    "Explora los servicios de Audax Project: desarrollo web, diseño gráfico, logotipos, e-commerce, apps, fotografía y video. Cotiza al instante y paga en línea desde Mérida, Yucatán.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Catálogo de servicios — Audax Project",
    description:
      "Desarrollo web, diseño, apps, fotografía y video. Cotiza al instante y sigue tu proyecto.",
    url: "/servicios",
    type: "website",
  },
};

export default function ServicesCatalogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ])}
      />
      <JsonLd data={itemListSchema(services)} />
      <ServicesCatalogClient />
    </>
  );
}
