"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-line p-0.5 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors",
            lang === l ? "text-white" : "text-fg-dim hover:text-fg",
          )}
        >
          {l}
          {lang === l && (
            <span className="absolute inset-0 -z-10 rounded-full bg-orange" />
          )}
        </button>
      ))}
    </div>
  );
}
