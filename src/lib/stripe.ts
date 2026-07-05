import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY ?? "";

export const isStripeConfigured = secret.startsWith("sk_");

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

let _stripe: Stripe | null = null;

/** Lazily-instantiated Stripe client (server-only). Throws if keys are missing. */
export function getStripe(): Stripe {
  if (!isStripeConfigured) {
    throw new Error("Stripe no está configurado: falta STRIPE_SECRET_KEY.");
  }
  if (!_stripe) {
    _stripe = new Stripe(secret);
  }
  return _stripe;
}
