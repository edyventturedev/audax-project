"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import {
  formatCentsMXN,
  type Milestone,
  type OrderRow,
  type OrderStatus,
} from "@/lib/orders";
import { StatusBadge } from "./StatusBadge";
import { MilestoneTimeline } from "./MilestoneTimeline";
import { OrderMessages } from "./OrderMessages";
import { DeliverablesPanel } from "./DeliverablesPanel";
import { PromoCodeField } from "@/components/service/PromoCodeField";
import { Button } from "@/components/ui/Button";

export function OrderDetail({
  orderId,
  userId,
}: {
  orderId: string;
  userId: string;
}) {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "1";
  const es = lang === "es";

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const [{ data: o }, { data: m }] = await Promise.all([
        supabase
          .from("orders")
          .select(
            "id, service_name, category, pricing_type, status, amount_total, currency, brief, created_at",
          )
          .eq("id", orderId)
          .maybeSingle(),
        supabase
          .from("order_milestones")
          .select("id, title, description, status, position")
          .eq("order_id", orderId),
      ]);
      if (!active) return;
      if (!o) setNotFound(true);
      setOrder((o as OrderRow) ?? null);
      setMilestones((m as Milestone[]) ?? []);
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        () => load(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_milestones",
          filter: `order_id=eq.${orderId}`,
        },
        () => load(),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  async function payNow() {
    setPaying(true);
    const res = await fetch("/api/stripe/pay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, promoCode }),
    });
    const data = await res.json();
    if (res.ok && data.url) window.location.href = data.url;
    else setPaying(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-fg-dim" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="py-24 text-center">
        <p className="text-fg-dim">
          {es ? "Pedido no encontrado." : "Order not found."}
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-orange hover:underline">
          {es ? "Volver al panel" : "Back to dashboard"}
        </Link>
      </div>
    );
  }

  const canPay =
    (order.status as OrderStatus) === "quoted" && order.amount_total != null;
  const isPaid = (
    ["paid", "in_progress", "review", "delivered"] as OrderStatus[]
  ).includes(order.status);

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        {es ? "Mis proyectos" : "My projects"}
      </Link>

      {justPaid && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {es
            ? "¡Pago recibido! Estamos arrancando tu proyecto."
            : "Payment received! We're kicking off your project."}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
          {order.service_name}
        </h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-sm text-fg-dim">
        {es ? "Solicitado el" : "Requested on"}{" "}
        {new Date(order.created_at).toLocaleDateString(es ? "es-MX" : "en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {order.amount_total != null && (
          <> · {formatCentsMXN(order.amount_total)}</>
        )}
      </p>

      {canPay && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-orange/40 bg-orange-soft p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange">
            {es ? "Tu cotización está lista" : "Your quote is ready"}
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold tabular-nums text-fg">
                {formatCentsMXN(order.amount_total)}
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                {es
                  ? "Confirma y paga para que arranquemos tu proyecto."
                  : "Confirm and pay so we can start your project."}
              </p>
            </div>
            <Button onClick={payNow} size="lg" disabled={paying} className="w-full sm:w-auto">
              {paying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {es
                ? `Confirmar proyecto · ${formatCentsMXN(order.amount_total)}`
                : `Confirm project · ${formatCentsMXN(order.amount_total)}`}
            </Button>
          </div>
          <PromoCodeField onChange={setPromoCode} />
          <p className="mt-4 flex items-center gap-2 text-xs text-fg-dim">
            <ShieldCheck className="h-3.5 w-3.5" />
            {es
              ? "Pago seguro con Stripe. El trabajo comienza una vez confirmado el pago."
              : "Secure payment with Stripe. Work begins once payment is confirmed."}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {order.brief && (
            <div className="rounded-3xl border border-line bg-ink-3 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-faint">
                <FileText className="h-4 w-4" />
                {es ? "Tu brief" : "Your brief"}
              </h3>
              <p className="whitespace-pre-wrap text-sm text-fg-muted">
                {order.brief}
              </p>
            </div>
          )}

          {isPaid ? (
            <>
              {milestones.length > 0 && (
                <div className="rounded-3xl border border-line bg-ink-3 p-6">
                  <MilestoneTimeline milestones={milestones} />
                </div>
              )}
              <div className="rounded-3xl border border-line bg-ink-3 p-6">
                <DeliverablesPanel orderId={orderId} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-ink-3/50 p-8 text-center">
              <Clock className="h-6 w-6 text-fg-faint" />
              <p className="mt-3 text-sm text-fg-dim">
                {order.status === "pending_quote"
                  ? es
                    ? "Estamos preparando tu cotización. Te avisaremos aquí y por tu panel en cuanto esté lista."
                    : "We're preparing your quote. We'll let you know here and in your dashboard as soon as it's ready."
                  : es
                    ? "El progreso y los entregables se desbloquean en cuanto confirmes el pago arriba."
                    : "Progress and deliverables unlock as soon as you confirm the payment above."}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-line bg-ink-3 p-6">
          <OrderMessages orderId={orderId} currentUserId={userId} />
        </div>
      </div>
    </div>
  );
}
