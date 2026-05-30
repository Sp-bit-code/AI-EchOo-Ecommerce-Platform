import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL in client/.env");
}

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY in client/.env");
}

const globalForSupabase = globalThis;

export const supabase =
  globalForSupabase.__echooSupabaseClient ||
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "echoo-auth-token",
      flowType: "pkce",
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "X-Client-Info": "echoo-ecommerce-client",
      },
    },
  });

if (import.meta.env.DEV) {
  globalForSupabase.__echooSupabaseClient = supabase;
}

export default supabase;