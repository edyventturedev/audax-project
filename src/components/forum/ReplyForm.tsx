"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReplyForm({
  threadId,
  isLoggedIn,
  locked,
}: {
  threadId: string;
  isLoggedIn: boolean;
  locked: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (locked) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-ink-3 p-5 text-sm text-fg-dim">
        <Lock className="h-4 w-4" />
        Este hilo está cerrado a nuevas respuestas.
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-line bg-ink-3 p-5 text-center">
        <p className="text-sm text-fg-muted">
          Inicia sesión para participar en la conversación.
        </p>
        <Button href="/login?next=/foro" className="mt-3">
          Iniciar sesión
        </Button>
      </div>
    );
  }

  async function submit() {
    const value = body.trim();
    if (!value) return;
    setSending(true);
    setError(null);
    const res = await fetch("/api/forum/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, body: value }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo responder.");
      return;
    }
    setBody("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line bg-ink-3 p-5">
      <label htmlFor="reply" className="mb-2 block text-sm font-medium text-fg-muted">
        Responder
      </label>
      <textarea
        id="reply"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Escribe tu respuesta… (respetuosa y dentro del tema)"
        className="w-full resize-none rounded-xl border border-line bg-ink-2 p-3 text-sm outline-none focus:border-orange"
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <div className="mt-3 flex justify-end">
        <Button onClick={submit} disabled={sending || !body.trim()}>
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Publicar respuesta
        </Button>
      </div>
    </div>
  );
}
