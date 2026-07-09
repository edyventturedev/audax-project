"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { type Service, formatMXN } from "@/data/services";
import { Button } from "@/components/ui/Button";

type Lang = "es" | "en";

type ChipOption = { value: string; es: string; en: string };
type ChipQuestion = {
  key: string;
  es: string;
  en: string;
  multi?: boolean;
  options: ChipOption[];
};

// Preguntas guiadas para definir mejor una cotización.
const QUESTIONS: ChipQuestion[] = [
  {
    key: "goal",
    es: "¿Cuál es el objetivo principal?",
    en: "What's the main goal?",
    options: [
      { value: "sell", es: "Vender en línea", en: "Sell online" },
      { value: "leads", es: "Captar clientes", en: "Get leads" },
      { value: "booking", es: "Agendar citas / reservas", en: "Bookings" },
      { value: "showcase", es: "Mostrar mi trabajo", en: "Showcase work" },
      { value: "brand", es: "Reforzar mi marca", en: "Build my brand" },
    ],
  },
  {
    key: "has",
    es: "¿Qué ya tienes?",
    en: "What do you already have?",
    multi: true,
    options: [
      { value: "logo", es: "Logo / marca", en: "Logo / brand" },
      { value: "copy", es: "Textos", en: "Copy" },
      { value: "media", es: "Fotos / videos", en: "Photos / videos" },
      { value: "site", es: "Sitio actual", en: "Current site" },
      { value: "domain", es: "Dominio", en: "Domain" },
      { value: "nothing", es: "Nada aún", en: "Nothing yet" },
    ],
  },
  {
    key: "budget",
    es: "Presupuesto aproximado",
    en: "Approximate budget",
    options: [
      { value: "<10k", es: "Menos de $10,000", en: "Under $10,000" },
      { value: "10-25k", es: "$10,000 – $25,000", en: "$10,000 – $25,000" },
      { value: "25-50k", es: "$25,000 – $50,000", en: "$25,000 – $50,000" },
      { value: "50k+", es: "Más de $50,000", en: "Over $50,000" },
      { value: "unsure", es: "No estoy seguro", en: "Not sure" },
    ],
  },
  {
    key: "timeline",
    es: "¿Para cuándo lo necesitas?",
    en: "When do you need it?",
    options: [
      { value: "asap", es: "Lo antes posible", en: "ASAP" },
      { value: "2-4w", es: "2 – 4 semanas", en: "2 – 4 weeks" },
      { value: "1-2m", es: "1 – 2 meses", en: "1 – 2 months" },
      { value: "flexible", es: "Sin prisa", en: "Flexible" },
    ],
  },
];

type TrustItem = { icon: LucideIcon; es: string; en: string };

const TRUST_FIXED: TrustItem[] = [
  { icon: ShieldCheck, es: "Pago 100% seguro con Stripe", en: "100% secure payment with Stripe" },
  { icon: RefreshCcw, es: "Incluye revisiones", en: "Revisions included" },
  { icon: CheckCircle2, es: "Sigue el avance en tu panel", en: "Track progress in your dashboard" },
];

const TRUST_QUOTE: TrustItem[] = [
  { icon: CheckCircle2, es: "Sin compromiso: primero cotizamos", en: "No commitment: we quote first" },
  { icon: ShieldCheck, es: "No avanzamos hasta que apruebes", en: "We don't start until you approve" },
  { icon: Lock, es: "Pago seguro con Stripe", en: "Secure payment with Stripe" },
];

function labelFor(q: ChipQuestion, value: string, lang: Lang): string {
  const opt = q.options.find((o) => o.value === value);
  return opt ? opt[lang] : value;
}

function TrustList({ items, lang }: { items: TrustItem[]; lang: Lang }) {
  return (
    <ul className="mt-4 space-y-2 border-t border-line pt-4">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <li key={i} className="flex items-center gap-2.5 text-xs text-fg-dim">
            <Icon className="h-4 w-4 shrink-0 text-orange" />
            {it[lang]}
          </li>
        );
      })}
    </ul>
  );
}

export function RequestPanel({ service }: { service: Service }) {
  const { lang, t } = useLanguage();
  const es = lang === "es";
  const { user, loading: authLoading } = useSupabaseUser();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);

  // Respuestas del cuestionario
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [businessType, setBusinessType] = useState("");
  const [references, setReferences] = useState("");
  const [details, setDetails] = useState("");
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const autoSubmitted = useRef(false);

  const isFixed = service.pricingType === "fixed";
  const stashKey = `audax:quote:${service.slug}`;

  // Restaura respuestas guardadas antes de registrarse (si volvió con sesión).
  useEffect(() => {
    if (isFixed) return;
    try {
      const raw = localStorage.getItem(stashKey);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.ts && Date.now() - d.ts > 86_400_000) {
        localStorage.removeItem(stashKey);
        return;
      }
      setAnswers(d.answers ?? {});
      setBusinessType(d.businessType ?? "");
      setReferences(d.references ?? "");
      setDetails(d.details ?? "");
      setShowBrief(true);
      setPendingSubmit(true);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando ya hay sesión y había una solicitud pendiente, la envía sola.
  useEffect(() => {
    if (pendingSubmit && user && !authLoading && !autoSubmitted.current) {
      autoSubmitted.current = true;
      localStorage.removeItem(stashKey);
      setPendingSubmit(false);
      handleQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSubmit, user, authLoading]);

  function toggle(q: ChipQuestion, value: string) {
    setAnswers((prev) => {
      const current = prev[q.key] ?? [];
      if (q.multi) {
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [q.key]: next };
      }
      return { ...prev, [q.key]: current.includes(value) ? [] : [value] };
    });
  }

  // Arma un brief legible para el admin a partir del cuestionario.
  function buildBrief(): string {
    const lines: string[] = [];
    if (businessType.trim()) {
      lines.push(`${es ? "Giro / negocio" : "Business type"}: ${businessType.trim()}`);
    }
    for (const q of QUESTIONS) {
      const vals = answers[q.key];
      if (vals && vals.length) {
        const labels = vals.map((v) => labelFor(q, v, lang)).join(", ");
        lines.push(`${q[lang].replace(/[?¿]/g, "").trim()}: ${labels}`);
      }
    }
    if (references.trim()) {
      lines.push(`${es ? "Referencias" : "References"}: ${references.trim()}`);
    }
    if (details.trim()) {
      lines.push("");
      lines.push(`${es ? "Detalles" : "Details"}: ${details.trim()}`);
    }
    return lines.join("\n");
  }

  const canSend =
    (answers.goal?.length ?? 0) > 0 ||
    businessType.trim().length > 0 ||
    details.trim().length > 0;

  function goSignup() {
    router.push(`/signup?next=${encodeURIComponent(pathname)}`);
  }

  // Guarda las respuestas y manda a registrarse; al volver se envían solas.
  function stashAndSignup() {
    try {
      localStorage.setItem(
        stashKey,
        JSON.stringify({ answers, businessType, references, details, ts: Date.now() }),
      );
    } catch {
      /* ignore */
    }
    goSignup();
  }

  async function handleFixed() {
    if (!user) return goSignup();
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
    if (!user) return stashAndSignup();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug, brief: buildBrief() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      router.push(`/dashboard/orders/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  const busy = loading || authLoading;

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
        {isFixed ? (
          <>
            <Button
              onClick={handleFixed}
              size="lg"
              className="w-full"
              disabled={busy}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {es ? "Solicitar y pagar" : "Request & pay"}
            </Button>
            {!user && !authLoading && (
              <p className="mt-3 text-center text-xs text-fg-faint">
                {es
                  ? "Crea tu cuenta gratis en segundos para pagar de forma segura."
                  : "Create your free account in seconds to pay securely."}
              </p>
            )}
            <TrustList items={TRUST_FIXED} lang={lang} />
          </>
        ) : showBrief ? (
          <div className="space-y-5">
            <p className="text-sm text-fg-dim">
              {es
                ? "Responde unas preguntas rápidas para darte una cotización precisa."
                : "Answer a few quick questions so we can quote you accurately."}
            </p>

            {/* Giro del negocio */}
            <div>
              <label
                htmlFor="businessType"
                className="mb-1.5 block text-sm font-medium text-fg-muted"
              >
                {es ? "¿A qué se dedica tu negocio?" : "What does your business do?"}
              </label>
              <input
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder={es ? "Ej. Cafetería, consultorio, tienda de ropa…" : "e.g. Café, clinic, clothing store…"}
                className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-orange"
              />
            </div>

            {/* Preguntas de chips */}
            {QUESTIONS.map((q) => {
              const selected = answers[q.key] ?? [];
              return (
                <div key={q.key}>
                  <p className="mb-2 text-sm font-medium text-fg-muted">
                    {q[lang]}
                    {q.multi && (
                      <span className="ml-1.5 text-xs font-normal text-fg-faint">
                        {es ? "(varias)" : "(multiple)"}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const active = selected.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggle(q, opt.value)}
                          aria-pressed={active}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            active
                              ? "border-orange bg-orange/15 text-orange"
                              : "border-line bg-ink-2 text-fg-muted hover:border-line-strong hover:text-fg"
                          }`}
                        >
                          {opt[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Referencias */}
            <div>
              <label
                htmlFor="references"
                className="mb-1.5 block text-sm font-medium text-fg-muted"
              >
                {es ? "Referencias o ejemplos que te gustan" : "References or examples you like"}
                <span className="ml-1.5 text-xs font-normal text-fg-faint">
                  {es ? "(opcional)" : "(optional)"}
                </span>
              </label>
              <input
                id="references"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder={es ? "Enlaces, marcas o estilos que te inspiran" : "Links, brands or styles you like"}
                className="w-full rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-orange"
              />
            </div>

            {/* Detalles libres */}
            <div>
              <label
                htmlFor="details"
                className="mb-1.5 block text-sm font-medium text-fg-muted"
              >
                {es ? "Cuéntanos más" : "Tell us more"}
                <span className="ml-1.5 text-xs font-normal text-fg-faint">
                  {es ? "(opcional)" : "(optional)"}
                </span>
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder={
                  es
                    ? "Detalles importantes, funciones que necesitas, dudas…"
                    : "Important details, features you need, questions…"
                }
                className="w-full resize-none rounded-xl border border-line bg-ink-2 p-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-orange"
              />
            </div>

            <Button
              onClick={handleQuote}
              size="lg"
              className="w-full"
              disabled={busy || !canSend}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {es ? "Enviar solicitud" : "Send request"}
            </Button>
            {!canSend ? (
              <p className="text-center text-xs text-fg-faint">
                {es
                  ? "Elige un objetivo o cuéntanos qué necesitas para continuar."
                  : "Pick a goal or tell us what you need to continue."}
              </p>
            ) : (
              !user &&
              !authLoading && (
                <p className="text-center text-xs text-fg-faint">
                  {es
                    ? "Al enviar crearás tu cuenta gratis (20 s) para dar seguimiento. No pierdes lo que escribiste."
                    : "On send you'll create your free account (20 s) to follow up. You won't lose your answers."}
                </p>
              )
            )}
            <TrustList items={TRUST_QUOTE} lang={lang} />
          </div>
        ) : (
          <>
            <Button
              onClick={() => setShowBrief(true)}
              size="lg"
              className="w-full"
            >
              {es ? "Solicitar cotización" : "Request a quote"}
            </Button>
            <TrustList items={TRUST_QUOTE} lang={lang} />
          </>
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
