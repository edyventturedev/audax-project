import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, Plus, Pin, Lock } from "lucide-react";
import { getForumCategory, FORUM_CATEGORY_SLUGS } from "@/data/forum";
import { getThreads } from "@/lib/forum";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getForumCategory(category);
  if (!cat) return { title: "Categoría no encontrada" };
  return {
    title: `${cat.label} — Foro`,
    description: cat.desc,
    alternates: { canonical: `/foro/${cat.slug}` },
  };
}

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!FORUM_CATEGORY_SLUGS.includes(category)) return notFound();
  const cat = getForumCategory(category)!;
  const threads = await getThreads(category);

  return (
    <div className="mx-auto max-w-[900px] px-6 pt-32 pb-16 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Foro", path: "/foro" },
          { name: cat.label, path: `/foro/${cat.slug}` },
        ])}
      />

      <Link
        href="/foro"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Foro
      </Link>

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
            {cat.label}
          </h1>
          <p className="mt-2 text-fg-muted">{cat.desc}</p>
        </div>
        <Link
          href={`/foro/nuevo?cat=${cat.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
        >
          <Plus className="h-4 w-4" />
          Nuevo tema
        </Link>
      </header>

      {threads.length === 0 ? (
        <p className="mt-12 rounded-3xl border border-dashed border-line bg-ink-3/50 p-10 text-center text-sm text-fg-dim">
          Sé el primero en abrir un tema en esta categoría.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-ink-3">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/foro/hilo/${t.id}`}
              className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-glass"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {t.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-orange" />}
                  {t.locked && <Lock className="h-3.5 w-3.5 shrink-0 text-fg-faint" />}
                  <h2 className="truncate font-medium">{t.title}</h2>
                </div>
                <p className="mt-0.5 text-xs text-fg-dim">
                  {t.author_name} ·{" "}
                  {new Date(t.last_activity_at).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-fg-dim">
                <MessageSquare className="h-3.5 w-3.5" />
                {t.reply_count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
