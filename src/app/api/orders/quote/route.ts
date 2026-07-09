import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyAdminNewQuote, confirmQuoteToClient } from "@/lib/email";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { serviceSlug, brief } = (await request.json().catch(() => ({}))) as {
    serviceSlug?: string;
    brief?: string;
  };
  if (!serviceSlug) {
    return NextResponse.json({ error: "Falta serviceSlug." }, { status: 400 });
  }

  const { data: service, error: sErr } = await supabase
    .from("services")
    .select("slug, name_es, category, price_min")
    .eq("slug", serviceSlug)
    .single();
  if (sErr || !service) {
    return NextResponse.json({ error: "Servicio no encontrado." }, { status: 404 });
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      service_slug: service.slug,
      service_name: service.name_es,
      category: service.category,
      pricing_type: "quote",
      status: "pending_quote",
      brief: brief?.slice(0, 4000) ?? null,
      currency: "mxn",
    })
    .select("id")
    .single();

  if (oErr || !order) {
    return NextResponse.json(
      { error: "No se pudo crear la solicitud." },
      { status: 500 },
    );
  }

  // Notificaciones por correo (no bloquean la respuesta si fallan).
  try {
    await notifyAdminNewQuote({
      serviceName: service.name_es,
      brief: brief ?? "",
      clientEmail: user.email ?? undefined,
      orderId: order.id,
    });
    if (user.email) {
      await confirmQuoteToClient({
        to: user.email,
        serviceName: service.name_es,
        orderId: order.id,
      });
    }
  } catch (err) {
    console.error("[quote] error enviando correos:", err);
  }

  return NextResponse.json({ orderId: order.id });
}
