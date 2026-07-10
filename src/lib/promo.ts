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

/**
 * Recupera (o crea una sola vez) el cupón reutilizable de 15% de bienvenida
 * en Stripe. Devuelve su id para usarlo en `discounts` del Checkout.
 */
export async function ensureWelcomeCoupon(stripe: Stripe): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(COUPON_ID);
    if (existing && !("deleted" in existing && existing.deleted)) {
      return existing.id;
    }
  } catch {
    /* no existe todavía: se crea abajo */
  }
  const coupon = await stripe.coupons.create({
    id: COUPON_ID,
    percent_off: WELCOME_DISCOUNT_PERCENT,
    duration: "once",
    name: "Bienvenida −15% (primera compra)",
    metadata: { audax: "welcome_first_purchase" },
  });
  return coupon.id;
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
