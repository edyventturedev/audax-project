import { createClient } from "@/lib/supabase/server";

export type ForumThread = {
  id: string;
  category: string;
  user_id: string;
  author_name: string;
  title: string;
  body: string;
  locked: boolean;
  pinned: boolean;
  reply_count: number;
  last_activity_at: string;
  created_at: string;
};

export type ForumReply = {
  id: string;
  thread_id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

const THREAD_FIELDS =
  "id, category, user_id, author_name, title, body, locked, pinned, reply_count, last_activity_at, created_at";

/** Hilos de una categoría (fijados primero, luego por actividad). */
export async function getThreads(category: string): Promise<ForumThread[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_threads")
    .select(THREAD_FIELDS)
    .eq("category", category)
    .order("pinned", { ascending: false })
    .order("last_activity_at", { ascending: false });
  return (data as ForumThread[]) ?? [];
}

/** Hilos recientes de todo el foro (para la portada). */
export async function getRecentThreads(limit = 8): Promise<ForumThread[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_threads")
    .select(THREAD_FIELDS)
    .order("last_activity_at", { ascending: false })
    .limit(limit);
  return (data as ForumThread[]) ?? [];
}

export async function getThread(id: string): Promise<ForumThread | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_threads")
    .select(THREAD_FIELDS)
    .eq("id", id)
    .maybeSingle();
  return (data as ForumThread) ?? null;
}

export async function getReplies(threadId: string): Promise<ForumReply[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_replies")
    .select("id, thread_id, user_id, author_name, body, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  return (data as ForumReply[]) ?? [];
}

/** Conteo de hilos por categoría (para la portada). */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase.from("forum_threads").select("category");
  const counts: Record<string, number> = {};
  for (const row of (data as { category: string }[]) ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}
