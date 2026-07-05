"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Zap,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getService, getCategory, formatMXN } from "@/data/services";
import { Button } from "@/components/ui/Button";

export default function ServiceDetailPage() {
  const { lang, t } = useLanguage();
  const params = useParams<{ slug: string }>();
  const service = getService(params.slug);

  if (!service) return notFound();

  const category = getCategory(service.category)!;
  const isFixed = service.pricingType === "fixed";

  const perks =
    lang === "es"
      ? [
          "Comunicación directa con el equipo",
          "Revisiones incluidas",
          "Archivos finales listos para usar",
          "Seguimiento en tu panel",
        ]
      : [
          "Direct communication with the team",
          "Revisions included",
          "Ready-to-use final files",
          "Tracking in your dashboard",
        ];

  return (
    <div className="px-6 pb-10 pt-36 sm:pt-40">
      <div className="mx-auto max-w-[1100px]">
        <Link
          href={`/servicios/${service.category}`}
          className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" />
          {category.name[lang]}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-3 py-1 text-xs font-semibold text-orange">
              {isFixed ? (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  {lang === "es" ? "Precio fijo" : "Fixed price"}
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5" />
                  {lang === "es" ? "Cotización a medida" : "Custom quote"}
                </>
              )}
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
              {service.name[lang]}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-fg-muted">
              {service.desc[lang]}
            </p>

            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
                {lang === "es" ? "Qué incluye" : "What's included"}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-fg-muted">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink-3 p-4">
                <Clock className="h-5 w-5 text-orange" />
                <div>
                  <p className="text-sm font-medium">
                    {lang === "es" ? "Entrega estimada" : "Estimated delivery"}
                  </p>
                  <p className="text-xs text-fg-dim">
                    {lang === "es" ? "5–10 días hábiles" : "5–10 business days"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink-3 p-4">
                <ShieldCheck className="h-5 w-5 text-orange" />
                <div>
                  <p className="text-sm font-medium">
                    {lang === "es" ? "Pago seguro" : "Secure payment"}
                  </p>
                  <p className="text-xs text-fg-dim">Stripe · SSL</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing card (sticky) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-line bg-ink-3 p-6">
              <span className="text-xs uppercase tracking-wide text-fg-faint">
                {isFixed
                  ? lang === "es"
                    ? "Precio"
                    : "Price"
                  : t.services.from}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tabular-nums">
                  {formatMXN(service.priceMin)}
                </span>
                {service.unit && (
                  <span className="text-sm text-fg-dim">
                    {service.unit[lang]}
                  </span>
                )}
              </div>
              {!isFixed && (
                <p className="mt-1 text-sm text-fg-dim">
                  {lang === "es" ? "hasta" : "up to"}{" "}
                  {formatMXN(service.priceMax)}
                </p>
              )}

              <div className="mt-6">
                {/* Fase 3 wires real checkout / quote request; requires account (Fase 2). */}
                <Button
                  href={`/login?next=/servicios/detalle/${service.slug}`}
                  size="lg"
                  className="w-full"
                >
                  {isFixed
                    ? lang === "es"
                      ? "Solicitar y pagar"
                      : "Request & pay"
                    : lang === "es"
                      ? "Solicitar cotización"
                      : "Request a quote"}
                </Button>
                <p className="mt-3 text-center text-xs text-fg-faint">
                  {lang === "es"
                    ? "Crea tu cuenta para continuar."
                    : "Create your account to continue."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
