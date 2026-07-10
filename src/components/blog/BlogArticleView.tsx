"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localizeBlog } from "@/lib/blogText";
import { Markdown } from "./Markdown";
import { AdSlot } from "./AdSlot";
import { Button } from "@/components/ui/Button";

export type ArticlePost = {
  slug: string;
  title: string;
  title_en: string | null;
  excerpt: string;
  excerpt_en: string | null;
  tag: string;
  tag_en: string | null;
  body: string;
  body_en: string | null;
  cover_image: string | null;
  read_min: number;
  published_at: string | null;
};

export function BlogArticleView({ post }: { post: ArticlePost }) {
  const { lang } = useLanguage();
  const es = lang === "es";
  const l = localizeBlog(post, lang);

  return (
    <article className="mx-auto max-w-[760px] px-6 pt-32 pb-20 sm:pt-40">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Blog
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-fg-dim">
        <span className="rounded-full bg-orange-soft px-2.5 py-1 font-medium text-orange">
          {l.tag}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.read_min} min
        </span>
        {post.published_at && (
          <span>
            {new Date(post.published_at).toLocaleDateString(
              es ? "es-MX" : "en-US",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-5xl">
        {l.title}
      </h1>
      <p className="mt-4 text-lg text-fg-muted">{l.excerpt}</p>

      {post.cover_image && (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-line">
          <div className="aspect-[16/9] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={l.title}
              className="h-full w-full object-cover grayscale"
            />
          </div>
        </div>
      )}

      <AdSlot />

      <div className="mt-6 text-[1.05rem]">
        <Markdown content={l.body} />
      </div>

      <AdSlot />

      <div className="mt-14 overflow-hidden rounded-[2rem] border border-orange/25 bg-gradient-to-br from-orange/15 via-ink-3 to-ink-3 p-8 text-center sm:p-10">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          {es ? "¿Listo para tu proyecto?" : "Ready for your project?"}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          {es
            ? "Elige un servicio, recibe tu cotización y sigue el avance en línea."
            : "Pick a service, get your quote and track progress online."}
        </p>
        <Button href="/servicios" size="lg" className="mt-5">
          {es ? "Ver servicios" : "See services"}
        </Button>
      </div>
    </article>
  );
}
