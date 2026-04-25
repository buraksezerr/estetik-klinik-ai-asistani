"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase-auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-slate-500 hover:text-slate-900 transition-colors border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg"
    >
      Çıkış Yap
    </button>
  );
}
