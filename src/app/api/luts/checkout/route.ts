import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/supabase/env";

// Inicia el pago de un LUT premium. Crea (o reutiliza) un acceso 'pending'
// y una sesión de Stripe Checkout; el webhook lo marca 'granted' al pagar.
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
    return NextResponse.json({ error: "Falta el LUT." }, { status: 400 });
  }

  // Precio autoritativo desde la base de datos (no confiar en el cliente).
  const { data: lut } = await supabase
    .from("luts")
    .select("id, slug, name_es, price, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!lut) {
    return NextResponse.json({ error: "LUT no encontrado." }, { status: 404 });
  }
  if (!lut.price || lut.price <= 0) {
    return NextResponse.json(
      { error: "Este LUT es gratis, no requiere pago." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // ¿Ya tiene acceso? Entonces no cobrar de nuevo.
  const { data: existing } = await admin
    .from("lut_downloads")
    .select("id, status")
    .eq("lut_id", lut.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.status === "granted") {
    return NextResponse.json(
      { error: "Ya tienes este LUT. Pulsa Descargar." },
      { status: 400 },
    );
  }

  // Crear o reutilizar el acceso pendiente.
  let downloadId = existing?.id;
  if (!downloadId) {
    const { data: inserted, error: insErr } = await admin
      .from("lut_downloads")
      .insert({
        lut_id: lut.id,
        user_id: user.id,
        kind: "paid",
        amount: lut.price,
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
    downloadId = inserted.id;
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
          unit_amount: lut.price,
          product_data: { name: `LUT · ${lut.name_es}` },
        },
      },
    ],
    metadata: {
      lut_download_id: downloadId,
      lut_id: lut.id,
      user_id: user.id,
    },
    success_url: `${SITE_URL}/luts?purchased=${lut.slug}`,
    cancel_url: `${SITE_URL}/luts?canceled=${lut.slug}`,
  });

  await admin
    .from("lut_downloads")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", downloadId);

  return NextResponse.json({ url: session.url });
}
