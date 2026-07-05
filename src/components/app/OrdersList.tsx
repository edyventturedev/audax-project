"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageOpen, Plus, ArrowUpRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatCentsMXN, type OrderRow } from "@/lib/orders";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/Button";

export function OrdersList() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const es = lang === "es";

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("orders")
        .select(
          "id, service_name, category, pricing_type, status, amount_total, currency, brief, created_at",
        )
        .order("created_at", { ascending: false });
      if (active) {
        setOrders((data as OrderRow[]) ?? []);
        setLoading(false);
      }
    }
    load();

    // Realtime: refrescar al cambiar cualquier pedido del usuario.
    const channel = supabase
      .channel("orders-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => load(),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-10 flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-ink-3/50 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-soft text-orange">
          <PackageOpen className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-lg font-semibold">
          {es ? "Aún no tienes proyectos" : "No projects yet"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-fg-dim">
          {es
            ? "Explora el catálogo, solicita un servicio y aquí podrás seguir cada etapa."
            : "Browse the catalog, request a service and track every stage here."}
        </p>
        <Button href="/servicios" size="lg" className="mt-6">
          <Plus className="h-4 w-4" />
          {es ? "Solicitar un servicio" : "Request a service"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {orders.map((o) => (
        <Link
          key={o.id}
          href={`/dashboard/orders/${o.id}`}
          className="group flex items-center justify-between rounded-2xl border border-line bg-ink-3 p-5 transition-colors hover:border-line-strong"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="truncate font-semibold">{o.service_name}</h3>
              <StatusBadge status={o.status} />
            </div>
            <p className="mt-1 text-sm text-fg-dim">
              {new Date(o.created_at).toLocaleDateString(
                es ? "es-MX" : "en-US",
                { day: "numeric", month: "long", year: "numeric" },
              )}
              {o.amount_total != null && (
                <> · {formatCentsMXN(o.amount_total)}</>
              )}
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-fg-dim transition-colors group-hover:text-orange" />
        </Link>
      ))}
    </div>
  );
}
