"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  HelpCircle,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { cn } from "@/lib/cn";

export function MobileTabBar() {
  const { t, lang } = useLanguage();
  const { user } = useSupabaseUser();
  const pathname = usePathname();
  const es = lang === "es";

  const tabs = [
    { href: "/", label: t.nav.home, icon: Home, match: (p: string) => p === "/" },
    {
      href: "/servicios",
      label: t.nav.services,
      icon: LayoutGrid,
      match: (p: string) => p.startsWith("/servicios"),
    },
    {
      href: "/#how",
      label: es ? "Cómo va" : "How",
      icon: HelpCircle,
      match: () => false,
    },
    user
      ? {
          href: "/dashboard",
          label: t.nav.dashboard,
          icon: LayoutDashboard,
          match: (p: string) => p.startsWith("/dashboard"),
        }
      : {
          href: "/login",
          label: t.nav.login,
          icon: LogIn,
          match: (p: string) => p.startsWith("/login"),
        },
  ];

  return (
    <nav
      aria-label={es ? "Navegación" : "Navigation"}
      className="fixed inset-x-3 z-[900] lg:hidden"
      style={{ bottom: "calc(0.6rem + env(safe-area-inset-bottom))" }}
    >
      <ul className="flex items-stretch justify-around gap-1 rounded-[26px] border border-line bg-ink/80 p-1.5 backdrop-blur-2xl">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-[20px] px-1 py-2 transition-colors",
                  active
                    ? "bg-orange-soft text-orange"
                    : "text-fg-dim hover:text-fg",
                )}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                <span className="text-[10px] font-medium leading-none">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
