"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { FORUM_CATEGORIES, FORUM_RULES } from "@/data/forum";
import { Button } from "@/components/ui/Button";

export function NewThreadForm({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter();
  const [category, setCategory] = useState(
    initialCategory && FORUM_CATEGORIES.some((c) => c.slug === initialCategory)
      ? initialCategory
      : FORUM_CATEGORIES[0].slug,
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setError(null);
    const res = await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, body }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo publicar.");
      return;
    }
    router.push(`/foro/hilo/${data.id}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-muted">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
          >
            {FORUM_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-muted">
            Título
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={140}
            placeholder="Resume tu tema o pregunta"
            className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-orange"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-muted">
            Mensaje
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="Desarrolla tu tema. Puedes usar **negritas**, listas con - y enlaces [texto](url)."
            className="w-full resize-none rounded-xl border border-line bg-ink-2 p-3 text-sm leading-relaxed outline-none focus:border-orange"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={submit} size="lg" disabled={sending || !title.trim() || !body.trim()}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Publicar tema
          </Button>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-line bg-ink-3 p-5">
        <h3 className="text-sm font-semibold text-fg">Reglas de la comunidad</h3>
        <ul className="mt-3 space-y-2.5">
          {FORUM_RULES.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-xs leading-relaxed text-fg-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              {r}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
