import type { Metadata } from "next";
import { getPublishedLuts } from "@/lib/luts";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { LutsCatalogView } from "@/components/luts/LutsCatalogView";

export const metadata: Metadata = {
  title: "LUTs de color — Presets para foto y video | Audax Project",
  description:
    "Descarga LUTs gratis o compra presets de color profesionales para tus fotos y videos. Compatibles con Premiere, DaVinci, Final Cut, Lightroom y más. Aplica un look cinematográfico en un clic.",
  alternates: { canonical: "/luts" },
  openGraph: {
    title: "LUTs de color — Audax Project",
    description:
      "Presets de color profesionales para foto y video. Descarga gratis o compra y aplica un look cinematográfico al instante.",
    url: "/luts",
    type: "website",
  },
};

export default async function LutsPage() {
  const luts = await getPublishedLuts();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "LUTs", path: "/luts" },
        ])}
      />
      <LutsCatalogView luts={luts} />
    </>
  );
}
