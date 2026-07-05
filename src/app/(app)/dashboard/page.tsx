"use client";

import Link from "next/link";
import { PackageOpen, Plus, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { lang } = useLanguage();
  const { user } = useSupabaseUser();

  const name =
    (user?.user_metadata?.full_name as string)?.split(" ")[0] ??
    (lang === "es" ? "de nuevo" : "back");

  return (
    <div>
      {!isSupabaseConfigured && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-fg-muted">
            {lang === "es"
              ? "Supabase aún no está configurado. Añade tus claves en .env.local para activar el inicio de sesión y los proyectos."
              : "Supabase isn't configured yet. Add your keys to .env.local to enable sign-in and projects."}
          </p>
        </div>
      )}

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
        {lang === "es" ? `Hola, ${name}` : `Hi, ${name}`}
      </h1>
      <p className="mt-2 text-fg-muted">
        {lang === "es"
          ? "Aquí verás el progreso de tus proyectos."
          : "Here you'll see the progress of your projects."}
      </p>

      {/* Empty state (orders arrive in Fase 4) */}
      <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-ink-3/50 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-soft text-orange">
          <PackageOpen className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-lg font-semibold">
          {lang === "es" ? "Aún no tienes proyectos" : "No projects yet"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-fg-dim">
          {lang === "es"
            ? "Explora el catálogo, solicita un servicio y aquí podrás seguir cada etapa."
            : "Browse the catalog, request a service and track every stage here."}
        </p>
        <Button href="/servicios" size="lg" className="mt-6">
          <Plus className="h-4 w-4" />
          {lang === "es" ? "Solicitar un servicio" : "Request a service"}
        </Button>
      </div>
    </div>
  );
}
