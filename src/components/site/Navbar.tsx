"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Palette,
  Code2,
  Camera,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { categories } from "@/data/services";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const iconMap = { Palette, Code2, Camera, Package };

// Spring compartido: da el "morph" fluido tipo Dynamic Island.
const ISLAND_SPRING = { type: "spring" as const, stiffness: 380, damping: 34 };

export function Navbar() {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-4 z-[1000] flex justify-center px-4">
        {/* Backdrop (detrás de la isla) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              aria-label="Cerrar menú"
              className="fixed inset-0 top-0 -z-10 bg-ink/70 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* La isla */}
        <motion.nav
          initial={false}
          animate={{ borderRadius: menuOpen ? 28 : 999 }}
          transition={ISLAND_SPRING}
          // Al abrir usamos fondo SÓLIDO sin backdrop-blur: animar un
          // backdrop-filter en iOS es lo que causa el "tirón". El blur solo
          // se aplica en estado compacto (estático, sin costo por frame).
          className={cn(
            "relative w-full max-w-[1100px] border border-line transition-[background-color] duration-300 [transform:translateZ(0)]",
            menuOpen
              ? "bg-ink-2"
              : scrolled
                ? "bg-ink/85 backdrop-blur-xl"
                : "bg-ink/70 backdrop-blur-xl",
          )}
        >
          {/* Fila superior (siempre visible) */}
          <div className="flex items-center justify-between px-4 py-2.5 sm:px-5">
            <Logo />

            {/* Enlaces escritorio */}
            <div className="hidden items-center gap-1 lg:flex">
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href="/servicios"
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {t.nav.services}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Link>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full w-72 pt-3"
                    >
                      <div className="glass rounded-2xl p-2">
                        {categories.map((c) => {
                          const Icon = iconMap[c.icon as keyof typeof iconMap];
                          return (
                            <Link
                              key={c.slug}
                              href={`/servicios/${c.slug}`}
                              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-glass"
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-soft text-orange">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span>
                                <span className="block text-sm font-medium text-fg">
                                  {c.name[lang]}
                                </span>
                                <span className="mt-0.5 block text-xs text-fg-dim">
                                  {c.tagline[lang]}
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/#how"
                className="rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {t.nav.process}
              </Link>
              <Link
                href="/#why"
                className="rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {t.nav.why}
              </Link>
            </div>

            {/* Cluster derecho */}
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 lg:flex">
                <LanguageToggle />
                <Button href="/servicios" size="sm">
                  {t.nav.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <UserMenu />
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-fg lg:hidden"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
              >
                <motion.span
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={ISLAND_SPRING}
                  className="flex"
                >
                  {menuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.span>
              </button>
            </div>
          </div>

          {/* Menú móvil que crece DESDE la isla (Dynamic Island) */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                key="island-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: ISLAND_SPRING,
                  opacity: { duration: 0.2 },
                }}
                className="overflow-hidden lg:hidden"
              >
                <motion.div
                  variants={{
                    open: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
                    closed: {},
                  }}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex flex-col gap-1 px-3 pb-3 pt-1"
                >
                  {categories.map((c) => {
                    const Icon = iconMap[c.icon as keyof typeof iconMap];
                    return (
                      <MenuRow key={c.slug}>
                        <Link
                          href={`/servicios/${c.slug}`}
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-glass"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-soft text-orange">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium">
                            {c.name[lang]}
                          </span>
                        </Link>
                      </MenuRow>
                    );
                  })}

                  <MenuRow>
                    <div className="my-1 h-px bg-line" />
                  </MenuRow>
                  <MenuRow>
                    <Link
                      href="/#how"
                      onClick={closeMenu}
                      className="block rounded-xl px-3 py-3 text-sm text-fg-muted hover:bg-glass"
                    >
                      {t.nav.process}
                    </Link>
                  </MenuRow>
                  <MenuRow>
                    <Link
                      href="/#why"
                      onClick={closeMenu}
                      className="block rounded-xl px-3 py-3 text-sm text-fg-muted hover:bg-glass"
                    >
                      {t.nav.why}
                    </Link>
                  </MenuRow>
                  <MenuRow>
                    <div className="my-1 h-px bg-line" />
                  </MenuRow>
                  <MenuRow>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm text-fg-dim">
                        {t.nav.language}
                      </span>
                      <LanguageToggle />
                    </div>
                  </MenuRow>
                  <MenuRow>
                    <Button href="/servicios" size="lg" className="mt-1 w-full">
                      {t.nav.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </MenuRow>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </MotionConfig>
  );
}

function MenuRow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        closed: { opacity: 0, y: -8 },
        open: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
