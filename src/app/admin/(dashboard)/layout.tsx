import { redirect } from "next/navigation";
import { createSupabaseAuthServer } from "@/lib/supabase-auth-server";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseAuthServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl text-slate-900">
              Köşker Kliniği
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 text-sm">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
