import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { BlogIndexView } from "@/components/blog/BlogIndexView";

export const metadata: Metadata = {
  title: "Blog — Ideas, guías y novedades",
  description:
    "Guías prácticas sobre desarrollo web, diseño, marca y marketing para negocios en México. Aprende a hacer crecer tu presencia digital con Audax Project.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Audax Project",
    description:
      "Guías prácticas de desarrollo web, diseño y marketing para negocios en México.",
    url: "/blog",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogIndexView posts={posts} />
    </>
  );
}
