import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { blogPosts, getPost } from "@/data/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
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
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
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
          {post.readMin} min
        </span>
        <span>
          {new Date(post.date).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-8 flex flex-col gap-5 leading-relaxed text-fg-muted">
        {post.body.map((block, i) => {
          if (block.h)
            return (
              <h2
                key={i}
                className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-fg"
              >
                {block.h}
              </h2>
            );
          if (block.list)
            return (
              <ul key={i} className="flex flex-col gap-2 pl-1">
                {block.list.map((li, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            );
          return (
            <p key={i} className="text-[1.02rem]">
              {block.p}
            </p>
          );
        })}
      </div>

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
