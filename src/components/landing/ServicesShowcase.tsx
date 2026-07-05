"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function ServicesShowcase() {
  const { t } = useLanguage();
  const featured = services.filter((s) => s.popular).concat(
    services.filter((s) => !s.popular),
  ).slice(0, 6);

  return (
    <section id="services" className="px-6 py-8 sm:py-12">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow={t.services.eyebrow}
          title={t.services.title}
          sub={t.services.sub}
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <RevealItem key={s.slug}>
              <ServiceCard service={s} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex justify-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-glass"
          >
            {t.services.seeAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
