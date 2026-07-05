"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { type Service, formatMXN } from "@/data/services";
import { Button } from "@/components/ui/Button";

export function RequestPanel({ service }: { service: Service }) {
  const { lang, t } = useLanguage();
  const { user, loading: authLoading } = useSupabaseUser();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [showBrief, setShowBrief] = useState(false);

  const isFixed = service.pricingType === "fixed";
  const es = lang === "es";

  async function handleFixed() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  async function handleQuote() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug, brief }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      router.push(`/dashboard/orders/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-line bg-ink-3 p-6">
      <span className="text-xs uppercase tracking-wide text-fg-faint">
        {isFixed ? (es ? "Precio" : "Price") : t.services.from}
      </span>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tabular-nums">
          {formatMXN(service.priceMin)}
        </span>
        {service.unit && (
          <span className="text-sm text-fg-dim">{service.unit[lang]}</span>
        )}
      </div>
      {!isFixed && (
        <p className="mt-1 text-sm text-fg-dim">
          {es ? "hasta" : "up to"} {formatMXN(service.priceMax)}
        </p>
      )}

      <div className="mt-6">
        {authLoading ? (
          <div className="flex h-13 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-fg-dim" />
          </div>
        ) : !user ? (
          <>
            <Button
              href={`/login?next=${encodeURIComponent(pathname)}`}
              size="lg"
              className="w-full"
            >
              <Lock className="h-4 w-4" />
              {es ? "Inicia sesión para continuar" : "Log in to continue"}
            </Button>
            <p className="mt-3 text-center text-xs text-fg-faint">
              {es ? "Crea tu cuenta gratis en segundos." : "Create your free account in seconds."}
            </p>
          </>
        ) : isFixed ? (
          <Button
            onClick={handleFixed}
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {es ? "Solicitar y pagar" : "Request & pay"}
          </Button>
        ) : showBrief ? (
          <div>
            <label
              htmlFor="brief"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {es ? "Cuéntanos qué necesitas" : "Tell us what you need"}
            </label>
            <textarea
              id="brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={4}
              placeholder={
                es
                  ? "Objetivo, referencias, fechas, presupuesto…"
                  : "Goal, references, dates, budget…"
              }
              className="w-full resize-none rounded-xl border border-line bg-ink-2 p-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-orange"
            />
            <Button
              onClick={handleQuote}
              size="lg"
              className="mt-3 w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {es ? "Enviar solicitud" : "Send request"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowBrief(true)}
            size="lg"
            className="w-full"
          >
            {es ? "Solicitar cotización" : "Request a quote"}
          </Button>
        )}

        {error && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
