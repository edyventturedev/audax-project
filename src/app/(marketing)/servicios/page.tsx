"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { categories, servicesByCategory } from "@/data/services";
import { CatalogHeader } from "@/components/site/CatalogHeader";
import { ServiceCard } from "@/components/site/ServiceCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function ServicesCatalogPage() {
  const { lang } = useLanguage();

  return (
    <div className="pb-10">
      <CatalogHeader
        title={lang === "es" ? "Catálogo de servicios" : "Service catalog"}
        sub={
          lang === "es"
            ? "Elige un servicio, cotiza al instante y sigue tu proyecto."
            : "Pick a service, get an instant quote and track your project."
        }
      />

      <div className="mx-auto mt-14 max-w-[1100px] space-y-16 px-6">
        {categories
          .filter((c) => c.slug !== "packages")
          .map((cat) => (
            <section key={cat.slug} id={cat.slug}>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                  {cat.name[lang]}
                </h2>
              </div>
              <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {servicesByCategory(cat.slug).map((s) => (
                  <RevealItem key={s.slug}>
                    <ServiceCard service={s} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          ))}
      </div>
    </div>
  );
}
