import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { AdminOrderManager } from "@/components/app/AdminOrderManager";

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");

  return <AdminOrderManager orderId={id} adminId={user.id} />;
}
