"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { WELCOME_DISCOUNT_PERCENT } from "@/lib/promo";

const DISMISS_KEY = "audax:promo-dismissed";
const BAR_HEIGHT = "2.5rem"; // 40px — coincide con h-10

/**
 * Barra de aviso superior (promoción de bienvenida), cerrable.
 * Al estar visible fija la variable CSS --promo-h para que el navbar
 * flotante baje sin encimarse. La preferencia de cierre se guarda.
 */
export function AnnouncementBar() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [visible, setVisible] = useState(false);
  const pct = `${WELCOME_DISCOUNT_PERCENT}%`;

  useEffect(() => {
    const dismissed =
      typeof window !== "undefined" &&
      localStorage.getItem(DISMISS_KEY) === "1";
    if (!dismissed) {
      setVisible(true);
      document.documentElement.style.setProperty("--promo-h", BAR_HEIGHT);
    }
    return () => {
      document.documentElement.style.setProperty("--promo-h", "0px");
    };
  }, []);

  function dismiss() {
    setVisible(false);
    document.documentElement.style.setProperty("--promo-h", "0px");
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[980] flex h-10 items-center justify-center bg-gradient-to-r from-orange to-orange-mid px-11 text-white">
      <Link
        href="/servicios"
        className="flex min-w-0 items-center gap-2 text-xs font-medium sm:text-sm"
      >
        <Gift className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {es
            ? `${pct} de descuento en tu primer proyecto — en todos los servicios`
            : `${pct} off your first project — on every service`}
        </span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label={es ? "Cerrar aviso" : "Close banner"}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
