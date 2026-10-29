/**
 * Server-side Supabase client using service_role key.
 * NEVER import this in browser/client code.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function createServerSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url =
    process.env["VITE_SUPABASE_URL"] ||
    process.env["SUPABASE_URL"] ||
    "";

  const serviceRoleKey =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] || "";

  if (!url) {
    throw new Error(
      "[supabase-server] Missing VITE_SUPABASE_URL or SUPABASE_URL environment variable."
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "[supabase-server] Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
        "Set it in your Vercel/server environment (never expose it to the browser)."
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
