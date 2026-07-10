import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { NewThreadForm } from "@/components/forum/NewThreadForm";

export const metadata: Metadata = {
  title: "Nuevo tema — Foro",
  robots: { index: false },
};

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/foro/nuevo");

  const { cat } = await searchParams;

  return (
    <div className="mx-auto max-w-[900px] px-6 pt-32 pb-16 sm:pt-40">
      <Link
        href="/foro"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Foro
      </Link>

      <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        Nuevo tema
      </h1>
      <p className="mt-2 text-fg-muted">
        Elige la categoría, escribe tu tema y aporta valor a la comunidad.
      </p>

      <div className="mt-8">
        <NewThreadForm initialCategory={cat} />
      </div>
    </div>
  );
}
