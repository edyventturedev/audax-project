"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Download, FileArchive, Loader2, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";

type Deliverable = {
  id: string;
  file_path: string;
  file_name: string;
  size_bytes: number | null;
};

export function DeliverablesPanel({
  orderId,
  canUpload = false,
}: {
  orderId: string;
  canUpload?: boolean;
}) {
  const { lang } = useLanguage();
  const [items, setItems] = useState<Deliverable[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const es = lang === "es";

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("deliverables")
      .select("id, file_path, file_name, size_bytes")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setItems((data as Deliverable[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `${orderId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("deliverables")
      .upload(path, file);
    if (!upErr) {
      await supabase.from("deliverables").insert({
        order_id: orderId,
        file_path: path,
        file_name: file.name,
        size_bytes: file.size,
      });
      await load();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function download(d: Deliverable) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("deliverables")
      .createSignedUrl(d.file_path, 120);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function remove(d: Deliverable) {
    const supabase = createClient();
    await supabase.storage.from("deliverables").remove([d.file_path]);
    await supabase.from("deliverables").delete().eq("id", d.id);
    await load();
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-faint">
        {es ? "Entregables" : "Deliverables"}
      </h3>

      {items.length === 0 && (
        <p className="mb-4 text-sm text-fg-dim">
          {es ? "Aún no hay archivos." : "No files yet."}
        </p>
      )}

      <ul className="space-y-2">
        {items.map((d) => (
          <li
            key={d.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-2 p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <FileArchive className="h-4 w-4 shrink-0 text-orange" />
              <span className="truncate text-sm">{d.file_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => download(d)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-dim transition-colors hover:bg-glass hover:text-fg"
                aria-label={es ? "Descargar" : "Download"}
              >
                <Download className="h-4 w-4" />
              </button>
              {canUpload && (
                <button
                  onClick={() => remove(d)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-dim transition-colors hover:bg-glass hover:text-danger"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {canUpload && (
        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            onChange={onUpload}
            className="hidden"
            id="deliverable-upload"
          />
          <label
            htmlFor="deliverable-upload"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-glass"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {es ? "Subir archivo" : "Upload file"}
          </label>
        </div>
      )}
    </div>
  );
}
