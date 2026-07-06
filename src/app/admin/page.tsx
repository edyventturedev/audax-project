"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowUpRight, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { deleteOrderCompletely } from "@/lib/deleteOrder";
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
  const [confirmingClean, setConfirmingClean] = useState(false);
  const [cleaning, setCleaning] = useState(false);

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

  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  async function cleanDelivered() {
    setCleaning(true);
    const supabase = createClient();
    const delivered = orders.filter((o) => o.status === "delivered");
    for (const o of delivered) {
      try {
        await deleteOrderCompletely(supabase, o.id);
      } catch {
        // continúa con los demás aunque uno falle
      }
    }
    setCleaning(false);
    setConfirmingClean(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            Pedidos
          </h1>
          <p className="mt-2 text-fg-muted">
            Gestiona cotizaciones, progreso y entregas.
          </p>
        </div>

        {/* Limpiar todos los entregados de una vez */}
        {deliveredCount > 0 &&
          (!confirmingClean ? (
            <button
              onClick={() => setConfirmingClean(true)}
              className="inline-flex items-center gap-2 rounded-full border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar entregados ({deliveredCount})
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-fg-muted">
                ¿Eliminar {deliveredCount} pedido
                {deliveredCount === 1 ? "" : "s"} entregado
                {deliveredCount === 1 ? "" : "s"}?
              </span>
              <button
                onClick={cleanDelivered}
                disabled={cleaning}
                className="inline-flex items-center gap-2 rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger/90 disabled:opacity-60"
              >
                {cleaning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Sí, limpiar
              </button>
              <button
                onClick={() => setConfirmingClean(false)}
                disabled={cleaning}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          ))}
      </div>

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
