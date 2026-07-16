import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantPackAccess } from "@/lib/lutPackGrant";

// Reclama un paquete GRATIS: requiere sesión y desbloquea todos sus LUTs.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Inicia sesión para obtener el paquete." },
      { status: 401 },
    );
  }

  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Falta el paquete." }, { status: 400 });
  }

  const { data: pack } = await supabase
    .from("lut_packs")
    .select("id, price, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!pack) {
    return NextResponse.json({ error: "Paquete no encontrado." }, { status: 404 });
  }
  if (pack.price && pack.price > 0) {
    return NextResponse.json(
      { error: "Este paquete es de pago." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // Registrar la compra gratis (idempotente) y otorgar acceso.
  await admin
    .from("lut_pack_purchases")
    .upsert(
      {
        pack_id: pack.id,
        user_id: user.id,
        kind: "free",
        amount: 0,
        status: "granted",
      },
      { onConflict: "pack_id,user_id" },
    );

  await grantPackAccess(admin, pack.id, user.id);

  return NextResponse.json({ ok: true });
}
