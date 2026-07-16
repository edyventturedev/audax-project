"use client";

import Link from "next/link";
import {
  Globe,
  ShoppingBag,
  LayoutTemplate,
  Sparkles,
  Clapperboard,
  Camera,
  ArrowUpRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getService, formatMXN } from "@/data/services";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

type Highlight = {
  slug: string;
  icon: LucideIcon;
  title: { es: string; en: string };
  desc: { es: string; en: string };
  glow: string; // color del resplandor de la tarjeta
};

// Los servicios que más solicitan los negocios (cotizaciones frecuentes).
const HIGHLIGHTS: Highlight[] = [
  {
    slug: "business-website",
    icon: Globe,
    title: { es: "Sitio web de negocio", en: "Business website" },
    desc: {
      es: "Un sitio profesional que convierte visitantes en clientes.",
      en: "A professional site that turns visitors into customers.",
    },
    glow: "rgba(255,107,41,0.5)",
  },
  {
    slug: "e-commerce",
    icon: ShoppingBag,
    title: { es: "Tienda en línea", en: "Online store" },
    desc: {
      es: "Vende 24/7 con pagos integrados y control de inventario.",
      en: "Sell 24/7 with built-in payments and inventory.",
    },
    glow: "rgba(56,189,248,0.45)",
  },
  {
    slug: "logo-design",
    icon: Sparkles,
    title: { es: "Logo & Branding", en: "Logo & Branding" },
    desc: {
      es: "Una identidad memorable que inspira confianza.",
      en: "A memorable identity that builds trust.",
    },
    glow: "rgba(167,139,250,0.45)",
  },
  {
    slug: "landing-page",
    icon: LayoutTemplate,
    title: { es: "Landing page", en: "Landing page" },
    desc: {
      es: "Una página enfocada 100% en vender o captar clientes.",
      en: "A page focused 100% on selling or capturing leads.",
    },
    glow: "rgba(52,211,153,0.45)",
  },
  {
    slug: "reels-social",
    icon: Clapperboard,
    title: { es: "Reels & Redes", en: "Reels & Social" },
    desc: {
      es: "Contenido que hace crecer tus redes cada mes.",
      en: "Content that grows your social media every month.",
    },
    glow: "rgba(251,113,133,0.45)",
  },
  {
    slug: "restaurant-session",
    icon: Camera,
    title: { es: "Fotografía de negocio", en: "Business photography" },
    desc: {
      es: "Muestra tu producto y espacio como se merecen.",
      en: "Show your product and space as they deserve.",
    },
    glow: "rgba(251,191,36,0.45)",
  },
];

export function BusinessHighlights() {
  const { lang } = useLanguage();
  const es = lang === "es";

  return (
    <section id="services" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px]">
        {/* Encabezado a dos columnas */}
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-2 lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-orange" />
                <span className="text-xs font-semibold uppercase tracking-wider text-orange">
                  {es ? "Lo más solicitado" : "Most requested"}
                </span>
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {es
                  ? "Todo lo que tu negocio necesita"
                  : "Everything your business needs"}
              </h2>
            </div>
            <p className="text-fg-muted lg:text-right">
              {es
                ? "Los servicios que más cotizan los negocios en México. Elige uno, recibe tu precio y paga en línea, todo en un solo lugar."
                : "The services businesses in Mexico request most. Pick one, get your price and pay online, all in one place."}
            </p>
          </div>
        </Reveal>

        {/* Grid de servicios destacados */}
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((h) => {
            const service = getService(h.slug);
            const Icon = h.icon;
            return (
              <RevealItem key={h.slug}>
                <Link
                  href={`/servicios/detalle/${h.slug}`}
                  className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-3xl border border-line bg-ink-3 p-6 transition-colors hover:border-line-strong"
                >
                  {/* Resplandor */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-[50px] transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle, ${h.glow} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                      style={{
                        background: `linear-gradient(135deg, ${h.glow}, rgba(255,255,255,0.06))`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">
                      {h.title[lang]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {h.desc[lang]}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto flex items-center justify-between pt-6">
                    {service && (
                      <span className="text-sm text-fg-dim">
                        {service.hidePrice ? (
                          <span className="font-semibold text-fg">
                            {es ? "Cotización a medida" : "Custom quote"}
                          </span>
                        ) : (
                          <>
                            {es ? "Desde" : "From"}{" "}
                            <span className="font-semibold text-fg">
                              {formatMXN(service.priceMin)}
                            </span>
                          </>
                        )}
                      </span>
                    )}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-glass text-fg transition-colors group-hover:bg-orange group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Ver todos */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-glass"
          >
            {es ? "Ver todos los servicios" : "See all services"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
