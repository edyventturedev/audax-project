"use client";

import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="px-6 py-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[40px] border border-line bg-ink-3 px-6 py-16 text-center sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-64 opacity-70 blur-[100px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,107,41,0.35), transparent)",
            }}
          />
          <h2 className="relative mx-auto max-w-2xl whitespace-pre-line font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {t.cta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-fg-muted">
            {t.cta.sub}
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/servicios" size="lg" className="w-full sm:w-auto">
              {t.cta.button}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              href="/servicios/packages"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.cta.secondary}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
