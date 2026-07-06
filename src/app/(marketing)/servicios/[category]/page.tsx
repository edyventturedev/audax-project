import type { Metadata } from "next";
import { getCategory, categories, servicesByCategory } from "@/data/services";
import { CategoryClient } from "@/components/site/CategoryClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Categoría no encontrada" };

  const description = `${category.tagline.es} Cotiza al instante y sigue tu proyecto con Audax Project en Mérida, Yucatán.`;

  return {
    title: `${category.name.es} en Mérida, Yucatán`,
    description,
    alternates: { canonical: `/servicios/${category.slug}` },
    openGraph: {
      title: `${category.name.es} — Audax Project`,
      description,
      url: `/servicios/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  return (
    <>
      {category && (
        <>
          <JsonLd
            data={breadcrumbSchema([
              { name: "Inicio", path: "/" },
              { name: "Servicios", path: "/servicios" },
              { name: category.name.es, path: `/servicios/${category.slug}` },
            ])}
          />
          <JsonLd data={itemListSchema(servicesByCategory(category.slug))} />
        </>
      )}
      <CategoryClient slug={slug} />
    </>
  );
}
