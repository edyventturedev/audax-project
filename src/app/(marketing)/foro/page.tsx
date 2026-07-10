import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Plus, Clock } from "lucide-react";
import { FORUM_CATEGORIES } from "@/data/forum";
import { getCategoryCounts, getRecentThreads } from "@/lib/forum";
import { NavIcon } from "@/components/site/navIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Foro de la comunidad",
  description:
    "Comunidad de Audax: comparte y resuelve dudas sobre negocios, desarrollo web, diseño, marca y marketing. Solo temas del rubro, en un espacio seguro.",
  alternates: { canonical: "/foro" },
  openGraph: {
    title: "Foro — Audax Project",
    description:
      "Comparte y resuelve dudas sobre desarrollo web, diseño, marca y marketing.",
    url: "/foro",
    type: "website",
  },
};

export default async function ForumIndexPage() {
  const [counts, recent] = await Promise.all([
    getCategoryCounts(),
    getRecentThreads(6),
  ]);

  return (
    <div className="mx-auto max-w-[1000px] px-6 pt-32 pb-16 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Foro", path: "/foro" },
        ])}
      />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-orange" />
            <span className="text-xs font-semibold uppercase tracking-wider text-orange">
              Comunidad
            </span>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
            Foro
          </h1>
          <p className="mt-4 text-fg-muted">
            Comparte experiencias y resuelve dudas sobre negocios, desarrollo
            web, diseño y marketing. Un espacio seguro y siempre del rubro.
          </p>
        </div>
        <Link
          href="/foro/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
        >
          <Plus className="h-4 w-4" />
          Nuevo tema
        </Link>
      </header>

      {/* Categorías */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FORUM_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/foro/${c.slug}`}
            className="group flex items-start gap-4 rounded-3xl border border-line bg-ink-3 p-6 transition-colors hover:border-line-strong"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange">
              <NavIcon name={c.icon} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold">{c.label}</h2>
              <p className="mt-1 text-sm text-fg-muted">{c.desc}</p>
              <p className="mt-2 text-xs text-fg-faint">
                {counts[c.slug] ?? 0} tema{(counts[c.slug] ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recientes */}
      {recent.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
            Conversaciones recientes
          </h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-ink-3">
            {recent.map((t) => (
              <Link
                key={t.id}
                href={`/foro/hilo/${t.id}`}
                className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-glass"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{t.title}</h3>
                  <p className="mt-0.5 text-xs text-fg-dim">
                    {t.author_name} ·{" "}
                    {new Date(t.last_activity_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
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
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-line bg-ink-3/50 p-10 text-center">
          <Clock className="h-6 w-6 text-fg-faint" />
          <p className="mt-3 text-sm text-fg-dim">
            Aún no hay conversaciones. ¡Abre el primer tema!
          </p>
        </div>
      )}
    </div>
  );
}
