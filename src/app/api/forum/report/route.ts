import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión para reportar." }, { status: 401 });
  }

  const { targetType, targetId, reason } = (await request
    .json()
    .catch(() => ({}))) as {
    targetType?: string;
    targetId?: string;
    reason?: string;
  };

  if (
    (targetType !== "thread" && targetType !== "reply") ||
    !targetId
  ) {
    return NextResponse.json({ error: "Reporte inválido." }, { status: 400 });
  }

  const { error } = await supabase.from("forum_reports").insert({
    target_type: targetType,
    target_id: targetId,
    reporter_id: user.id,
    reason: (reason ?? "").slice(0, 500) || null,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo enviar el reporte." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
