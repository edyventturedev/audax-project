"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const iconMap = { Palette, Code2, Camera, Package };

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

  return (
    <header className="fixed inset-x-0 top-4 z-[1000] flex justify-center px-4">
      <nav
        className={cn(
          "flex w-full max-w-[1100px] items-center justify-between rounded-full border border-line px-4 py-2.5 backdrop-blur-2xl transition-colors sm:px-5",
          scrolled ? "bg-ink/85" : "bg-ink/60",
        )}
      >
        <Logo />

        {/* Desktop links */}
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

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg md:inline-block"
          >
            {t.nav.login}
          </Link>
          <Button href="/servicios" size="sm" className="hidden md:inline-flex">
            {t.nav.cta}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-fg lg:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 z-[-1] lg:hidden"
          >
            <button
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-4 top-24 rounded-3xl border border-line bg-ink-2 p-4"
            >
              <div className="flex flex-col gap-1">
                {categories.map((c) => {
                  const Icon = iconMap[c.icon as keyof typeof iconMap];
                  return (
                    <Link
                      key={c.slug}
                      href={`/servicios/${c.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-glass"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-soft text-orange">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{c.name[lang]}</span>
                    </Link>
                  );
                })}
                <div className="my-2 h-px bg-line" />
                <Link
                  href="/#how"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-fg-muted hover:bg-glass"
                >
                  {t.nav.process}
                </Link>
                <Link
                  href="/#why"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-fg-muted hover:bg-glass"
                >
                  {t.nav.why}
                </Link>
                <div className="my-2 h-px bg-line" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-fg-dim">{t.nav.language}</span>
                  <LanguageToggle />
                </div>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-fg-muted hover:bg-glass"
                >
                  {t.nav.login}
                </Link>
                <Button
                  href="/servicios"
                  size="lg"
                  className="mt-1 w-full"
                >
                  {t.nav.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
