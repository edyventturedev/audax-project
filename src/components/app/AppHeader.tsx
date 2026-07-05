"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/cn";

export function AppHeader() {
  const { t, lang } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/servicios", label: lang === "es" ? "Solicitar" : "Request" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  pathname === l.href
                    ? "bg-glass text-fg"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
