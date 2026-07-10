"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localizeBlog } from "@/lib/blogText";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AdSlot } from "./AdSlot";

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  excerpt: string;
  excerpt_en: string | null;
  tag: string;
  tag_en: string | null;
  cover_image: string | null;
  read_min: number;
  published_at: string | null;
};

function fmtDate(iso: string | null, lang: "es" | "en") {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Cover({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return <div className="h-full w-full bg-gradient-to-br from-ink-2 to-ink-3" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
    />
  );
}

export function BlogIndexView({ posts }: { posts: BlogListItem[] }) {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-[1080px] px-6 pt-32 pb-20 sm:pt-40">
      <Reveal>
        <header className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-orange" />
            <span className="text-xs font-semibold uppercase tracking-wider text-orange">
              Blog
            </span>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            {es ? "Ideas que hacen crecer tu negocio" : "Ideas that grow your business"}
          </h1>
          <p className="mt-4 text-lg text-fg-muted">
            {es
              ? "Guías prácticas de desarrollo web, diseño y marketing — sin relleno."
              : "Practical guides on web development, design and marketing — no fluff."}
          </p>
        </header>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-16 text-fg-dim">
          {es ? "Pronto publicaremos nuevos artículos." : "New articles coming soon."}
        </p>
      ) : (
        <>
          {/* Destacado */}
          {featured && (
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative mt-12 block overflow-hidden rounded-[2rem] border border-line"
              >
                <div className="aspect-[16/10] w-full sm:aspect-[21/9]">
                  <Cover src={featured.cover_image} alt={localizeBlog(featured, lang).title} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <div className="flex items-center gap-3 text-xs text-white/80">
                    <span className="rounded-full bg-orange px-2.5 py-1 font-semibold text-white">
                      {localizeBlog(featured, lang).tag}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.read_min} min
                    </span>
                  </div>
                  <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-4xl">
                    {localizeBlog(featured, lang).title}
                  </h2>
                  <p className="mt-2 hidden max-w-xl text-white/80 sm:block">
                    {localizeBlog(featured, lang).excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    {es ? "Leer artículo" : "Read article"}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Rejilla */}
          <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2">
            {rest.map((post, idx) => {
              const l = localizeBlog(post, lang);
              return (
                <RevealItem key={post.slug}>
                  <div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-3 transition-colors hover:border-line-strong"
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden">
                        <Cover src={post.cover_image} alt={l.title} />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-3 text-xs text-fg-dim">
                          <span className="rounded-full bg-orange-soft px-2.5 py-1 font-medium text-orange">
                            {l.tag}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.read_min} min
                          </span>
                        </div>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-snug tracking-tight text-balance">
                          {l.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                          {l.excerpt}
                        </p>
                        <span className="mt-4 flex items-center justify-between pt-2 text-xs text-fg-faint">
                          {fmtDate(post.published_at, lang)}
                          <ArrowUpRight className="h-4 w-4 text-orange transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                    {idx % 4 === 3 && <AdSlot />}
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </>
      )}
    </div>
  );
}
