import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Entrega un LUT: los gratis registran el acceso (requiere sesión); los de pago
// exigen una compra 'granted'. Devuelve una URL firmada del bucket privado.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Inicia sesión para descargar." },
      { status: 401 },
    );
  }

  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Falta el LUT." }, { status: 400 });
  }

  const { data: lut } = await supabase
    .from("luts")
    .select("id, price, file_path, file_name, downloads, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!lut) {
    return NextResponse.json({ error: "LUT no encontrado." }, { status: 404 });
  }
  if (!lut.file_path) {
    return NextResponse.json(
      { error: "Este LUT aún no tiene archivo disponible." },
      { status: 409 },
    );
  }

  const admin = createAdminClient();
  const free = !lut.price || lut.price <= 0;

  if (free) {
    // Registrar el acceso gratis (una sola vez por usuario).
    const { data: existing } = await admin
      .from("lut_downloads")
      .select("id")
      .eq("lut_id", lut.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!existing) {
      await admin.from("lut_downloads").insert({
        lut_id: lut.id,
        user_id: user.id,
        kind: "free",
        status: "granted",
      });
    }
  } else {
    // De pago: verificar que el usuario ya lo compró.
    const { data: grant } = await admin
      .from("lut_downloads")
      .select("id, status")
      .eq("lut_id", lut.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (grant?.status !== "granted") {
      return NextResponse.json(
        { error: "Necesitas comprar este LUT primero." },
        { status: 403 },
      );
    }
  }

  const { data: signed, error: signErr } = await admin.storage
    .from("lut-files")
    .createSignedUrl(lut.file_path, 120, {
      download: lut.file_name ?? true,
    });

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json(
      { error: "No se pudo generar el enlace de descarga." },
      { status: 500 },
    );
  }

  // Contador de descargas (aproximado; no crítico).
  await admin
    .from("luts")
    .update({ downloads: (lut.downloads ?? 0) + 1 })
    .eq("id", lut.id);

  return NextResponse.json({ url: signed.signedUrl });
}
