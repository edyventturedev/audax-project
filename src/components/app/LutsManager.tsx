"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Download,
  Layers,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCentsMXN } from "@/lib/orders";
import { cn } from "@/lib/cn";

type Tab = "luts" | "packs";

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

type PackRow = {
  id: string;
  slug: string;
  name_es: string;
  price: number;
  status: "draft" | "published";
  featured: boolean;
  downloads: number;
  updated_at: string;
  lut_pack_items: { count: number }[];
};

const STATUS_META = {
  draft: { label: "Borrador", cls: "bg-glass text-fg-muted" },
  published: { label: "Publicado", cls: "bg-success/15 text-success" },
} as const;

function StatusChip({ status }: { status: "draft" | "published" }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", m.cls)}>
      {m.label}
    </span>
  );
}

export function LutsManager() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("luts");
  const [luts, setLuts] = useState<LutRow[]>([]);
  const [packs, setPacks] = useState<PackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function load() {
    const [{ data: l }, { data: p }] = await Promise.all([
      supabase
        .from("luts")
        .select(
          "id, slug, name_es, category, price, status, featured, downloads, file_path, updated_at",
        )
        .order("updated_at", { ascending: false }),
      supabase
        .from("lut_packs")
        .select(
          "id, slug, name_es, price, status, featured, downloads, updated_at, lut_pack_items(count)",
        )
        .order("updated_at", { ascending: false }),
    ]);
    setLuts((l as LutRow[]) ?? []);
    setPacks((p as PackRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function removeLut(lut: LutRow) {
    if (lut.file_path) {
      await supabase.storage.from("lut-files").remove([lut.file_path]);
    }
    await supabase.from("luts").delete().eq("id", lut.id);
    setConfirmId(null);
    load();
  }

  async function removePack(pack: PackRow) {
    await supabase.from("lut_packs").delete().eq("id", pack.id);
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
            Sube presets de color, arma paquetes y véndelos (o regálalos) en la tienda.
          </p>
        </div>
        {tab === "luts" ? (
          <Link
            href="/admin/luts/new"
            className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
          >
            <Plus className="h-4 w-4" />
            Nuevo LUT
          </Link>
        ) : (
          <Link
            href="/admin/luts/packs/new"
            className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
          >
            <Plus className="h-4 w-4" />
            Nuevo paquete
          </Link>
        )}
      </div>

      {/* Pestañas */}
      <div className="mt-6 inline-flex rounded-full border border-line bg-ink-2 p-1">
        {(
          [
            ["luts", "LUTs"],
            ["packs", "Paquetes"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setConfirmId(null);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === key ? "bg-orange text-white" : "text-fg-muted hover:text-fg",
            )}
          >
            {label}
            <span className="ml-1.5 opacity-70">
              {key === "luts" ? luts.length : packs.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
        </div>
      ) : tab === "luts" ? (
        luts.length === 0 ? (
          <p className="py-20 text-center text-fg-dim">Aún no hay LUTs. Sube el primero.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {luts.map((lut) => {
              const free = !lut.price || lut.price <= 0;
              return (
                <div
                  key={lut.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-3 p-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{lut.name_es}</h3>
                      <StatusChip status={lut.status} />
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
                        href="/luts"
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
                          onClick={() => removeLut(lut)}
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
        )
      ) : packs.length === 0 ? (
        <div className="py-20 text-center">
          <Layers className="mx-auto h-8 w-8 text-fg-faint" />
          <p className="mt-3 text-fg-dim">
            Aún no hay paquetes. Agrupa varios LUTs y ponles un precio de paquete.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {packs.map((pack) => {
            const free = !pack.price || pack.price <= 0;
            const count = pack.lut_pack_items?.[0]?.count ?? 0;
            return (
              <div
                key={pack.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-3 p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Layers className="h-4 w-4 shrink-0 text-orange" />
                    <h3 className="truncate font-semibold">{pack.name_es}</h3>
                    <StatusChip status={pack.status} />
                    {pack.featured && (
                      <span className="rounded-full bg-orange-soft px-2 py-0.5 text-xs font-medium text-orange">
                        Destacado
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-3 text-xs text-fg-dim">
                    <span>
                      {count} LUT{count === 1 ? "" : "s"}
                    </span>
                    <span className="font-medium text-fg-muted">
                      {free ? "Gratis" : formatCentsMXN(pack.price)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {pack.downloads}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pack.status === "published" && (
                    <Link
                      href="/luts"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver
                    </Link>
                  )}
                  <Link
                    href={`/admin/luts/packs/${pack.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Link>
                  {confirmId === pack.id ? (
                    <>
                      <button
                        onClick={() => removePack(pack)}
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
                      onClick={() => setConfirmId(pack.id)}
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
