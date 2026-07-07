"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "120+", key: "stat1" as const },
  { value: "7", key: "stat2" as const },
  { value: "98%", key: "stat3" as const },
];

// NOTA: estas son imágenes de RELLENO (picsum). Reemplázalas por capturas
// reales de tus proyectos: pon los archivos en /public y cambia el src a
// "/work-1.jpg", etc. Tu propio portafolio se verá mucho mejor que esto.
const WORK_MAIN = "https://picsum.photos/seed/audaxsite1/900/620";
const WORK_SIDE = "https://picsum.photos/seed/audaxsite2/560/400";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#f6f2ec] px-6 pt-36 pb-20 sm:pt-44">
      {/* Ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-15%] h-[520px] w-[620px] rounded-full opacity-70 blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,41,0.30) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] bottom-[-20%] h-[360px] w-[420px] rounded-full opacity-50 blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,180,120,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        {/* ---- Columna de texto ---- */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-xs font-medium text-ink/70 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange" />
            {t.hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
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
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/65 text-balance sm:text-lg lg:mx-0"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button href="/servicios" size="lg" className="w-full sm:w-auto">
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="/#how"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white/60 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white sm:w-auto"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4 lg:mx-0"
          >
            {stats.map((s) => (
              <div key={s.key} className="text-center lg:text-left">
                <dt className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-orange tabular-nums">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-ink/50">{t.hero[s.key]}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---- Columna visual: mockups de sitios ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[540px]"
        >
          {/* Ventana principal */}
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_80px_-24px_rgba(20,12,6,0.35)]">
            <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f3efe9] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 h-4 flex-1 rounded-full bg-black/5" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WORK_MAIN}
              alt="Ejemplo de sitio web diseñado por Audax"
              width={900}
              height={620}
              className="aspect-[3/2] w-full object-cover"
              loading="eager"
            />
          </div>

          {/* Ventana secundaria (superpuesta) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-10 -left-6 hidden w-48 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_20px_50px_-18px_rgba(20,12,6,0.4)] sm:block sm:w-56"
          >
            <div className="flex items-center gap-1 border-b border-black/5 bg-[#f3efe9] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WORK_SIDE}
              alt="Otro proyecto de diseño de Audax"
              width={560}
              height={400}
              className="aspect-[7/5] w-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Badge flotante "Entregado" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-3 top-8 flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white shadow-lg sm:-right-5"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            Proyecto entregado
          </motion.div>

          {/* Badge flotante rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-2 -bottom-6 flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-lg"
          >
            <Star className="h-4 w-4 fill-orange text-orange" />
            <span className="text-sm font-bold text-ink">4.9</span>
            <span className="text-xs text-ink/50">/ 5.0</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
