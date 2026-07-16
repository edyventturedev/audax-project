import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Otorga a un usuario el acceso a TODOS los LUTs de un paquete.
 * Marca la compra como 'granted' e inserta (o actualiza) una fila 'granted'
 * en lut_downloads por cada LUT del paquete, reutilizando la descarga individual.
 * Server-only (recibe un cliente service-role).
 */
export async function grantPackAccess(
  admin: AdminClient,
  packId: string,
  userId: string,
): Promise<void> {
  // 1) Marcar la compra del paquete como otorgada.
  await admin
    .from("lut_pack_purchases")
    .update({ status: "granted" })
    .eq("pack_id", packId)
    .eq("user_id", userId);

  // 2) Desbloquear cada LUT del paquete.
  const { data: items } = await admin
    .from("lut_pack_items")
    .select("lut_id")
    .eq("pack_id", packId);

  const rows = (items ?? []).map((it: { lut_id: string }) => ({
    lut_id: it.lut_id,
    user_id: userId,
    kind: "paid" as const,
    status: "granted" as const,
  }));

  if (rows.length > 0) {
    await admin
      .from("lut_downloads")
      .upsert(rows, { onConflict: "lut_id,user_id" });
  }

  // 3) Contador del paquete (aproximado, no crítico).
  const { data: pack } = await admin
    .from("lut_packs")
    .select("downloads")
    .eq("id", packId)
    .maybeSingle();
  await admin
    .from("lut_packs")
    .update({ downloads: (pack?.downloads ?? 0) + 1 })
    .eq("id", packId);
}
