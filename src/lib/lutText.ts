// Tipos y utilidades de LUTs, seguros para cliente y servidor (sin imports de servidor).
import type { Lang } from "@/i18n/dictionary";

export type Lut = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  desc_es: string;
  desc_en: string;
  category: string;
  price: number; // centavos MXN; 0 = gratis
  cover_image: string | null;
  preview_before: string | null;
  file_name: string | null;
  format: string;
  featured: boolean;
  downloads: number;
};

export function localizeLut(
  lut: Pick<Lut, "name_es" | "name_en" | "desc_es" | "desc_en">,
  lang: Lang,
): { name: string; desc: string } {
  const en = lang === "en";
  return {
    name: (en && lut.name_en) || lut.name_es,
    desc: (en && lut.desc_en) || lut.desc_es,
  };
}

export function isFree(lut: Pick<Lut, "price">): boolean {
  return !lut.price || lut.price <= 0;
}
