import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

/** Descuento de bienvenida para la primera compra / usuarios nuevos. */
export const WELCOME_DISCOUNT_PERCENT = 15;
const COUPON_ID = "BIENVENIDO15";

// Estados que cuentan como "ya compró" (pagó al menos una vez).
const PAID_STATUSES = ["paid", "in_progress", "review", "delivered"];

/**
 * ¿Es la primera compra del usuario? Verdadero si no tiene ningún pedido
 * que ya haya sido pagado. Enforce del lado del servidor: no se puede abusar.
 */
export async function isFirstPurchase(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("status", PAID_STATUSES);
  if (error) return false; // ante la duda, no aplicamos descuento
  return (count ?? 0) === 0;
}

/** Recupera (o crea una sola vez) un cupón reutilizable en Stripe por id/%. */
async function ensureCoupon(
  stripe: Stripe,
  id: string,
  percent: number,
  name: string,
): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(id);
    if (existing && !("deleted" in existing && existing.deleted)) {
      return existing.id;
    }
  } catch {
    /* no existe todavía: se crea abajo */
  }
  const coupon = await stripe.coupons.create({
    id,
    percent_off: percent,
    duration: "once",
    name,
  });
  return coupon.id;
}

/** Cupón de 15% de bienvenida (primera compra). */
export async function ensureWelcomeCoupon(stripe: Stripe): Promise<string> {
  return ensureCoupon(
    stripe,
    COUPON_ID,
    WELCOME_DISCOUNT_PERCENT,
    "Bienvenida −15% (primera compra)",
  );
}

/** Cupón para un código de creador con un porcentaje dado. */
export async function ensureCreatorCoupon(
  stripe: Stripe,
  percent: number,
): Promise<string> {
  return ensureCoupon(
    stripe,
    `PROMO${percent}`,
    percent,
    `Código promocional −${percent}%`,
  );
}

export type PromoResult =
  | { valid: true; code: string; percent: number }
  | { valid: false; reason: string };

/**
 * Valida un código de descuento contra la tabla `promo_codes`. Debe llamarse
 * con un cliente con permisos de lectura sobre la tabla (service role).
 */
export async function validatePromoCode(
  supabase: SupabaseClient,
  rawCode: string,
): Promise<PromoResult> {
  const code = (rawCode ?? "").toUpperCase().replace(/\s/g, "");
  if (!code) return { valid: false, reason: "Ingresa un código." };

  const { data, error } = await supabase
    .from("promo_codes")
    .select("code, percent_off, active, max_redemptions, times_redeemed")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) return { valid: false, reason: "Código no válido." };
  if (!data.active)
    return { valid: false, reason: "Este código ya no está disponible." };
  if (
    data.max_redemptions != null &&
    data.times_redeemed >= data.max_redemptions
  ) {
    return { valid: false, reason: "Este código llegó a su límite de usos." };
  }
  return { valid: true, code: data.code, percent: data.percent_off };
}

/**
 * Devuelve el arreglo `discounts` para el Checkout si corresponde el 15%.
 * Nunca lanza: si algo falla, regresa `undefined` y el pago sigue sin descuento.
 */
export async function welcomeDiscountFor(
  supabase: SupabaseClient,
  stripe: Stripe,
  userId: string,
): Promise<{ coupon: string }[] | undefined> {
  try {
    if (await isFirstPurchase(supabase, userId)) {
      return [{ coupon: await ensureWelcomeCoupon(stripe) }];
    }
  } catch (err) {
    console.error("[promo] no se pudo aplicar el descuento de bienvenida:", err);
  }
  return undefined;
}
