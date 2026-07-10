import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getPublishedPost } from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { Markdown } from "@/components/blog/Markdown";
import { AdSlot } from "@/components/blog/AdSlot";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return notFound();

  const dateIso = post.published_at ?? new Date().toISOString();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: dateIso,
    dateModified: dateIso,
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.cover_image ? { image: post.cover_image } : {}),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <article className="mx-auto max-w-[720px] px-6 pt-32 pb-20 sm:pt-40">
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Blog
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-fg-dim">
        <span className="rounded-full bg-orange-soft px-2.5 py-1 font-medium text-orange">
          {post.tag}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.read_min} min
        </span>
        {post.published_at && (
          <span>
            {new Date(post.published_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">
        {post.title}
      </h1>

      {post.cover_image && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-line">
          <Image
            src={post.cover_image}
            alt={post.title}
            width={1280}
            height={720}
            className="h-auto w-full object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Anuncio superior */}
      <AdSlot />

      <div className="mt-4">
        <Markdown content={post.body} />
      </div>

      {/* Anuncio al final del artículo */}
      <AdSlot />

      <div className="mt-12 rounded-3xl border border-line bg-ink-3 p-8 text-center">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
          ¿Listo para tu proyecto?
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          Elige un servicio, recibe tu cotización y sigue el avance en línea.
        </p>
        <Button href="/servicios" size="lg" className="mt-5">
          Ver servicios
        </Button>
      </div>
    </article>
  );
}
