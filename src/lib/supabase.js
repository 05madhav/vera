import { createClient } from "@supabase/supabase-js";

// These come from .env.local (the values you pasted from Supabase → API).
// The NEXT_PUBLIC_ prefix means Next.js exposes them to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A single shared client we import wherever we need to talk to Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
