"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

/**
 * Cada tema = un rubro con su VIDEO de fondo + un SITIO DEMO de ese rubro.
 * Para poner tus videos: guárdalos en /public/hero/ (cafe.mp4, hotel.mp4,
 * restaurante.mp4) y ya se usan solos. Mientras tanto se ve el póster.
 */
type Theme = {
  id: string;
  label: string;
  video: string; // /public/hero/xxx.mp4
  poster: string; // imagen de respaldo mientras cargas el video
  overlay: string; // degradado sobre el video (legibilidad)
  demo: DemoConfig;
};

type DemoConfig = {
  brand: string;
  url: string;
  nav: string[];
  cta: string;
  title: string;
  tagline: string;
  image: string;
  accent: string;
  pageBg: string;
  pageInk: string;
  serif?: boolean;
};

const THEMES: Theme[] = [
  {
    id: "cafe",
    label: "Cafetería",
    video: "/hero/cafe.mp4",
    poster: "https://picsum.photos/seed/audaxcafe/1600/900",
    overlay:
      "linear-gradient(180deg, rgba(20,12,6,0.55) 0%, rgba(20,12,6,0.35) 40%, rgba(10,10,10,0.9) 100%)",
    demo: {
      brand: "Café Aurora",
      url: "cafeaurora.mx",
      nav: ["Menú", "Nosotros", "Visítanos"],
      cta: "Reservar",
      title: "Tu café de\ntodos los días",
      tagline: "Grano de especialidad, tostado en casa.",
      image: "https://picsum.photos/seed/cafehero/1000/620",
      accent: "#b06a3b",
      pageBg: "#f6efe6",
      pageInk: "#2b1d14",
      serif: false,
    },
  },
  {
    id: "hotel",
    label: "Hotel",
    video: "/hero/hotel.mp4",
    poster: "https://picsum.photos/seed/audaxhotel/1600/900",
    overlay:
      "linear-gradient(180deg, rgba(6,20,26,0.55) 0%, rgba(6,20,26,0.35) 40%, rgba(10,10,10,0.9) 100%)",
    demo: {
      brand: "Hotel Marena",
      url: "hotelmarena.mx",
      nav: ["Habitaciones", "Servicios", "Ubicación"],
      cta: "Reservar estancia",
      title: "Descanso\nfrente al mar",
      tagline: "Una experiencia de lujo en cada detalle.",
      image: "https://picsum.photos/seed/hotelhero/1000/620",
      accent: "#0e7c86",
      pageBg: "#f1f6f6",
      pageInk: "#0b2530",
      serif: true,
    },
  },
  {
    id: "restaurante",
    label: "Restaurante",
    video: "/hero/restaurante.mp4",
    poster: "https://picsum.photos/seed/audaxresto/1600/900",
    overlay:
      "linear-gradient(180deg, rgba(26,10,8,0.55) 0%, rgba(26,10,8,0.35) 40%, rgba(10,10,10,0.9) 100%)",
    demo: {
      brand: "Sazón",
      url: "sazon.mx",
      nav: ["Carta", "Reservas", "Eventos"],
      cta: "Reservar mesa",
      title: "Sabores que\nse recuerdan",
      tagline: "Cocina de autor con producto local.",
      image: "https://picsum.photos/seed/restohero/1000/620",
      accent: "#c0392b",
      pageBg: "#f7efe9",
      pageInk: "#2a1512",
      serif: true,
    },
  },
];

const ROTATE_MS = 6500;

export function Hero() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const theme = THEMES[active];

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % THEMES.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [active]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-ink">
        {/* ---- Fondo: video por tema (crossfade) ---- */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={theme.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={theme.poster}
              className="h-full w-full object-cover"
            >
              <source src={theme.video} type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{ background: theme.overlay }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ---- Contenido ---- */}
        <div className="relative z-10 flex flex-1 flex-col px-6 pt-32 pb-10 sm:pt-36">
          {/* Titular Audax */}
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              {t.hero.eyebrow}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.98] tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-6xl lg:text-7xl"
            >
              {t.hero.titleA}{" "}
              <span className="bg-gradient-to-r from-orange to-orange-mid bg-clip-text text-transparent">
                {t.hero.titleB}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 text-balance sm:text-lg"
            >
              {t.hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button href="/servicios" size="lg" className="w-full sm:w-auto">
                {t.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a
                href="/#how"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>
          </div>

          {/* Rubro activo (pestañas) */}
          <div className="mx-auto mt-12 flex items-center gap-2 sm:mt-14">
            {THEMES.map((th, i) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setActive(i)}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  i === active
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {i === active && (
                  <motion.span
                    layoutId="theme-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm"
                  />
                )}
                {th.label}
              </button>
            ))}
          </div>

          {/* Sitio demo del rubro */}
          <div className="mx-auto mt-6 w-full max-w-[680px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <DemoSite demo={theme.demo} />
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-center text-xs text-white/50">
              Un ejemplo de lo que creamos para cada tipo de negocio.
            </p>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

/** Mockup de un mini-sitio dentro de un marco de navegador. */
function DemoSite({ demo }: { demo: DemoConfig }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
      {/* Barra del navegador */}
      <div className="flex items-center gap-1.5 bg-[#e9e4dd] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-black/10 px-2.5 py-1 text-[11px] text-black/50">
          {demo.url}
        </span>
      </div>

      {/* El "sitio" */}
      <div style={{ background: demo.pageBg, color: demo.pageInk }}>
        {/* Nav del sitio demo */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5">
          <span
            className="text-sm font-bold sm:text-base"
            style={{ fontFamily: demo.serif ? "Georgia, serif" : "inherit" }}
          >
            {demo.brand}
          </span>
          <div className="hidden items-center gap-4 text-xs sm:flex">
            {demo.nav.map((n) => (
              <span key={n} style={{ opacity: 0.7 }}>
                {n}
              </span>
            ))}
          </div>
          <span
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
            style={{ background: demo.accent }}
          >
            {demo.cta}
          </span>
        </div>

        {/* Hero del sitio demo */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={demo.image}
            alt={`Sitio web demo de ${demo.brand}`}
            width={1000}
            height={620}
            className="aspect-[5/3] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <h3
              className="whitespace-pre-line text-2xl font-extrabold leading-none text-white sm:text-3xl"
              style={{ fontFamily: demo.serif ? "Georgia, serif" : "inherit" }}
            >
              {demo.title}
            </h3>
            <p className="mt-2 text-xs text-white/85 sm:text-sm">
              {demo.tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
