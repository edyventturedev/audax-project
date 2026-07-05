"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "120+", key: "stat1" as const },
  { value: "7", key: "stat2" as const },
  { value: "98%", key: "stat3" as const },
];

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden px-6 pt-40 pb-20 sm:pt-48">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,41,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-glass px-4 py-1.5 text-xs font-medium text-fg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange" />
          {t.hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl"
        >
          {t.hero.titleA}
          <br />
          <span className="bg-gradient-to-r from-orange to-orange-mid bg-clip-text text-transparent">
            {t.hero.titleB}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-fg-muted text-balance sm:text-lg"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/servicios" size="lg" className="w-full sm:w-auto">
            {t.hero.ctaPrimary}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            href="/#how"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            {t.hero.ctaSecondary}
          </Button>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div key={s.key} className="text-center">
              <dt className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-orange tabular-nums">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs text-fg-dim">{t.hero[s.key]}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
