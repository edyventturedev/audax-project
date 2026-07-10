"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

export function ReportButton({
  targetType,
  targetId,
  isLoggedIn,
}: {
  targetType: "thread" | "reply";
  targetId: string;
  isLoggedIn: boolean;
}) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function report() {
    if (!isLoggedIn) {
      window.location.href = "/login?next=/foro";
      return;
    }
    const reason = window.prompt(
      "¿Por qué reportas esto? (opcional)\nLo revisará el equipo de Audax.",
    );
    if (reason === null) return; // canceló
    setBusy(true);
    await fetch("/api/forum/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, reason }),
    });
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return <span className="text-xs text-fg-faint">Reportado. Gracias.</span>;
  }

  return (
    <button
      type="button"
      onClick={report}
      disabled={busy}
      className="inline-flex items-center gap-1 text-xs text-fg-faint transition-colors hover:text-danger disabled:opacity-50"
    >
      <Flag className="h-3 w-3" />
      Reportar
    </button>
  );
}
