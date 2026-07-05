"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  STATUS_META,
  formatCentsMXN,
  type Milestone,
  type MilestoneStatus,
  type OrderStatus,
} from "@/lib/orders";
import { StatusBadge } from "./StatusBadge";
import { OrderMessages } from "./OrderMessages";
import { DeliverablesPanel } from "./DeliverablesPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type AdminOrder = {
  id: string;
  service_name: string;
  status: OrderStatus;
  amount_total: number | null;
  pricing_type: string;
  brief: string | null;
  created_at: string;
  profiles: { full_name: string | null; phone: string | null } | null;
};

const NEXT_STATUSES: OrderStatus[] = [
  "in_progress",
  "review",
  "delivered",
  "cancelled",
];

export function AdminOrderManager({
  orderId,
  adminId,
}: {
  orderId: string;
  adminId: string;
}) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [savingQuote, setSavingQuote] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");

  const supabase = createClient();

  async function load() {
    const [{ data: o }, { data: m }] = await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, service_name, status, amount_total, pricing_type, brief, created_at, profiles(full_name, phone)",
        )
        .eq("id", orderId)
        .maybeSingle(),
      supabase
        .from("order_milestones")
        .select("id, title, description, status, position")
        .eq("order_id", orderId)
        .order("position"),
    ]);
    setOrder((o as unknown as AdminOrder) ?? null);
    setMilestones((m as Milestone[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function sendQuote() {
    const pesos = parseInt(quoteAmount, 10);
    if (!pesos || pesos <= 0) return;
    setSavingQuote(true);
    await supabase
      .from("orders")
      .update({ amount_total: pesos * 100, status: "quoted" })
      .eq("id", orderId);
    setSavingQuote(false);
    setQuoteAmount("");
    load();
  }

  async function setStatus(status: OrderStatus) {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    load();
  }

  async function setMilestoneStatus(id: string, status: MilestoneStatus) {
    await supabase.from("order_milestones").update({ status }).eq("id", id);
    load();
  }

  async function addMilestone() {
    const title = newMilestone.trim();
    if (!title) return;
    await supabase.from("order_milestones").insert({
      order_id: orderId,
      title,
      status: "pending",
      position: milestones.length,
    });
    setNewMilestone("");
    load();
  }

  if (loading)
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
      </div>
    );

  if (!order)
    return (
      <p className="py-24 text-center text-fg-dim">Pedido no encontrado.</p>
    );

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Pedidos
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
          {order.service_name}
        </h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-sm text-fg-dim">
        {order.profiles?.full_name ?? "Cliente"}
        {order.profiles?.phone && <> · {order.profiles.phone}</>} ·{" "}
        {order.amount_total != null ? formatCentsMXN(order.amount_total) : "sin precio"}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {order.brief && (
            <div className="rounded-3xl border border-line bg-ink-3 p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-faint">
                Brief del cliente
              </h3>
              <p className="whitespace-pre-wrap text-sm text-fg-muted">
                {order.brief}
              </p>
            </div>
          )}

          {/* Cotización */}
          {order.status === "pending_quote" && (
            <div className="rounded-3xl border border-orange/30 bg-orange-soft p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-orange">
                Enviar cotización
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-dim">
                    $
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="Monto en MXN"
                    className="w-full rounded-xl border border-line bg-ink-2 py-3 pl-7 pr-3 text-sm outline-none focus:border-orange"
                  />
                </div>
                <Button onClick={sendQuote} disabled={savingQuote}>
                  {savingQuote ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Enviar
                </Button>
              </div>
              <p className="mt-2 text-xs text-fg-muted">
                El cliente verá el precio y podrá pagar con un clic.
              </p>
            </div>
          )}

          {/* Estado */}
          <div className="rounded-3xl border border-line bg-ink-3 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-faint">
              Cambiar estado
            </h3>
            <div className="flex flex-wrap gap-2">
              {NEXT_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  disabled={order.status === s}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    order.status === s
                      ? "border-orange bg-orange text-white"
                      : "border-line text-fg-muted hover:text-fg",
                  )}
                >
                  {STATUS_META[s].es}
                </button>
              ))}
            </div>
          </div>

          {/* Hitos */}
          <div className="rounded-3xl border border-line bg-ink-3 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-faint">
              Hitos de progreso
            </h3>
            <ul className="space-y-2">
              {milestones.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-2 p-3"
                >
                  <span className="truncate text-sm">{m.title}</span>
                  <select
                    value={m.status}
                    onChange={(e) =>
                      setMilestoneStatus(m.id, e.target.value as MilestoneStatus)
                    }
                    className="rounded-lg border border-line bg-ink px-2 py-1 text-xs outline-none focus:border-orange"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="active">Activo</option>
                    <option value="done">Hecho</option>
                  </select>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="Nuevo hito…"
                className="flex-1 rounded-xl border border-line bg-ink-2 px-3 py-2 text-sm outline-none focus:border-orange"
              />
              <button
                onClick={addMilestone}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange text-white transition-colors hover:bg-orange-mid"
                aria-label="Agregar hito"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-ink-3 p-6">
            <DeliverablesPanel orderId={orderId} canUpload />
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-ink-3 p-6">
          <OrderMessages orderId={orderId} currentUserId={adminId} />
        </div>
      </div>
    </div>
  );
}
