import type { Metadata } from "next";
import { getService, getCategory, services, formatMXN } from "@/data/services";
import { ServiceDetailView } from "@/components/service/ServiceDetailView";

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
  const priceLine =
    service.pricingType === "fixed"
      ? `Desde ${formatMXN(service.priceMin)}`
      : `${formatMXN(service.priceMin)}–${formatMXN(service.priceMax)}`;
  const description = `${service.desc.es} ${priceLine}. Solicita, paga en línea y sigue tu proyecto con Audax.`;

  return {
    title: `${service.name.es} · ${category?.name.es ?? "Servicios"}`,
    description,
    alternates: { canonical: `/servicios/detalle/${service.slug}` },
    openGraph: {
      title: `${service.name.es} — Audax Project`,
      description,
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
  return <ServiceDetailView slug={slug} />;
}
