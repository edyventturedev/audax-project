import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: proxy.ts also guards these routes.
  if (isSupabaseConfigured) {
    const user = await getCurrentUser();
    if (!user) redirect("/login?next=/dashboard");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto min-h-dvh max-w-[1100px] px-6 py-10">
        {children}
      </main>
    </>
  );
}
