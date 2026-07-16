// Tipos y utilidades de paquetes de LUTs, seguros para cliente y servidor.
import type { Lang } from "@/i18n/dictionary";

export { isFree } from "@/lib/lutText";

export type PackItem = {
  slug: string;
  name_es: string;
  name_en: string;
  cover_image: string | null;
  price: number;
};

export type LutPack = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  desc_es: string;
  desc_en: string;
  price: number; // centavos MXN; 0 = gratis
  cover_image: string | null;
  featured: boolean;
  downloads: number;
  items: PackItem[];
};

export function localizePack(
  p: Pick<LutPack, "name_es" | "name_en" | "desc_es" | "desc_en">,
  lang: Lang,
): { name: string; desc: string } {
  const en = lang === "en";
  return {
    name: (en && p.name_en) || p.name_es,
    desc: (en && p.desc_en) || p.desc_es,
  };
}

/** Suma del precio individual de los LUTs del paquete (centavos). */
export function itemsValue(items: Pick<PackItem, "price">[]): number {
  return items.reduce((sum, it) => sum + (it.price || 0), 0);
}
