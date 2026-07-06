"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/cn";

// Resorte suave tipo iOS para el deslizamiento de la píldora.
const PILL_SPRING = { type: "spring" as const, stiffness: 480, damping: 34 };

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  // layoutId único por instancia: evita que dos toggles montados a la vez
  // (navbar escritorio + menú móvil) compartan la misma píldora animada.
  const pillId = useId();

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-line p-0.5 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(["es", "en"] as const).map((l) => {
        const active = lang === l;
        return (
          <motion.button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            whileTap={{ scale: 0.9 }}
            transition={PILL_SPRING}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors duration-200",
              active ? "text-white" : "text-fg-dim hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                transition={PILL_SPRING}
                className="absolute inset-0 -z-10 rounded-full bg-orange"
              />
            )}
            <span className="relative">{l}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
