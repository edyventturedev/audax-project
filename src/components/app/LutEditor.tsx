"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Upload, FileArchive, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/blogText";
import { formatCentsMXN } from "@/lib/orders";
import { Button } from "@/components/ui/Button";

type Status = "draft" | "published";

const COVERS_BUCKET = "lut-covers";
const FILES_BUCKET = "lut-files";

function extOf(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "cube";
}

export function LutEditor({ id }: { id?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contentLang, setContentLang] = useState<"es" | "en">("es");
  const [nameEs, setNameEs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descEs, setDescEs] = useState("");
  const [descEn, setDescEn] = useState("");
  const [category, setCategory] = useState("Cinematográfico");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [featured, setFeatured] = useState(false);

  const [free, setFree] = useState(true);
  const [pricePesos, setPricePesos] = useState("");

  const [coverImage, setCoverImage] = useState("");
  const [previewBefore, setPreviewBefore] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [format, setFormat] = useState("cube");

  const [uploading, setUploading] = useState<null | "cover" | "before" | "file">(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("luts").select("*").eq("id", id).maybeSingle();
      if (data) {
        setNameEs(data.name_es ?? "");
        setNameEn(data.name_en ?? "");
        setDescEs(data.desc_es ?? "");
        setDescEn(data.desc_en ?? "");
        setCategory(data.category ?? "General");
        setSlug(data.slug ?? "");
        setSlugTouched(true);
        setStatus(data.status ?? "draft");
        setFeatured(!!data.featured);
        const cents = data.price ?? 0;
        setFree(!cents);
        setPricePesos(cents ? String(cents / 100) : "");
        setCoverImage(data.cover_image ?? "");
        setPreviewBefore(data.preview_before ?? "");
        setFilePath(data.file_path ?? null);
        setFileName(data.file_name ?? null);
        setFormat(data.format ?? "cube");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Autogenera el slug desde el nombre mientras no lo edites manualmente.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEs));
  }, [nameEs, slugTouched]);

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>,
    which: "cover" | "before",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(which);
    setError(null);
    const path = `${which}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extOf(file.name)}`;
    const { error: upErr } = await supabase.storage
      .from(COVERS_BUCKET)
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError("No se pudo subir la imagen.");
    } else {
      const { data } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(path);
      if (which === "cover") setCoverImage(data.publicUrl);
      else setPreviewBefore(data.publicUrl);
    }
    setUploading(null);
    if (which === "cover" && coverRef.current) coverRef.current.value = "";
    if (which === "before" && beforeRef.current) beforeRef.current.value = "";
  }

  async function uploadLutFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("file");
    setError(null);
    const base = slugify(slug || nameEs) || "lut";
    const path = `${base}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from(FILES_BUCKET)
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError("No se pudo subir el archivo del LUT.");
    } else {
      // Reemplaza el archivo anterior si existía.
      if (filePath && filePath !== path) {
        await supabase.storage.from(FILES_BUCKET).remove([filePath]);
      }
      setFilePath(path);
      setFileName(file.name);
      setFormat(extOf(file.name));
    }
    setUploading(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function save() {
    setError(null);
    if (!nameEs.trim()) return setError("El nombre es obligatorio.");
    if (!slug.trim()) return setError("El slug es obligatorio.");

    const priceCents = free ? 0 : Math.round(Number(pricePesos) * 100);
    if (!free && (!Number.isFinite(priceCents) || priceCents <= 0)) {
      return setError("Escribe un precio válido o marca el LUT como gratis.");
    }
    if (status === "published" && !filePath) {
      return setError("Sube el archivo del LUT antes de publicarlo.");
    }

    const payload = {
      slug: slugify(slug),
      name_es: nameEs.trim(),
      name_en: nameEn.trim(),
      desc_es: descEs.trim(),
      desc_en: descEn.trim(),
      category: category.trim() || "General",
      price: priceCents,
      cover_image: coverImage.trim() || null,
      preview_before: previewBefore.trim() || null,
      file_path: filePath,
      file_name: fileName,
      format,
      featured,
      status,
    };

    setSaving(true);
    const res = isNew
      ? await supabase.from("luts").insert(payload)
      : await supabase.from("luts").update(payload).eq("id", id);
    setSaving(false);

    if (res.error) {
      setError(
        res.error.code === "23505"
          ? "Ya existe un LUT con ese slug."
          : "No se pudo guardar. Revisa los campos.",
      );
      return;
    }
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

  const bilingualName = contentLang === "es" ? nameEs : nameEn;
  const bilingualDesc = contentLang === "es" ? descEs : descEn;

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
          {isNew ? "Nuevo LUT" : "Editar LUT"}
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
          {contentLang === "en" && (
            <p className="text-xs text-fg-dim">
              Contenido en inglés (opcional). Si lo dejas vacío, se muestra el español.
            </p>
          )}

          <Field label={contentLang === "es" ? "Nombre" : "Name (EN)"}>
            <input
              value={bilingualName}
              onChange={(e) =>
                contentLang === "es" ? setNameEs(e.target.value) : setNameEn(e.target.value)
              }
              placeholder={contentLang === "es" ? "Ej. Teal & Orange Cinematic" : "e.g. Teal & Orange Cinematic"}
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          <Field label={contentLang === "es" ? "Descripción" : "Description (EN)"}>
            <textarea
              value={bilingualDesc}
              onChange={(e) =>
                contentLang === "es" ? setDescEs(e.target.value) : setDescEn(e.target.value)
              }
              rows={3}
              placeholder={
                contentLang === "es"
                  ? "Para qué sirve, en qué software funciona, qué look logra."
                  : "What it's for, which software it works with, the look it achieves."
              }
              className="w-full resize-none rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          {/* Archivo del LUT */}
          <Field label="Archivo del LUT (.cube, .3dl, .zip…)">
            {filePath && fileName ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-2 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileArchive className="h-4 w-4 shrink-0 text-orange" />
                  <span className="truncate text-sm">{fileName}</span>
                </div>
                <button
                  onClick={() => {
                    setFilePath(null);
                    setFileName(null);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-dim transition-colors hover:bg-glass hover:text-danger"
                  aria-label="Quitar archivo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  onChange={uploadLutFile}
                  className="hidden"
                  id="lut-file-upload"
                />
                <label
                  htmlFor="lut-file-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-glass"
                >
                  {uploading === "file" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Subir archivo
                </label>
                <p className="mt-1.5 text-xs text-fg-faint">
                  Se guarda en un bucket privado; solo quien lo descargue o compre recibe un
                  enlace temporal.
                </p>
              </>
            )}
          </Field>

          {/* Imágenes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUpload
              label="Portada (look «después»)"
              value={coverImage}
              busy={uploading === "cover"}
              inputRef={coverRef}
              inputId="lut-cover-upload"
              onChange={(e) => uploadImage(e, "cover")}
              onClear={() => setCoverImage("")}
            />
            <ImageUpload
              label="Antes (opcional, comparación)"
              value={previewBefore}
              busy={uploading === "before"}
              inputRef={beforeRef}
              inputId="lut-before-upload"
              onChange={(e) => uploadImage(e, "before")}
              onClear={() => setPreviewBefore("")}
            />
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
            <label className="flex items-center gap-2.5 text-sm text-fg-muted">
              <input
                type="checkbox"
                checked={free}
                onChange={(e) => setFree(e.target.checked)}
                className="h-4 w-4 accent-orange"
              />
              LUT gratis
            </label>
            {!free && (
              <Field label="Precio (MXN)">
                <input
                  type="number"
                  min={1}
                  value={pricePesos}
                  onChange={(e) => setPricePesos(e.target.value)}
                  placeholder="199"
                  className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
                />
                {pricePesos && Number(pricePesos) > 0 && (
                  <p className="mt-1.5 text-xs text-fg-faint">
                    Se cobra {formatCentsMXN(Math.round(Number(pricePesos) * 100))}.
                  </p>
                )}
              </Field>
            )}
          </div>

          <div className="border-t border-line pt-4">
            <Field label="Categoría">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Cinematográfico"
                className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
              />
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

function ImageUpload({
  label,
  value,
  busy,
  inputRef,
  inputId,
  onChange,
  onClear,
}: {
  label: string;
  value: string;
  busy: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <Field label={label}>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="aspect-[4/3] w-full object-cover" />
          <button
            onClick={onClear}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white transition-colors hover:bg-danger"
            aria-label="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onChange}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink-2 text-sm text-fg-dim transition-colors hover:border-orange hover:text-fg"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            Subir imagen
          </label>
        </>
      )}
    </Field>
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
