"use client";

import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { WELCOME_DISCOUNT_PERCENT } from "@/lib/promo";
import { Reveal } from "@/components/motion/Reveal";

export function PromoBanner() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const pct = `${WELCOME_DISCOUNT_PERCENT}%`;

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-orange/30 bg-gradient-to-br from-orange/20 via-ink-3 to-ink-3 p-7 sm:p-9">
            {/* Resplandor */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-70 blur-[70px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,41,0.55) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange text-white shadow-[0_6px_20px_rgba(255,107,41,0.45)]">
                  <Gift className="h-6 w-6" />
                </span>
                <div>
                  <span className="inline-flex items-center rounded-full bg-orange-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-orange">
                    {es ? "Oferta de bienvenida" : "Welcome offer"}
                  </span>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                    {es ? (
                      <>
                        {pct} de descuento en tu{" "}
                        <span className="text-orange">primer proyecto</span>
                      </>
                    ) : (
                      <>
                        {pct} off your{" "}
                        <span className="text-orange">first project</span>
                      </>
                    )}
                  </h2>
                  <p className="mt-1.5 max-w-md text-sm text-fg-muted">
                    {es
                      ? "En todos los servicios. Crea tu cuenta y el descuento se aplica solo al pagar tu primera cotización."
                      : "On every service. Create your account and the discount applies automatically on your first order."}
                  </p>
                </div>
              </div>

              <Link
                href="/servicios"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
              >
                {es ? "Ver servicios" : "See services"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
