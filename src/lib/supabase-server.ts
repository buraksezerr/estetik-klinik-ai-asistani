import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

// Service-role client — RLS'yi bypass eder, sadece server-side kullan.
export const supabaseServer = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
});
