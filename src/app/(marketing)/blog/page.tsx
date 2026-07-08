import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

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

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-[900px] px-6 pt-32 pb-16 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-orange" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange">
            Blog
          </span>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ideas, guías y novedades
        </h1>
        <p className="mt-4 text-fg-muted">
          Consejos prácticos de desarrollo web, diseño y marketing para hacer
          crecer tu negocio en línea.
        </p>
      </header>

      <div className="mt-12 grid gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-3xl border border-line bg-ink-3 p-6 transition-colors hover:border-line-strong sm:p-8"
          >
            <div className="flex items-center gap-3 text-xs text-fg-dim">
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
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-balance">
              {post.title}
            </h2>
            <p className="mt-2 text-fg-muted">{post.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-orange">
              Leer artículo
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
