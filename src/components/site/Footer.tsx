"use client";

import Link from "next/link";
import { Mail, AtSign, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { categories } from "@/data/services";
import { navSections } from "@/data/nav";
import { Logo } from "./Logo";

export function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-ink">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-fg-dim">{t.footer.tagline}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-fg-dim">
            <MapPin className="h-4 w-4" /> Mérida, Yucatán · MX
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
            {t.nav.services}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/servicios/${c.slug}`}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {c.name[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
            {navSections.find((s) => s.id === "recursos")?.label[lang]}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {navSections
              .find((s) => s.id === "recursos")
              ?.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label[lang]}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
            Audax
          </h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/#how" className="text-sm text-fg-muted hover:text-fg">
                {t.nav.process}
              </Link>
            </li>
            <li>
              <Link href="/#why" className="text-sm text-fg-muted hover:text-fg">
                {t.nav.why}
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-sm text-fg-muted hover:text-fg">
                {t.nav.login}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
            {t.footer.contact}
          </h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href="mailto:audaxcreativeproject@gmail.com"
                className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
              >
                <Mail className="h-4 w-4" /> Correo
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/audaxproject"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
              >
                <AtSign className="h-4 w-4" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-fg-faint sm:flex-row">
          <span>
            © {year} Audax Project. {t.footer.rights}
          </span>
          <nav className="flex items-center gap-4">
            <Link href="/aviso-de-privacidad" className="hover:text-fg">
              {lang === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
            </Link>
            <Link href="/terminos" className="hover:text-fg">
              {lang === "es" ? "Términos" : "Terms"}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
