import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client Configuration
 * Uses Vite environment variables for client-side access:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY (publishable key only; never service_role)
 */
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://cisbahsmzwqqrmmwgncp.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "your-publishable-key-here");

// Client with safe fallback placeholder so the app renders without crashing
// even before credentials are set in .env
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || "sb_publishable_placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
