"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Eye, Pencil, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify, estimateReadMin } from "@/lib/blogText";
import { Markdown } from "@/components/blog/Markdown";
import { Button } from "@/components/ui/Button";

type Status = "draft" | "scheduled" | "published";

// Convierte un ISO a valor de <input type="datetime-local"> (hora local).
function isoToLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function BlogEditor({ id }: { id?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [tag, setTag] = useState("General");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [publishedAt, setPublishedAt] = useState("");

  // Contenido en inglés + idioma que se está editando.
  const [contentLang, setContentLang] = useState<"es" | "en">("es");
  const [titleEn, setTitleEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [tagEn, setTagEn] = useState("");

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setSlugTouched(true);
        setTag(data.tag);
        setExcerpt(data.excerpt ?? "");
        setCoverImage(data.cover_image ?? "");
        setBody(data.body ?? "");
        setTitleEn(data.title_en ?? "");
        setExcerptEn(data.excerpt_en ?? "");
        setBodyEn(data.body_en ?? "");
        setTagEn(data.tag_en ?? "");
        setStatus(data.status);
        setPublishedAt(isoToLocalInput(data.published_at));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Autogenera el slug desde el título mientras no lo edites manualmente.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function save() {
    setError(null);
    if (!title.trim()) return setError("El título es obligatorio.");
    if (!slug.trim()) return setError("El slug es obligatorio.");

    // Resolver published_at según el estado.
    let published: string | null = publishedAt
      ? new Date(publishedAt).toISOString()
      : null;
    if (status === "published" && !published) published = new Date().toISOString();
    if (status === "scheduled" && !published) {
      return setError("Para programar, elige fecha y hora de publicación.");
    }

    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      tag: tag.trim() || "General",
      excerpt: excerpt.trim(),
      cover_image: coverImage.trim() || null,
      body,
      title_en: titleEn.trim() || null,
      excerpt_en: excerptEn.trim() || null,
      body_en: bodyEn.trim() || null,
      tag_en: tagEn.trim() || null,
      read_min: estimateReadMin(body),
      status,
      published_at: published,
    };

    setSaving(true);
    const res = isNew
      ? await supabase.from("blog_posts").insert(payload)
      : await supabase.from("blog_posts").update(payload).eq("id", id);
    setSaving(false);

    if (res.error) {
      setError(
        res.error.code === "23505"
          ? "Ya existe un post con ese slug."
          : "No se pudo guardar. Revisa los campos.",
      );
      return;
    }
    router.push("/admin/blog");
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
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Blog
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
          {isNew ? "Nuevo artículo" : "Editar artículo"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            {preview ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Editar" : "Vista previa"}
          </button>
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Columna principal */}
        <div className="space-y-4">
          {/* Selector de idioma del contenido */}
          <div className="inline-flex rounded-full border border-line bg-ink-2 p-1">
            {(["es", "en"] as const).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setContentLang(lng)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  contentLang === lng
                    ? "bg-orange text-white"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {lng === "es" ? "Español" : "English"}
              </button>
            ))}
          </div>
          {contentLang === "en" && (
            <p className="text-xs text-fg-dim">
              Contenido en inglés (opcional). Si lo dejas vacío, se muestra el
              español a los usuarios en inglés.
            </p>
          )}

          <Field label={contentLang === "es" ? "Título" : "Title (EN)"}>
            <input
              value={contentLang === "es" ? title : titleEn}
              onChange={(e) =>
                contentLang === "es"
                  ? setTitle(e.target.value)
                  : setTitleEn(e.target.value)
              }
              placeholder={contentLang === "es" ? "Título del artículo" : "Article title"}
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          <Field
            label={
              contentLang === "es"
                ? "Extracto (resumen para tarjetas y SEO)"
                : "Excerpt (EN)"
            }
          >
            <textarea
              value={contentLang === "es" ? excerpt : excerptEn}
              onChange={(e) =>
                contentLang === "es"
                  ? setExcerpt(e.target.value)
                  : setExcerptEn(e.target.value)
              }
              rows={2}
              placeholder={
                contentLang === "es"
                  ? "Una o dos frases que resuman el artículo."
                  : "One or two sentences summarizing the article."
              }
              className="w-full resize-none rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          <Field
            label={`${
              contentLang === "es" ? "Contenido" : "Content (EN)"
            } (Markdown: ## título, - lista, **negrita**, [texto](url))`}
          >
            {preview ? (
              <div className="min-h-[300px] rounded-xl border border-line bg-ink-3 p-5">
                <Markdown content={contentLang === "es" ? body : bodyEn} />
              </div>
            ) : (
              <textarea
                value={contentLang === "es" ? body : bodyEn}
                onChange={(e) =>
                  contentLang === "es"
                    ? setBody(e.target.value)
                    : setBodyEn(e.target.value)
                }
                rows={20}
                placeholder={"Escribe aquí…\n\n## Un subtítulo\n\nUn párrafo.\n\n- Punto uno\n- Punto dos"}
                className="w-full rounded-xl border border-line bg-ink-2 p-3 font-mono text-sm leading-relaxed outline-none focus:border-orange"
              />
            )}
          </Field>
        </div>

        {/* Barra lateral: publicación */}
        <div className="space-y-4 rounded-3xl border border-line bg-ink-3 p-5">
          <Field label="Estado">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            >
              <option value="draft">Borrador (no visible)</option>
              <option value="scheduled">Programado</option>
              <option value="published">Publicado</option>
            </select>
          </Field>

          {status !== "draft" && (
            <Field
              label={
                status === "scheduled"
                  ? "Publicar el…"
                  : "Fecha de publicación"
              }
            >
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
              />
              {status === "scheduled" && (
                <p className="mt-1.5 text-xs text-fg-dim">
                  El artículo se hará visible solo, en esa fecha.
                </p>
              )}
            </Field>
          )}

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
              /blog/{slugify(slug) || "…"}
            </p>
          </Field>

          <Field label="Etiqueta">
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Desarrollo web"
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          <Field label="Etiqueta (EN, opcional)">
            <input
              value={tagEn}
              onChange={(e) => setTagEn(e.target.value)}
              placeholder="Web development"
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </Field>

          <Field label="Imagen de portada (URL, opcional)">
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-xs outline-none focus:border-orange"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-fg-dim">
        {label}
      </label>
      {children}
    </div>
  );
}
