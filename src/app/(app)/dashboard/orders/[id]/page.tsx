import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { OrderDetail } from "@/components/app/OrderDetail";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/dashboard/orders/${id}`);

  return (
    <Suspense>
      <OrderDetail orderId={id} userId={user.id} />
    </Suspense>
  );
}
