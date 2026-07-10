"use client";

import { useState } from "react";
import { Tag, Loader2, Check, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * Campo de código de descuento (para antes de pagar). Valida contra el
 * servidor (aplica la regla de "solo desde la 2ª compra") y avisa al padre
 * del código aplicado vía `onChange`.
 */
export function PromoCodeField({
  onChange,
}: {
  onChange: (code: string | null) => void;
}) {
  const { lang } = useLanguage();
  const es = lang === "es";

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function apply() {
    const value = code.trim();
    if (!value) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      const data = await res.json();
      if (data.valid) {
        setStatus("ok");
        setMessage(
          es
            ? `Código ${data.code} aplicado: −${data.percent}%`
            : `Code ${data.code} applied: −${data.percent}%`,
        );
        onChange(data.code);
      } else {
        setStatus("error");
        setMessage(data.reason ?? (es ? "Código no válido." : "Invalid code."));
        onChange(null);
      }
    } catch {
      setStatus("error");
      setMessage(es ? "No se pudo validar. Intenta de nuevo." : "Couldn't validate. Try again.");
      onChange(null);
    }
  }

  function clear() {
    setCode("");
    setStatus("idle");
    setMessage("");
    onChange(null);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
      >
        <Tag className="h-4 w-4" />
        {es ? "¿Tienes un código de descuento?" : "Have a discount code?"}
      </button>
    );
  }

  const applied = status === "ok";

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && !applied && apply()}
          disabled={applied}
          placeholder={es ? "Código promocional" : "Promo code"}
          className="flex-1 rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-sm uppercase tracking-wide text-fg outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-fg-faint focus:border-orange disabled:opacity-70"
        />
        {applied ? (
          <button
            type="button"
            onClick={clear}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors hover:text-fg"
            aria-label={es ? "Quitar código" : "Remove code"}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={apply}
            disabled={status === "loading" || !code.trim()}
            className="shrink-0 rounded-xl bg-glass px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-orange hover:text-white disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : es ? (
              "Aplicar"
            ) : (
              "Apply"
            )}
          </button>
        )}
      </div>
      {message && (
        <p
          className={`mt-2 flex items-center gap-1.5 text-xs ${
            applied ? "text-success" : "text-danger"
          }`}
        >
          {applied ? (
            <Check className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <X className="h-3.5 w-3.5 shrink-0" />
          )}
          {message}
        </p>
      )}
    </div>
  );
}
