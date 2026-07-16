import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/supabase/env";

// Inicia el pago de un PAQUETE de LUTs. El webhook otorga acceso a todos sus LUTs.
export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Los pagos no están configurados todavía." },
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

  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Falta el paquete." }, { status: 400 });
  }

  const { data: pack } = await supabase
    .from("lut_packs")
    .select("id, slug, name_es, price, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!pack) {
    return NextResponse.json({ error: "Paquete no encontrado." }, { status: 404 });
  }
  if (!pack.price || pack.price <= 0) {
    return NextResponse.json(
      { error: "Este paquete es gratis, no requiere pago." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("lut_pack_purchases")
    .select("id, status")
    .eq("pack_id", pack.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.status === "granted") {
    return NextResponse.json(
      { error: "Ya tienes este paquete." },
      { status: 400 },
    );
  }

  let purchaseId = existing?.id;
  if (!purchaseId) {
    const { data: inserted, error: insErr } = await admin
      .from("lut_pack_purchases")
      .insert({
        pack_id: pack.id,
        user_id: user.id,
        kind: "paid",
        amount: pack.price,
        status: "pending",
      })
      .select("id")
      .single();
    if (insErr || !inserted) {
      return NextResponse.json(
        { error: "No se pudo iniciar la compra." },
        { status: 500 },
      );
    }
    purchaseId = inserted.id;
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: pack.price,
          product_data: { name: `Paquete de LUTs · ${pack.name_es}` },
        },
      },
    ],
    metadata: {
      lut_pack_purchase_id: purchaseId,
      pack_id: pack.id,
      user_id: user.id,
    },
    success_url: `${SITE_URL}/luts?pack_purchased=${pack.slug}`,
    cancel_url: `${SITE_URL}/luts?canceled=${pack.slug}`,
  });

  await admin
    .from("lut_pack_purchases")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", purchaseId);

  return NextResponse.json({ url: session.url });
}
