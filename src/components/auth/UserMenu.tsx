"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
  const { t } = useLanguage();
  const { user, loading } = useSupabaseUser();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setIsAdmin(data?.role === "admin"));
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg md:inline-block"
      >
        {t.nav.login}
      </Link>
    );
  }

  const label =
    (user.user_metadata?.full_name as string) ?? user.email ?? "Cuenta";
  const initial = label.charAt(0).toUpperCase();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2.5 transition-colors hover:border-line-strong"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
          {initial}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-fg-dim" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <button
              className="fixed inset-0 z-10 cursor-default"
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="glass absolute right-0 top-full z-20 mt-3 w-56 rounded-2xl p-2"
              role="menu"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium">{label}</p>
                <p className="truncate text-xs text-fg-dim">{user.email}</p>
              </div>
              <div className="my-1 h-px bg-line" />
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-glass hover:text-fg"
                role="menuitem"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t.nav.dashboard}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-glass hover:text-fg"
                  role="menuitem"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-fg-muted transition-colors hover:bg-glass hover:text-fg"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                {t.nav.logout}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
