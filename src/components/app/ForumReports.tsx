"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Flag, Check, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Report = {
  id: string;
  target_type: "thread" | "reply";
  target_id: string;
  reason: string | null;
  resolved: boolean;
  created_at: string;
};

export function ForumReports() {
  const supabase = createClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("forum_reports")
      .select("id, target_type, target_id, reason, resolved, created_at")
      .order("created_at", { ascending: false });
    setReports((data as Report[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function resolve(id: string) {
    await supabase.from("forum_reports").update({ resolved: true }).eq("id", id);
    load();
  }

  const shown = reports.filter((r) => showResolved || !r.resolved);
  const openCount = reports.filter((r) => !r.resolved).length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            Reportes del foro
          </h1>
          <p className="mt-2 text-fg-muted">
            {openCount} reporte{openCount === 1 ? "" : "s"} sin revisar. Abre el
            contenido, y elimínalo desde ahí si no corresponde.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Ver resueltos
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
        </div>
      ) : shown.length === 0 ? (
        <p className="py-20 text-center text-fg-dim">Sin reportes pendientes. 🎉</p>
      ) : (
        <div className="mt-6 space-y-3">
          {shown.map((r) => {
            const href =
              r.target_type === "thread"
                ? `/foro/hilo/${r.target_id}`
                : "/foro";
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-3 p-5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-danger" />
                    <span className="text-sm font-medium">
                      {r.target_type === "thread" ? "Hilo" : "Respuesta"} reportado
                    </span>
                    {r.resolved && (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">
                        Resuelto
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">
                    {r.reason || "(sin motivo especificado)"}
                  </p>
                  <p className="mt-0.5 text-xs text-fg-faint">
                    {new Date(r.created_at).toLocaleString("es-MX")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={href}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ver
                  </Link>
                  {!r.resolved && (
                    <button
                      onClick={() => resolve(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Marcar resuelto
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
