import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/supabase/env";

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

  const { serviceSlug } = (await request.json().catch(() => ({}))) as {
    serviceSlug?: string;
  };
  if (!serviceSlug) {
    return NextResponse.json({ error: "Falta serviceSlug." }, { status: 400 });
  }

  // Precio autoritativo desde la base de datos (no confiar en el cliente).
  const { data: service, error: sErr } = await supabase
    .from("services")
    .select("slug, name_es, category, price_min, pricing_type")
    .eq("slug", serviceSlug)
    .single();

  if (sErr || !service) {
    return NextResponse.json({ error: "Servicio no encontrado." }, { status: 404 });
  }
  if (service.pricing_type !== "fixed") {
    return NextResponse.json(
      { error: "Este servicio requiere cotización." },
      { status: 400 },
    );
  }

  const amountCents = service.price_min * 100;

  // 1) Crear el pedido en estado "quoted" (precio conocido, aún sin pagar).
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      service_slug: service.slug,
      service_name: service.name_es,
      category: service.category,
      pricing_type: "fixed",
      status: "quoted",
      amount_total: amountCents,
      currency: "mxn",
    })
    .select("id")
    .single();

  if (oErr || !order) {
    return NextResponse.json(
      { error: "No se pudo crear el pedido." },
      { status: 500 },
    );
  }

  // 2) Crear la sesión de Stripe Checkout.
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: amountCents,
          product_data: { name: service.name_es },
        },
      },
    ],
    metadata: { order_id: order.id, user_id: user.id },
    success_url: `${SITE_URL}/dashboard/orders/${order.id}?paid=1`,
    cancel_url: `${SITE_URL}/servicios/detalle/${service.slug}?canceled=1`,
  });

  // 3) Guardar el id de sesión en el pedido.
  await supabase
    .from("orders")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
