import type { Metadata } from "next";
import { getService, getCategory, services, formatMXN } from "@/data/services";
import { ServiceDetailView } from "@/components/service/ServiceDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Servicio no encontrado" };

  const category = getCategory(service.category);
  const priceLine = service.hidePrice
    ? "Cotización a medida"
    : service.pricingType === "fixed"
      ? `Desde ${formatMXN(service.priceMin)}`
      : `${formatMXN(service.priceMin)}–${formatMXN(service.priceMax)}`;
  const description = `${service.desc.es} ${priceLine}. Solicita, paga en línea y sigue tu proyecto con Audax Project, 100% en línea para todo México.`;

  return {
    title: `${service.name.es} · ${category?.name.es ?? "Servicios"}`,
    description,
    keywords: [
      service.name.es,
      `${service.name.es} México`,
      `${service.name.es} en línea`,
      category?.name.es ?? "",
      "Audax Project",
    ].filter(Boolean),
    alternates: { canonical: `/servicios/detalle/${service.slug}` },
    openGraph: {
      title: `${service.name.es} — Audax Project`,
      description,
      url: `/servicios/detalle/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  const category = service ? getCategory(service.category) : undefined;

  return (
    <>
      {service && (
        <>
          <JsonLd data={serviceSchema(service, category)} />
          <JsonLd
            data={breadcrumbSchema([
              { name: "Inicio", path: "/" },
              { name: "Servicios", path: "/servicios" },
              ...(category
                ? [
                    {
                      name: category.name.es,
                      path: `/servicios/${category.slug}`,
                    },
                  ]
                : []),
              {
                name: service.name.es,
                path: `/servicios/detalle/${service.slug}`,
              },
            ])}
          />
        </>
      )}
      <ServiceDetailView slug={slug} />
    </>
  );
}
