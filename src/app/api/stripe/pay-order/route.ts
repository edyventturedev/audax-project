import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  isFirstPurchase,
  ensureWelcomeCoupon,
  ensureCreatorCoupon,
  validatePromoCode,
} from "@/lib/promo";
import { SITE_URL } from "@/lib/supabase/env";

// Paga un pedido existente que ya fue cotizado (status 'quoted' + amount_total).
export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Stripe no está configurado todavía." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { orderId, promoCode } = (await request.json().catch(() => ({}))) as {
    orderId?: string;
    promoCode?: string;
  };
  if (!orderId) {
    return NextResponse.json({ error: "Falta orderId." }, { status: 400 });
  }

  // RLS garantiza que solo el dueño (o admin) lea este pedido.
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, service_name, status, amount_total, service_slug")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
  }
  if (order.status !== "quoted" || !order.amount_total) {
    return NextResponse.json(
      { error: "Este pedido no está listo para pago." },
      { status: 400 },
    );
  }

  const stripe = getStripe();

  // Descuento: 15% de bienvenida en la 1ª compra; a partir de la 2ª, código
  // promocional (no acumulables). Se decide del lado del servidor.
  let discounts: { coupon: string }[] | undefined;
  let appliedPromo: string | null = null;
  try {
    if (await isFirstPurchase(supabase, user.id)) {
      discounts = [{ coupon: await ensureWelcomeCoupon(stripe) }];
    } else if (promoCode) {
      const admin = createAdminClient();
      const v = await validatePromoCode(admin, promoCode);
      if (v.valid) {
        discounts = [{ coupon: await ensureCreatorCoupon(stripe, v.percent) }];
        appliedPromo = v.code;
      }
    }
  } catch (err) {
    console.error("[promo] pay-order:", err);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: order.amount_total,
          product_data: { name: order.service_name },
        },
      },
    ],
    ...(discounts ? { discounts } : {}),
    metadata: {
      order_id: order.id,
      user_id: user.id,
      ...(appliedPromo ? { promo_code: appliedPromo } : {}),
    },
    success_url: `${SITE_URL}/dashboard/orders/${order.id}?paid=1`,
    cancel_url: `${SITE_URL}/dashboard/orders/${order.id}?canceled=1`,
  });

  await supabase
    .from("orders")
    .update({
      stripe_checkout_session_id: session.id,
      ...(appliedPromo ? { promo_code: appliedPromo } : {}),
    })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
