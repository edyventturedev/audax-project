"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCentsMXN, type OrderStatus } from "@/lib/orders";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/cn";

type AdminOrder = {
  id: string;
  service_name: string;
  status: OrderStatus;
  amount_total: number | null;
  pricing_type: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "pending_quote", label: "Por cotizar" },
  { key: "quoted", label: "Cotizados" },
  { key: "paid", label: "Pagados" },
  { key: "in_progress", label: "En progreso" },
  { key: "delivered", label: "Entregados" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    async function load() {
      const { data } = await supabase
        .from("orders")
        .select(
          "id, service_name, status, amount_total, pricing_type, created_at, profiles(full_name)",
        )
        .order("created_at", { ascending: false });
      if (active) {
        setOrders((data as unknown as AdminOrder[]) ?? []);
        setLoading(false);
      }
    }
    load();
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const shown =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
        Pedidos
      </h1>
      <p className="mt-2 text-fg-muted">Gestiona cotizaciones, progreso y entregas.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "border-orange bg-orange text-white"
                : "border-line text-fg-muted hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
        </div>
      ) : shown.length === 0 ? (
        <p className="py-20 text-center text-fg-dim">Sin pedidos en esta vista.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {shown.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="group flex items-center justify-between rounded-2xl border border-line bg-ink-3 p-5 transition-colors hover:border-line-strong"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-semibold">{o.service_name}</h3>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-sm text-fg-dim">
                  {o.profiles?.full_name ?? "Cliente"} ·{" "}
                  {new Date(o.created_at).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                  })}
                  {o.amount_total != null && <> · {formatCentsMXN(o.amount_total)}</>}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-fg-dim transition-colors group-hover:text-orange" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
