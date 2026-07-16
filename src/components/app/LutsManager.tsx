"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCentsMXN } from "@/lib/orders";
import { cn } from "@/lib/cn";

type LutRow = {
  id: string;
  slug: string;
  name_es: string;
  category: string;
  price: number;
  status: "draft" | "published";
  featured: boolean;
  downloads: number;
  file_path: string | null;
  updated_at: string;
};

const STATUS_META: Record<LutRow["status"], { label: string; cls: string }> = {
  draft: { label: "Borrador", cls: "bg-glass text-fg-muted" },
  published: { label: "Publicado", cls: "bg-success/15 text-success" },
};

export function LutsManager() {
  const supabase = createClient();
  const [luts, setLuts] = useState<LutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("luts")
      .select(
        "id, slug, name_es, category, price, status, featured, downloads, file_path, updated_at",
      )
      .order("updated_at", { ascending: false });
    setLuts((data as LutRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(lut: LutRow) {
    // Borra el archivo del bucket privado antes de eliminar el registro.
    if (lut.file_path) {
      await supabase.storage.from("lut-files").remove([lut.file_path]);
    }
    await supabase.from("luts").delete().eq("id", lut.id);
    setConfirmId(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            LUTs
          </h1>
          <p className="mt-2 text-fg-muted">
            Sube presets de color, ponles precio (o gratis) y publícalos en la tienda.
          </p>
        </div>
        <Link
          href="/admin/luts/new"
          className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
        >
          <Plus className="h-4 w-4" />
          Nuevo LUT
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
        </div>
      ) : luts.length === 0 ? (
        <p className="py-20 text-center text-fg-dim">
          Aún no hay LUTs. Sube el primero.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {luts.map((lut) => {
            const meta = STATUS_META[lut.status];
            const free = !lut.price || lut.price <= 0;
            return (
              <div
                key={lut.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-3 p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{lut.name_es}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        meta.cls,
                      )}
                    >
                      {meta.label}
                    </span>
                    {lut.featured && (
                      <span className="rounded-full bg-orange-soft px-2 py-0.5 text-xs font-medium text-orange">
                        Destacado
                      </span>
                    )}
                    {!lut.file_path && (
                      <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                        Sin archivo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-3 text-xs text-fg-dim">
                    <span>{lut.category}</span>
                    <span className="font-medium text-fg-muted">
                      {free ? "Gratis" : formatCentsMXN(lut.price)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {lut.downloads}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {lut.status === "published" && (
                    <Link
                      href={`/luts`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver
                    </Link>
                  )}
                  <Link
                    href={`/admin/luts/${lut.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Link>
                  {confirmId === lut.id ? (
                    <>
                      <button
                        onClick={() => remove(lut)}
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
                      onClick={() => setConfirmId(lut.id)}
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
