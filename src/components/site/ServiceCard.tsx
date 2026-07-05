"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { type Service, formatMXN } from "@/data/services";
import { cn } from "@/lib/cn";

export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const { t, lang } = useLanguage();
  const isFixed = service.pricingType === "fixed";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/servicios/detalle/${service.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-3 p-6 transition-colors hover:border-line-strong"
      >
        {service.popular && (
          <span className="absolute right-5 top-5 rounded-full bg-orange-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange">
            Popular
          </span>
        )}
        <h3 className="pr-16 font-[family-name:var(--font-display)] text-xl font-bold">
          {service.name[lang]}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">
          {service.desc[lang]}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-fg-faint">
              {isFixed ? t.services.from : t.services.from}
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
              {formatMXN(service.priceMin)}
              {service.unit && (
                <span className="ml-1 text-xs font-normal text-fg-dim">
                  {service.unit[lang]}
                </span>
              )}
            </span>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-glass text-fg transition-colors group-hover:bg-orange group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
