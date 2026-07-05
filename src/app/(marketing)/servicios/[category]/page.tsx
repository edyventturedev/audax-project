"use client";

import { useParams, notFound } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  getCategory,
  servicesByCategory,
  type CategorySlug,
} from "@/data/services";
import { CatalogHeader } from "@/components/site/CatalogHeader";
import { ServiceCard } from "@/components/site/ServiceCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function CategoryPage() {
  const { lang } = useLanguage();
  const params = useParams<{ category: string }>();
  const category = getCategory(params.category);

  if (!category) return notFound();

  const list = servicesByCategory(category.slug as CategorySlug);

  return (
    <div className="pb-10">
      <CatalogHeader title={category.name[lang]} sub={category.tagline[lang]} />
      <div className="mx-auto mt-14 max-w-[1100px] px-6">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <RevealItem key={s.slug}>
              <ServiceCard service={s} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
