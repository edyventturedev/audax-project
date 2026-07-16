import { createClient } from "@/lib/supabase/server";
import type { Lut } from "@/lib/lutText";

export { slugify } from "@/lib/blogText";
export { localizeLut, isFree } from "@/lib/lutText";
export type { Lut } from "@/lib/lutText";

// Campos seguros para el público (nunca exponemos file_path).
const PUBLIC_FIELDS =
  "id, slug, name_es, name_en, desc_es, desc_en, category, price, cover_image, preview_before, file_name, format, featured, downloads";

/** LUTs visibles al público (publicados), destacados primero. */
export async function getPublishedLuts(): Promise<Lut[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("luts")
    .select(PUBLIC_FIELDS)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  return (data as Lut[]) ?? [];
}
