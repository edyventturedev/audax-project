"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { navSections, type NavSectionId } from "@/data/nav";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { NavIcon } from "./navIcons";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

export function Navbar() {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<NavSectionId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Desktop hover: pequeño retardo al salir para poder cruzar al panel.
  const openDesktop = (id: NavSectionId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenSection(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSection(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeSection = navSections.find((s) => s.id === openSection);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-[calc(1rem+var(--promo-h,0px))] z-[1000] flex justify-center px-4 transition-[top] duration-300">
        {/* Backdrop del menú móvil */}
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

        <nav
          className={cn(
            "relative w-full max-w-[1100px] rounded-full border border-line transition-[background-color] duration-300 [transform:translateZ(0)]",
            scrolled ? "bg-ink/85 backdrop-blur-xl" : "bg-ink/70 backdrop-blur-xl",
          )}
        >
          <div className="flex items-center justify-between px-4 py-2.5 sm:px-5">
            <Logo />

            {/* ---- Mega-menús (escritorio) ---- */}
            <div
              className="hidden items-center gap-1 lg:flex"
              onMouseLeave={scheduleClose}
              onMouseEnter={cancelClose}
            >
              {navSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onMouseEnter={() => openDesktop(section.id)}
                  onClick={() =>
                    setOpenSection((cur) =>
                      cur === section.id ? null : section.id,
                    )
                  }
                  aria-expanded={openSection === section.id}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-colors",
                    openSection === section.id
                      ? "text-fg"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  {section.label[lang]}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 opacity-70 transition-transform duration-200",
                      openSection === section.id && "rotate-180",
                    )}
                  />
                </button>
              ))}

              {/* Panel del mega-menú */}
              <AnimatePresence>
                {activeSection && (
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="absolute left-1/2 top-full w-[560px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3"
                  >
                    <div className="glass rounded-3xl p-3">
                      <div className="px-3 pb-2 pt-1 text-xs text-fg-dim">
                        {activeSection.tagline[lang]}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {activeSection.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenSection(null)}
                            className="group flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-glass"
                          >
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
                              <NavIcon name={item.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-fg">
                                {item.label[lang]}
                              </span>
                              <span className="mt-0.5 block text-xs text-fg-dim">
                                {item.desc[lang]}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---- Cluster derecho ---- */}
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
                  transition={{ duration: 0.2, ease: EASE_OUT }}
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

          {/* ---- Menú móvil (panel flotante) ---- */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -6 }}
                transition={{
                  duration: menuOpen ? 0.22 : 0.15,
                  ease: menuOpen ? EASE_OUT : EASE_IN,
                }}
                style={{
                  transformOrigin: "top center",
                  willChange: "transform, opacity",
                }}
                className="absolute inset-x-0 top-full mt-2 max-h-[72vh] origin-top overflow-y-auto rounded-3xl border border-line bg-ink-2 shadow-2xl lg:hidden"
              >
                <div className="flex flex-col gap-4 p-4">
                  {navSections.map((section) => (
                    <div key={section.id}>
                      <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-fg-faint">
                        {section.label[lang]}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-glass"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-soft text-orange">
                              <NavIcon name={item.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">
                                {item.label[lang]}
                              </span>
                              <span className="block truncate text-xs text-fg-dim">
                                {item.desc[lang]}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="h-px bg-line" />
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-fg-dim">{t.nav.language}</span>
                    <LanguageToggle />
                  </div>
                  <Button href="/servicios" size="lg" className="w-full">
                    {t.nav.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </MotionConfig>
  );
}
