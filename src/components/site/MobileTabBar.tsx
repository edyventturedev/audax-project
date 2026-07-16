"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Home,
  LogIn,
  UserRound,
  LayoutGrid,
  MessagesSquare,
  ChevronRight,
  Newspaper,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import {
  categories,
  servicesByCategory,
  formatMXN,
  type CategorySlug,
} from "@/data/services";
import { NavIcon } from "./navIcons";
import { cn } from "@/lib/cn";

type SheetId = "productos" | "comunidad";

// Orden de aparición de las categorías dentro de "Productos".
const CATEGORY_ORDER: CategorySlug[] = ["tech", "design", "photo", "packages"];

// Recursos condensados: un solo botón que lleva al Blog y al Foro.
const COMMUNITY = [
  {
    href: "/blog",
    icon: "Newspaper",
    label: { es: "Blog", en: "Blog" },
    desc: { es: "Ideas, guías y novedades", en: "Ideas, guides & news" },
  },
  {
    href: "/foro",
    icon: "MessagesSquare",
    label: { es: "Foro", en: "Forum" },
    desc: { es: "Comunidad y preguntas", en: "Community & questions" },
  },
] as const;

/**
 * Barra inferior iOS (solo teléfonos/tablets). 4 pestañas:
 * Inicio y Perfil navegan; Productos abre el catálogo completo por categoría;
 * Comunidad abre Blog y Foro. Todo en hojas inferiores (bottom sheets).
 */
export function MobileTabBar() {
  const { t, lang } = useLanguage();
  const { user } = useSupabaseUser();
  const pathname = usePathname();
  const [sheet, setSheet] = useState<SheetId | null>(null);

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

  return (
    <MotionConfig reducedMotion="user">
      {/* Hoja inferior + backdrop */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSheet(null)}
              aria-label={lang === "es" ? "Cerrar" : "Close"}
              className="fixed inset-0 z-[950] bg-ink/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-[960] flex max-h-[82vh] flex-col rounded-t-3xl border-t border-line bg-ink-2 lg:hidden"
              role="dialog"
              aria-label={
                sheet === "productos"
                  ? lang === "es"
                    ? "Productos"
                    : "Products"
                  : lang === "es"
                    ? "Comunidad"
                    : "Community"
              }
            >
              <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/20" />

              {sheet === "productos" ? (
                <ProductosSheet lang={lang} onNavigate={() => setSheet(null)} />
              ) : (
                <ComunidadSheet lang={lang} onNavigate={() => setSheet(null)} />
              )}
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

          <TabButton
            active={sheet === "productos"}
            label={lang === "es" ? "Productos" : "Products"}
            onClick={() =>
              setSheet((cur) => (cur === "productos" ? null : "productos"))
            }
            icon={<LayoutGrid className="h-[21px] w-[21px]" />}
          />

          <TabButton
            active={sheet === "comunidad"}
            label={lang === "es" ? "Comunidad" : "Community"}
            onClick={() =>
              setSheet((cur) => (cur === "comunidad" ? null : "comunidad"))
            }
            icon={<MessagesSquare className="h-[21px] w-[21px]" />}
          />

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

/** Hoja de "Productos": todos los servicios agrupados por categoría. */
function ProductosSheet({
  lang,
  onNavigate,
}: {
  lang: "es" | "en";
  onNavigate: () => void;
}) {
  const es = lang === "es";
  const groups = CATEGORY_ORDER.map((slug) => ({
    category: categories.find((c) => c.slug === slug)!,
    items: servicesByCategory(slug),
  })).filter((g) => g.category && g.items.length > 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-5 pt-3">
        <h2 className="text-base font-semibold">
          {es ? "Nuestros servicios" : "Our services"}
        </h2>
        <Link
          href="/servicios"
          onClick={onNavigate}
          className="text-xs font-medium text-orange"
        >
          {es ? "Ver todo" : "See all"}
        </Link>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
        {groups.map(({ category, items }) => (
          <section key={category.slug}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-soft text-orange">
                <NavIcon name={category.icon} className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
                {category.name[lang]}
              </h3>
            </div>

            <ul className="overflow-hidden rounded-2xl border border-line bg-ink-3">
              {items.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/servicios/detalle/${s.slug}`}
                    onClick={onNavigate}
                    className={cn(
                      "flex min-h-[54px] items-center gap-3 px-4 py-2.5 transition-colors active:bg-glass",
                      i > 0 && "border-t border-line",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          {s.name[lang]}
                        </span>
                        {s.popular && (
                          <span className="shrink-0 rounded-full bg-orange-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange">
                            {es ? "Popular" : "Popular"}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-fg-dim">
                        {s.hidePrice ? (
                          <span className="text-fg-muted">
                            {es ? "Cotización a medida" : "Custom quote"}
                          </span>
                        ) : (
                          <>
                            {es ? "Desde" : "From"}{" "}
                            <span className="tabular-nums text-fg-muted">
                              {formatMXN(s.priceMin)}
                            </span>
                            {s.unit ? ` ${s.unit[lang]}` : ""}
                          </>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-fg-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Hoja de "Comunidad": Blog y Foro. */
function ComunidadSheet({
  lang,
  onNavigate,
}: {
  lang: "es" | "en";
  onNavigate: () => void;
}) {
  const es = lang === "es";
  return (
    <div className="px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Newspaper className="h-4 w-4 text-orange" />
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
          {es ? "Comunidad y recursos" : "Community & resources"}
        </p>
      </div>
      <div className="flex flex-col gap-0.5">
        {COMMUNITY.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors active:bg-glass"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
              <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                {item.label[lang]}
              </span>
              <span className="block truncate text-xs text-fg-dim">
                {item.desc[lang]}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-fg-faint" />
          </Link>
        ))}
      </div>
    </div>
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
