"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Code2, Camera, Package, LayoutGrid } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { categories } from "@/data/services";
import { cn } from "@/lib/cn";

const iconMap = { Palette, Code2, Camera, Package };

export function CatalogHeader({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  const { lang, t } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="px-6 pt-36 sm:pt-40">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {sub && <p className="mt-3 max-w-xl text-fg-muted">{sub}</p>}

        {/* Category filter chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Chip href="/servicios" active={pathname === "/servicios"} icon={LayoutGrid}>
            {lang === "es" ? "Todos" : "All"}
          </Chip>
          {categories.map((c) => {
            const Icon = iconMap[c.icon as keyof typeof iconMap];
            return (
              <Chip
                key={c.slug}
                href={`/servicios/${c.slug}`}
                active={pathname === `/servicios/${c.slug}`}
                icon={Icon}
              >
                {c.name[lang]}
              </Chip>
            );
          })}
        </div>
        <p className="sr-only">{t.services.sub}</p>
      </div>
    </div>
  );
}

function Chip({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-orange bg-orange text-white"
          : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
