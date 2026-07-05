import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Service-role client — bypasses RLS. Use ONLY in trusted server contexts
 * (webhooks, admin jobs). Never import from Client Components.
 */
export function createAdminClient() {
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error("Supabase service role no configurado.");
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
