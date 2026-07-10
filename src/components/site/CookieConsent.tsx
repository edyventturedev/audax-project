"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const CONSENT_KEY = "audax:cookie-consent"; // "all" | "essential"

type Consented = { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };

/**
 * Banner de consentimiento de cookies (estilo iOS, cerrable).
 * "Aceptar" activa la analítica (Google Consent Mode + Meta consent);
 * "Solo necesarias" la deja desactivada. La elección se recuerda.
 */
export function CookieConsent() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  function store(value: "all" | "essential") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  function acceptAll() {
    const w = window as unknown as Consented;
    if (typeof w.gtag === "function") {
      w.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    if (typeof w.fbq === "function") w.fbq("consent", "grant");
    store("all");
  }

  function essentialOnly() {
    store("essential");
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            role="dialog"
            aria-label={es ? "Aviso de cookies" : "Cookie notice"}
            className="fixed left-1/2 z-[940] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-line bg-ink-2/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:bottom-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
                <Cookie className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg">
                  {es ? "Usamos cookies" : "We use cookies"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                  {es
                    ? "Usamos cookies necesarias para que el sitio funcione y, con tu permiso, cookies de analítica para mejorar la experiencia."
                    : "We use necessary cookies to run the site and, with your permission, analytics cookies to improve your experience."}{" "}
                  <Link
                    href="/aviso-de-privacidad"
                    className="text-orange underline hover:no-underline"
                  >
                    {es ? "Más información" : "Learn more"}
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={essentialOnly}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-glass hover:text-fg"
              >
                {es ? "Solo necesarias" : "Only necessary"}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid"
              >
                {es ? "Aceptar" : "Accept"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
