"use client";

import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { OrdersList } from "@/components/app/OrdersList";

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

      <OrdersList />
    </div>
  );
}
