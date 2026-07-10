"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

type Post = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  status: "draft" | "scheduled" | "published";
  published_at: string | null;
  updated_at: string;
};

const STATUS_META: Record<Post["status"], { label: string; cls: string }> = {
  draft: { label: "Borrador", cls: "bg-glass text-fg-muted" },
  scheduled: { label: "Programado", cls: "bg-warning/15 text-warning" },
  published: { label: "Publicado", cls: "bg-success/15 text-success" },
};

export function BlogManager() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, slug, title, tag, status, published_at, updated_at")
      .order("updated_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    await supabase.from("blog_posts").delete().eq("id", id);
    setConfirmId(null);
    load();
  }

  function whenLabel(p: Post): string {
    if (!p.published_at) return "Sin fecha";
    const d = new Date(p.published_at);
    const future = d.getTime() > Date.now();
    return `${future ? "Se publica" : "Publicado"} ${d.toLocaleDateString(
      "es-MX",
      { day: "numeric", month: "short", year: "numeric" },
    )}`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            Blog
          </h1>
          <p className="mt-2 text-fg-muted">
            Crea, edita y programa artículos. Los programados se publican solos.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
        >
          <Plus className="h-4 w-4" />
          Nuevo artículo
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
        </div>
      ) : posts.length === 0 ? (
        <p className="py-20 text-center text-fg-dim">
          Aún no hay artículos. Crea el primero.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {posts.map((p) => {
            const meta = STATUS_META[p.status];
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-3 p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{p.title}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        meta.cls,
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-fg-dim">
                    {p.tag} · {whenLabel(p)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {p.status === "published" && (
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Link>
                  {confirmId === p.id ? (
                    <>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded-full bg-danger px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-danger/90"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
