import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import {
  getStripe,
  isStripeConfigured,
  STRIPE_WEBHOOK_SECRET,
} from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminPayment, confirmPaymentToClient } from "@/lib/email";

// Hitos por defecto que se crean cuando un pedido queda pagado.
const DEFAULT_MILESTONES = [
  { title: "Pago recibido", status: "done" as const, position: 0 },
  { title: "Brief y arranque", status: "active" as const, position: 1 },
  { title: "En producción", status: "pending" as const, position: 2 },
  { title: "Revisión", status: "pending" as const, position: 3 },
  { title: "Entrega final", status: "pending" as const, position: 4 },
];

export async function POST(request: NextRequest) {
  if (!isStripeConfigured || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe no configurado." }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      sig ?? "",
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "firma inválida";
    return NextResponse.json({ error: `Webhook: ${msg}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          })
          .eq("id", orderId);

        // Crear hitos por defecto si aún no existen.
        const { count } = await supabase
          .from("order_milestones")
          .select("id", { count: "exact", head: true })
          .eq("order_id", orderId);
        if (!count) {
          await supabase.from("order_milestones").insert(
            DEFAULT_MILESTONES.map((m) => ({ ...m, order_id: orderId })),
          );
        }

        // Avisos por correo (no deben tumbar el webhook si fallan).
        try {
          const { data: order } = await supabase
            .from("orders")
            .select("service_name")
            .eq("id", orderId)
            .single();
          const serviceName = order?.service_name ?? "tu servicio";
          const clientEmail = session.customer_details?.email ?? undefined;
          const amountLabel =
            typeof session.amount_total === "number"
              ? new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: (session.currency ?? "mxn").toUpperCase(),
                  maximumFractionDigits: 0,
                }).format(session.amount_total / 100)
              : undefined;
          await notifyAdminPayment({
            serviceName,
            clientEmail,
            amountLabel,
            orderId,
          });
          if (clientEmail) {
            await confirmPaymentToClient({
              to: clientEmail,
              serviceName,
              orderId,
            });
          }
        } catch (err) {
          console.error("[webhook] error enviando correos:", err);
        }
      }
      break;
    }

    // Pago de una factura (flujo de cotización manual).
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const orderId = invoice.metadata?.order_id;
      if (orderId) {
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
