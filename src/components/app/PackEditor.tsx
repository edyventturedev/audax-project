"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Upload, X, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/blogText";
import { formatCentsMXN } from "@/lib/orders";
import { Button } from "@/components/ui/Button";

type Status = "draft" | "published";
const COVERS_BUCKET = "lut-covers";

type LutOption = {
  id: string;
  name_es: string;
  price: number;
  status: "draft" | "published";
  cover_image: string | null;
};

function extOf(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "jpg";
}

export function PackEditor({ id }: { id?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contentLang, setContentLang] = useState<"es" | "en">("es");
  const [nameEs, setNameEs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descEs, setDescEs] = useState("");
  const [descEn, setDescEn] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [featured, setFeatured] = useState(false);
  const [free, setFree] = useState(false);
  const [pricePesos, setPricePesos] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const [allLuts, setAllLuts] = useState<LutOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]); // lut ids, en orden

  useEffect(() => {
    (async () => {
      const { data: luts } = await supabase
        .from("luts")
        .select("id, name_es, price, status, cover_image")
        .order("created_at", { ascending: false });
      setAllLuts((luts as LutOption[]) ?? []);

      if (!isNew) {
        const { data: pack } = await supabase
          .from("lut_packs")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (pack) {
          setNameEs(pack.name_es ?? "");
          setNameEn(pack.name_en ?? "");
          setDescEs(pack.desc_es ?? "");
          setDescEn(pack.desc_en ?? "");
          setSlug(pack.slug ?? "");
          setSlugTouched(true);
          setStatus(pack.status ?? "draft");
          setFeatured(!!pack.featured);
          const cents = pack.price ?? 0;
          setFree(!cents);
          setPricePesos(cents ? String(cents / 100) : "");
          setCoverImage(pack.cover_image ?? "");
        }
        const { data: items } = await supabase
          .from("lut_pack_items")
          .select("lut_id, position")
          .eq("pack_id", id)
          .order("position", { ascending: true });
        setSelected((items ?? []).map((it: { lut_id: string }) => it.lut_id));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEs));
  }, [nameEs, slugTouched]);

  function toggle(lutId: string) {
    setSelected((prev) =>
      prev.includes(lutId) ? prev.filter((x) => x !== lutId) : [...prev, lutId],
    );
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const path = `pack-cover/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extOf(file.name)}`;
    const { error: upErr } = await supabase.storage
      .from(COVERS_BUCKET)
      .upload(path, file, { upsert: true });
    if (upErr) setError("No se pudo subir la imagen.");
    else setCoverImage(supabase.storage.from(COVERS_BUCKET).getPublicUrl(path).data.publicUrl);
    setUploading(false);
    if (coverRef.current) coverRef.current.value = "";
  }

  const itemsValue = allLuts
    .filter((l) => selected.includes(l.id))
    .reduce((s, l) => s + (l.price || 0), 0);
  const priceCents = free ? 0 : Math.round(Number(pricePesos) * 100);
  const savings = itemsValue - priceCents;

  async function save() {
    setError(null);
    if (!nameEs.trim()) return setError("El nombre es obligatorio.");
    if (!slug.trim()) return setError("El slug es obligatorio.");
    if (selected.length < 1) return setError("Agrega al menos un LUT al paquete.");
    if (!free && (!Number.isFinite(priceCents) || priceCents <= 0)) {
      return setError("Escribe un precio válido o marca el paquete como gratis.");
    }

    const payload = {
      slug: slugify(slug),
      name_es: nameEs.trim(),
      name_en: nameEn.trim(),
      desc_es: descEs.trim(),
      desc_en: descEn.trim(),
      price: priceCents,
      cover_image: coverImage.trim() || null,
      featured,
      status,
    };

    setSaving(true);
    let packId = id;
    if (isNew) {
      const { data, error: insErr } = await supabase
        .from("lut_packs")
        .insert(payload)
        .select("id")
        .single();
      if (insErr || !data) {
        setSaving(false);
        setError(
          insErr?.code === "23505"
            ? "Ya existe un paquete con ese slug."
            : "No se pudo guardar.",
        );
        return;
      }
      packId = data.id;
    } else {
      const { error: upErr } = await supabase
        .from("lut_packs")
        .update(payload)
        .eq("id", id);
      if (upErr) {
        setSaving(false);
        setError(
          upErr.code === "23505"
            ? "Ya existe un paquete con ese slug."
            : "No se pudo guardar.",
        );
        return;
      }
    }

    // Reemplazar los LUTs del paquete.
    await supabase.from("lut_pack_items").delete().eq("pack_id", packId);
    await supabase.from("lut_pack_items").insert(
      selected.map((lutId, i) => ({ pack_id: packId, lut_id: lutId, position: i })),
    );

    setSaving(false);
    router.push("/admin/luts");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/luts"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        LUTs
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
          {isNew ? "Nuevo paquete" : "Editar paquete"}
        </h1>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Columna principal */}
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-line bg-ink-2 p-1">
            {(["es", "en"] as const).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setContentLang(lng)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  contentLang === lng ? "bg-orange text-white" : "text-fg-muted hover:text-fg"
                }`}
              >
                {lng === "es" ? "Español" : "English"}
              </button>
            ))}
          </div>

          <Field label={contentLang === "es" ? "Nombre del paquete" : "Pack name (EN)"}>
            <input
              value={contentLang === "es" ? nameEs : nameEn}
              onChange={(e) =>
                contentLang === "es" ? setNameEs(e.target.value) : setNameEn(e.target.value)
              }
              placeholder={contentLang === "es" ? "Ej. Pack Cinematográfico (8 LUTs)" : "e.g. Cinematic Pack (8 LUTs)"}
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          <Field label={contentLang === "es" ? "Descripción" : "Description (EN)"}>
            <textarea
              value={contentLang === "es" ? descEs : descEn}
              onChange={(e) =>
                contentLang === "es" ? setDescEs(e.target.value) : setDescEn(e.target.value)
              }
              rows={3}
              placeholder={
                contentLang === "es"
                  ? "Qué incluye el paquete y para qué tipo de contenido es ideal."
                  : "What the pack includes and what content it's ideal for."
              }
              className="w-full resize-none rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          {/* Selección de LUTs */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-medium text-fg-dim">
                LUTs en el paquete
              </label>
              <span className="text-xs text-fg-faint">
                {selected.length} seleccionado{selected.length === 1 ? "" : "s"}
              </span>
            </div>
            {allLuts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line bg-ink-2 p-4 text-sm text-fg-dim">
                Primero crea algunos LUTs para poder agruparlos.
              </p>
            ) : (
              <div className="max-h-[340px] space-y-2 overflow-y-auto rounded-2xl border border-line bg-ink-2 p-2">
                {allLuts.map((l) => {
                  const on = selected.includes(l.id);
                  const isFree = !l.price || l.price <= 0;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => toggle(l.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                        on ? "border-orange bg-orange-soft" : "border-line hover:border-line-strong"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          on ? "border-orange bg-orange text-white" : "border-line"
                        }`}
                      >
                        {on && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="h-9 w-12 shrink-0 overflow-hidden rounded-md bg-ink-3">
                        {l.cover_image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.cover_image} alt="" className="h-full w-full object-cover" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{l.name_es}</span>
                        <span className="text-xs text-fg-dim">
                          {isFree ? "Gratis" : formatCentsMXN(l.price)}
                          {l.status === "draft" && " · borrador"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Barra lateral */}
        <div className="space-y-4 rounded-3xl border border-line bg-ink-3 p-5">
          <Field label="Estado">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            >
              <option value="draft">Borrador (no visible)</option>
              <option value="published">Publicado</option>
            </select>
          </Field>

          <label className="flex items-center gap-2.5 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-orange"
            />
            Destacado (aparece primero)
          </label>

          <div className="border-t border-line pt-4">
            <label className="mb-1.5 block text-xs font-medium text-fg-dim">Precio</label>
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-ink-2 p-1">
              <button
                type="button"
                onClick={() => setFree(true)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  free ? "bg-success text-white" : "text-fg-muted hover:text-fg"
                }`}
              >
                Gratis
              </button>
              <button
                type="button"
                onClick={() => setFree(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  !free ? "bg-orange text-white" : "text-fg-muted hover:text-fg"
                }`}
              >
                De pago
              </button>
            </div>
            {!free && (
              <div className="mt-3">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint">
                    $
                  </span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={pricePesos}
                    onChange={(e) => setPricePesos(e.target.value)}
                    placeholder="399"
                    className="w-full rounded-xl border border-line bg-ink-2 py-2.5 pl-7 pr-14 text-sm outline-none focus:border-orange"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fg-faint">
                    MXN
                  </span>
                </div>
                {itemsValue > 0 && (
                  <p className="mt-1.5 text-xs text-fg-faint">
                    Valor individual: {formatCentsMXN(itemsValue)}.
                    {savings > 0 && priceCents > 0 && (
                      <span className="text-success">
                        {" "}
                        Ahorro {formatCentsMXN(savings)} (
                        {Math.round((savings / itemsValue) * 100)}%).
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-line pt-4">
            <Field label="Portada">
              {coverImage ? (
                <div className="relative overflow-hidden rounded-xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Portada" className="aspect-[4/3] w-full object-cover" />
                  <button
                    onClick={() => setCoverImage("")}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white transition-colors hover:bg-danger"
                    aria-label="Quitar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    ref={coverRef}
                    type="file"
                    accept="image/*"
                    onChange={uploadCover}
                    className="hidden"
                    id="pack-cover-upload"
                  />
                  <label
                    htmlFor="pack-cover-upload"
                    className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink-2 text-sm text-fg-dim transition-colors hover:border-orange hover:text-fg"
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5" />
                    )}
                    Subir imagen
                  </label>
                </>
              )}
            </Field>

            <div className="mt-4">
              <Field label="Slug (URL)">
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 font-mono text-xs outline-none focus:border-orange"
                />
                <p className="mt-1.5 truncate text-xs text-fg-faint">
                  /luts · {slugify(slug) || "…"}
                </p>
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-fg-dim">{label}</label>
      {children}
    </div>
  );
}
