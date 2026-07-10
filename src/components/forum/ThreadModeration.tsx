"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pin, Lock, Unlock, Trash2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ThreadModeration({
  id,
  category,
  pinned,
  locked,
}: {
  id: string;
  category: string;
  pinned: boolean;
  locked: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);

  async function patch(fields: Record<string, boolean>) {
    setBusy(true);
    await supabase.from("forum_threads").update(fields).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("¿Eliminar este hilo y todas sus respuestas?")) return;
    setBusy(true);
    await supabase.from("forum_threads").delete().eq("id", id);
    router.push(`/foro/${category}`);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-orange/30 bg-orange-soft/40 p-3">
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-orange">
        <ShieldCheck className="h-3.5 w-3.5" />
        Moderación
      </span>
      <ModButton onClick={() => patch({ pinned: !pinned })} disabled={busy}>
        <Pin className="h-3.5 w-3.5" />
        {pinned ? "Quitar fijado" : "Fijar"}
      </ModButton>
      <ModButton onClick={() => patch({ locked: !locked })} disabled={busy}>
        {locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
        {locked ? "Reabrir" : "Cerrar"}
      </ModButton>
      <ModButton onClick={remove} disabled={busy} danger>
        <Trash2 className="h-3.5 w-3.5" />
        Eliminar
      </ModButton>
    </div>
  );
}

function ModButton({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        danger
          ? "border-danger/40 text-danger hover:bg-danger/10"
          : "border-line text-fg-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
