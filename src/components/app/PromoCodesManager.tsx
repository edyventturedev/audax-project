"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Tag, Power } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type PromoCode = {
  id: string;
  code: string;
  percent_off: number;
  description: string | null;
  active: boolean;
  max_redemptions: number | null;
  times_redeemed: number;
  created_at: string;
};

export function PromoCodesManager() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario de creación
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("20");
  const [description, setDescription] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");

  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("promo_codes")
      .select(
        "id, code, percent_off, description, active, max_redemptions, times_redeemed, created_at",
      )
      .order("created_at", { ascending: false });
    setCodes((data as PromoCode[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create() {
    setError(null);
    const clean = code.trim().toUpperCase().replace(/\s/g, "");
    const pct = parseInt(percent, 10);
    if (!clean) return setError("Escribe un código.");
    if (!pct || pct <= 0 || pct > 100)
      return setError("El porcentaje debe estar entre 1 y 100.");

    setSaving(true);
    const { error: e } = await supabase.from("promo_codes").insert({
      code: clean,
      percent_off: pct,
      description: description.trim() || null,
      max_redemptions: maxRedemptions.trim()
        ? parseInt(maxRedemptions, 10)
        : null,
    });
    setSaving(false);
    if (e) {
      setError(
        e.code === "23505"
          ? "Ese código ya existe."
          : "No se pudo crear el código.",
      );
      return;
    }
    setCode("");
    setDescription("");
    setMaxRedemptions("");
    setPercent("20");
    load();
  }

  async function toggleActive(c: PromoCode) {
    await supabase
      .from("promo_codes")
      .update({ active: !c.active })
      .eq("id", c.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("promo_codes").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
          Códigos de descuento
        </h1>
        <p className="mt-2 text-fg-muted">
          Crea códigos para campañas con creadores. Aplican desde la segunda
          compra (la primera ya lleva el 15% de bienvenida).
        </p>
      </div>

      {/* Crear */}
      <div className="mt-6 rounded-3xl border border-line bg-ink-3 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          Nuevo código
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs text-fg-dim">Código</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CREADOR20"
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm uppercase tracking-wide outline-none focus:border-orange"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-fg-dim">Descuento %</label>
            <input
              type="number"
              min={1}
              max={100}
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-fg-dim">
              Descripción (opcional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Campaña con @creador"
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-fg-dim">
              Límite de usos (opcional)
            </label>
            <input
              type="number"
              min={1}
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              placeholder="Ilimitado"
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <Button onClick={create} disabled={saving} className="mt-4">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Crear código
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
        </div>
      ) : codes.length === 0 ? (
        <p className="py-16 text-center text-fg-dim">Aún no hay códigos.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {codes.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-3 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-soft text-orange">
                  <Tag className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold tracking-wide">
                      {c.code}
                    </span>
                    <span className="rounded-full bg-glass px-2 py-0.5 text-xs font-semibold text-orange">
                      −{c.percent_off}%
                    </span>
                    {!c.active && (
                      <span className="rounded-full bg-danger/15 px-2 py-0.5 text-xs font-medium text-danger">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-fg-dim">
                    {c.description ? `${c.description} · ` : ""}
                    {c.times_redeemed} uso{c.times_redeemed === 1 ? "" : "s"}
                    {c.max_redemptions != null && ` / ${c.max_redemptions}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(c)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    c.active
                      ? "border-line text-fg-muted hover:text-fg"
                      : "border-orange/50 text-orange hover:bg-orange-soft",
                  )}
                >
                  <Power className="h-3.5 w-3.5" />
                  {c.active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
