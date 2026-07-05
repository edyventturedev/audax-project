import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AdminHeader } from "@/components/app/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) redirect("/");

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <>
      <AdminHeader />
      <main className="mx-auto min-h-dvh max-w-[1100px] px-6 py-10">
        {children}
      </main>
    </>
  );
}
