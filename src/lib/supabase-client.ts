import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Anon (publishable) client — frontend'de güvenle kullanılabilir.
export const supabaseClient = createClient(supabaseUrl, supabasePublishableKey);
