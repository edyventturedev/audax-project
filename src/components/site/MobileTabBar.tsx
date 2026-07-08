"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Home, LogIn, UserRound } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { navSections, type NavSectionId } from "@/data/nav";
import { NavIcon } from "./navIcons";
import { cn } from "@/lib/cn";

/**
 * Barra inferior iOS (solo teléfonos/tablets).
 * Inicio y Perfil navegan; Productos/Soluciones/Recursos abren una hoja
 * inferior con sus opciones (bottom sheet), para llegar fácil a todo.
 */
export function MobileTabBar() {
  const { t, lang } = useLanguage();
  const { user } = useSupabaseUser();
  const pathname = usePathname();
  const [sheet, setSheet] = useState<NavSectionId | null>(null);

  // Cierra la hoja al cambiar de ruta y bloquea el scroll de fondo.
  useEffect(() => setSheet(null), [pathname]);
  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const onAccount =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");
  const onHome = pathname === "/" && !sheet;

  const activeSheet = navSections.find((s) => s.id === sheet);

  return (
    <MotionConfig reducedMotion="user">
      {/* Hoja inferior + backdrop */}
      <AnimatePresence>
        {activeSheet && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSheet(null)}
              aria-label="Cerrar"
              className="fixed inset-0 z-[950] bg-ink/70 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-[960] rounded-t-3xl border-t border-line bg-ink-2 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden"
              role="dialog"
              aria-label={activeSheet.label[lang]}
            >
              <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/20" />
              <div className="px-4 pt-3">
                <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-fg-faint">
                  {activeSheet.label[lang]}
                </p>
                <div className="flex flex-col gap-0.5">
                  {activeSheet.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSheet(null)}
                      className="flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors active:bg-glass"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
                        <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Barra inferior */}
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-3 z-[900] lg:hidden"
        style={{ bottom: "calc(0.6rem + env(safe-area-inset-bottom))" }}
      >
        <ul className="flex items-stretch gap-0.5 rounded-[26px] border border-line bg-ink/92 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md [transform:translateZ(0)]">
          <TabButton
            active={onHome}
            label={t.nav.home}
            onClick={() => {
              setSheet(null);
              if (pathname === "/")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            href="/"
            icon={<Home className="h-[21px] w-[21px]" />}
          />

          {navSections.map((section) => (
            <TabButton
              key={section.id}
              active={sheet === section.id}
              label={section.label[lang]}
              onClick={() =>
                setSheet((cur) => (cur === section.id ? null : section.id))
              }
              icon={
                <NavIcon name={section.icon} className="h-[21px] w-[21px]" />
              }
            />
          ))}

          <TabButton
            active={onAccount}
            label={user ? t.nav.profile : t.nav.enter}
            onClick={() => setSheet(null)}
            href={user ? "/dashboard" : "/login"}
            icon={
              user ? (
                <UserRound className="h-[21px] w-[21px]" />
              ) : (
                <LogIn className="h-[21px] w-[21px]" />
              )
            }
          />
        </ul>
      </nav>
    </MotionConfig>
  );
}

function TabButton({
  active,
  label,
  icon,
  href,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <motion.span
      whileTap={{ scale: 0.86 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={cn(
        "relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] px-1 transition-colors duration-200",
        active ? "bg-orange-soft text-orange" : "text-fg-dim",
      )}
    >
      {icon}
      <span className="max-w-full truncate text-[10px] font-medium leading-none">
        {label}
      </span>
    </motion.span>
  );

  return (
    <li className="min-w-0 flex-1">
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          aria-current={active ? "page" : undefined}
          className="block"
        >
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={active}
          className="block w-full"
        >
          {inner}
        </button>
      )}
    </li>
  );
}
