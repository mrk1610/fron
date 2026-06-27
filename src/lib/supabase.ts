import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Bug #5: Fail fast with a clear message instead of silently passing undefined to createClient
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in your .env file or Vercel environment settings."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
