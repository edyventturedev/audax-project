import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Elimina un pedido por completo (solo admin, protegido por RLS):
 * 1. Borra los archivos del bucket "deliverables" (las filas se borran en
 *    cascada, pero los objetos de Storage no).
 * 2. Borra el pedido; el "on delete cascade" elimina hitos, mensajes y
 *    filas de entregables.
 */
export async function deleteOrderCompletely(
  supabase: SupabaseClient,
  orderId: string,
) {
  // 1. Archivos en Storage
  const { data: files } = await supabase
    .from("deliverables")
    .select("file_path")
    .eq("order_id", orderId);

  const paths = (files ?? [])
    .map((f) => (f as { file_path: string }).file_path)
    .filter(Boolean);

  if (paths.length > 0) {
    await supabase.storage.from("deliverables").remove(paths);
  }

  // 2. El pedido (cascade elimina hijos)
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) throw error;
}
