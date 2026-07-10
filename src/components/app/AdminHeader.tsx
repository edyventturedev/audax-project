"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { UserMenu } from "@/components/auth/UserMenu";
import { cn } from "@/lib/cn";

export function AdminHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-soft px-2.5 py-1 text-xs font-semibold text-orange">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </span>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/admin"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                pathname === "/admin"
                  ? "bg-glass text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              Pedidos
            </Link>
            <Link
              href="/admin/codigos"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                pathname === "/admin/codigos"
                  ? "bg-glass text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              Códigos
            </Link>
            <Link
              href="/admin/blog"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                pathname.startsWith("/admin/blog")
                  ? "bg-glass text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              Blog
            </Link>
          </nav>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
