"use client";

import { ShieldCheck, Radar, Layers, Lock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const icons = [ShieldCheck, Radar, Layers, Lock];

export function WhyAudax() {
  const { t } = useLanguage();

  return (
    <section id="why" className="scroll-mt-28 px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading eyebrow={t.why.eyebrow} title={t.why.title} align="center" />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <RevealItem key={item.t}>
                <div className="h-full rounded-3xl border border-line bg-ink-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-dim">
                    {item.d}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
