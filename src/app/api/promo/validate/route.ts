import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isFirstPurchase,
  validatePromoCode,
  WELCOME_DISCOUNT_PERCENT,
} from "@/lib/promo";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { valid: false, reason: "Inicia sesión para usar un código." },
      { status: 401 },
    );
  }

  const { code } = (await request.json().catch(() => ({}))) as {
    code?: string;
  };

  // Regla: la primera compra ya lleva el 15% de bienvenida y no admite códigos.
  if (await isFirstPurchase(supabase, user.id)) {
    return NextResponse.json({
      valid: false,
      reason: `Tu primer proyecto ya tiene ${WELCOME_DISCOUNT_PERCENT}% de descuento. Los códigos promocionales aplican desde tu segunda compra.`,
    });
  }

  const admin = createAdminClient();
  const result = await validatePromoCode(admin, code ?? "");
  return NextResponse.json(result);
}
