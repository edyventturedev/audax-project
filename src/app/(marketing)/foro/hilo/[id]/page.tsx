import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound, Lock, Pin } from "lucide-react";
import { getThread, getReplies } from "@/lib/forum";
import { getForumCategory } from "@/data/forum";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Markdown } from "@/components/blog/Markdown";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { ReplyItem } from "@/components/forum/ReplyItem";
import { ReportButton } from "@/components/forum/ReportButton";
import { ThreadModeration } from "@/components/forum/ThreadModeration";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const thread = await getThread(id);
  if (!thread) return { title: "Tema no encontrado" };
  return {
    title: thread.title,
    description: thread.body.slice(0, 160),
    alternates: { canonical: `/foro/hilo/${thread.id}` },
    openGraph: { title: thread.title, type: "article" },
  };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await getThread(id);
  if (!thread) return notFound();

  const [replies, user] = await Promise.all([getReplies(id), getCurrentUser()]);
  const cat = getForumCategory(thread.category);

  let isAdmin = false;
  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="mx-auto max-w-[760px] px-6 pt-32 pb-16 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Foro", path: "/foro" },
          ...(cat ? [{ name: cat.label, path: `/foro/${cat.slug}` }] : []),
          { name: thread.title, path: `/foro/hilo/${thread.id}` },
        ])}
      />

      <Link
        href={cat ? `/foro/${cat.slug}` : "/foro"}
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        {cat?.label ?? "Foro"}
      </Link>

      {/* Hilo */}
      <article className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          {thread.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-soft px-2 py-0.5 text-xs font-medium text-orange">
              <Pin className="h-3 w-3" /> Fijado
            </span>
          )}
          {thread.locked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-glass px-2 py-0.5 text-xs font-medium text-fg-muted">
              <Lock className="h-3 w-3" /> Cerrado
            </span>
          )}
        </div>

        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight tracking-tight text-balance sm:text-3xl">
          {thread.title}
        </h1>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-glass text-fg-dim">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="font-medium text-fg">{thread.author_name}</span>
            <span className="text-xs text-fg-faint">
              {new Date(thread.created_at).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <ReportButton targetType="thread" targetId={thread.id} isLoggedIn={!!user} />
        </div>

        <div className="mt-5 text-[1.02rem]">
          <Markdown content={thread.body} />
        </div>

        {isAdmin && (
          <div className="mt-6">
            <ThreadModeration
              id={thread.id}
              category={thread.category}
              pinned={thread.pinned}
              locked={thread.locked}
            />
          </div>
        )}
      </article>

      {/* Respuestas */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          {thread.reply_count} respuesta{thread.reply_count === 1 ? "" : "s"}
        </h2>
        <div className="mt-4 space-y-3">
          {replies.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              currentUserId={user?.id ?? null}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        <div className="mt-6">
          <ReplyForm threadId={thread.id} isLoggedIn={!!user} locked={thread.locked} />
        </div>
      </section>
    </div>
  );
}
