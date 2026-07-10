"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Markdown } from "@/components/blog/Markdown";
import { ReportButton } from "./ReportButton";

type Reply = {
  id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export function ReplyItem({
  reply,
  currentUserId,
  isAdmin,
}: {
  reply: Reply;
  currentUserId: string | null;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const canDelete = isAdmin || currentUserId === reply.user_id;

  async function remove() {
    if (!confirm("¿Eliminar esta respuesta?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("forum_replies").delete().eq("id", reply.id);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line bg-ink-3 p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-glass text-fg-dim">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="font-medium text-fg">{reply.author_name}</span>
          <span className="text-xs text-fg-faint">
            {new Date(reply.created_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ReportButton targetType="reply" targetId={reply.id} isLoggedIn={!!currentUserId} />
          {canDelete && (
            <button
              onClick={remove}
              disabled={deleting}
              className="inline-flex items-center gap-1 text-xs text-fg-faint transition-colors hover:text-danger disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Eliminar
            </button>
          )}
        </div>
      </div>
      <div className="text-sm">
        <Markdown content={reply.body} />
      </div>
    </div>
  );
}
