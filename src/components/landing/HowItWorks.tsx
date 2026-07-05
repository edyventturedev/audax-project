"use client";

import { MousePointerClick, CreditCard, LineChart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const icons = [MousePointerClick, CreditCard, LineChart];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how" className="scroll-mt-28 px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow={t.how.eyebrow}
          title={t.how.title}
          sub={t.how.sub}
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
          {t.how.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <RevealItem key={step.t}>
                <div className="relative h-full rounded-3xl border border-line bg-ink-3 p-7">
                  <span className="absolute right-6 top-6 font-[family-name:var(--font-display)] text-5xl font-extrabold text-white/5">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold">
                    {step.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-dim">
                    {step.d}
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
