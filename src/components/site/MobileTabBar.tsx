"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import { Home, LayoutGrid, ListChecks, LogIn, UserRound } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { cn } from "@/lib/cn";

type TabKey = "home" | "services" | "how" | "account";

/**
 * iOS-style bottom tab bar (phones/tablets only).
 * The active pill slides between tabs with a spring (shared layout animation).
 */
export function MobileTabBar() {
  const { t } = useLanguage();
  const { user } = useSupabaseUser();
  const pathname = usePathname();
  const [howInView, setHowInView] = useState(false);

  // Scroll-spy: "Proceso" only activates while the #how section is on screen.
  // This also fixes "Inicio" staying selected after tapping "Cómo funciona".
  useEffect(() => {
    if (pathname !== "/") {
      setHowInView(false);
      return;
    }
    const section = document.getElementById("how");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHowInView(entry.isIntersecting),
      // Active while the section crosses the middle band of the viewport.
      { rootMargin: "-40% 0px -50% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  const active: TabKey = pathname.startsWith("/servicios")
    ? "services"
    : pathname.startsWith("/dashboard") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup")
      ? "account"
      : howInView
        ? "how"
        : "home";

  const tabs = [
    { key: "home" as TabKey, href: "/", label: t.nav.home, icon: Home },
    {
      key: "services" as TabKey,
      href: "/servicios",
      label: t.nav.services,
      icon: LayoutGrid,
    },
    {
      key: "how" as TabKey,
      href: "/#how",
      label: t.nav.process,
      icon: ListChecks,
    },
    user
      ? {
          key: "account" as TabKey,
          href: "/dashboard",
          label: t.nav.profile,
          icon: UserRound,
        }
      : {
          key: "account" as TabKey,
          href: "/login",
          label: t.nav.enter,
          icon: LogIn,
        },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-3 z-[900] lg:hidden"
        style={{ bottom: "calc(0.6rem + env(safe-area-inset-bottom))" }}
      >
        <ul className="flex items-stretch gap-1 rounded-[26px] border border-line bg-ink/85 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === active;
            return (
              <li key={tab.key} className="min-w-0 flex-1">
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    // Tapping "Inicio" while already home scrolls back to top.
                    if (tab.key === "home" && pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="relative block"
                >
                  {isActive && (
                    <motion.span
                      layoutId="tabbar-active-pill"
                      className="absolute inset-0 rounded-[20px] bg-orange-soft"
                      transition={{
                        type: "spring",
                        stiffness: 480,
                        damping: 38,
                      }}
                    />
                  )}
                  <motion.span
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    className={cn(
                      "relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] px-1 transition-colors duration-200",
                      isActive ? "text-orange" : "text-fg-dim",
                    )}
                  >
                    <Icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                    <span className="max-w-full truncate text-[10px] font-medium leading-none">
                      {tab.label}
                    </span>
                  </motion.span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
