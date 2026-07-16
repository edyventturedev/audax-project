import { createClient } from "@/lib/supabase/server";
import type { Lut } from "@/lib/lutText";
import type { LutPack } from "@/lib/packText";

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

type PackRow = Omit<LutPack, "items"> & {
  lut_pack_items:
    | { position: number; luts: LutPack["items"][number] | null }[]
    | null;
};

/** Paquetes publicados con la lista de LUTs que incluyen. */
export async function getPublishedPacks(): Promise<LutPack[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lut_packs")
    .select(
      "id, slug, name_es, name_en, desc_es, desc_en, price, cover_image, featured, downloads, lut_pack_items(position, luts(slug, name_es, name_en, cover_image, price))",
    )
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return ((data as unknown as PackRow[]) ?? []).map((p) => {
    const { lut_pack_items, ...pack } = p;
    const items = (lut_pack_items ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((it) => it.luts)
      .filter((l): l is LutPack["items"][number] => Boolean(l));
    return { ...pack, items };
  });
}
