import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://peclofqmkftzmcegnuil.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Initialize client with fallback placeholder to prevent app crash if key is not yet set
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || "public-anon-key-placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
