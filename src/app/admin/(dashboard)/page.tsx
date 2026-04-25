import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import DeleteLeadButton from "@/components/admin/DeleteLeadButton";

interface Lead {
  id: string;
  name: string;
  phone: string;
  preferred_date: string | null;
  request_summary: string | null;
  status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; classes: string }
> = {
  new: { label: "Yeni", classes: "bg-rose-100 text-rose-700" },
  contacted: { label: "Arandı", classes: "bg-amber-100 text-amber-700" },
  scheduled: {
    label: "Randevu Verildi",
    classes: "bg-emerald-100 text-emerald-700",
  },
  completed: { label: "Tamamlandı", classes: "bg-sky-100 text-sky-700" },
  cancelled: { label: "İptal", classes: "bg-slate-100 text-slate-500" },
};

const FILTER_TABS = [
  { value: "", label: "Tümü" },
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Arandı" },
  { value: "scheduled", label: "Randevu Verildi" },
  { value: "completed", label: "Tamamlandı" },
  { value: "cancelled", label: "İptal" },
];

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 2) return "az önce";
  if (diffMinutes < 60) return `${diffMinutes} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return "dün";
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;

  // ── Veri çekme ──────────────────────────────────────────
  const [leadsResult, messagesResult] = await Promise.all([
    supabaseServer
      .from("leads")
      .select("id, name, phone, preferred_date, request_summary, status, created_at")
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("messages")
      .select("conversation_id")
      .eq("role", "user"),
  ]);

  const allLeads: Lead[] = leadsResult.data ?? [];

  // ── İstatistikler ───────────────────────────────────────
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const todayNew = allLeads.filter(
    (l) => new Date(l.created_at) >= todayStart && l.status === "new"
  ).length;
  const weekTotal = allLeads.filter(
    (l) => new Date(l.created_at) >= weekStart
  ).length;
  const uniqueConversations = new Set(
    (messagesResult.data ?? []).map((m) => m.conversation_id)
  ).size;

  const stats = [
    { value: todayNew, label: "Bugün Yeni" },
    { value: weekTotal, label: "Bu Hafta Toplam" },
    { value: uniqueConversations, label: "Toplam Konuşma" },
  ];

  // ── Filtreleme ──────────────────────────────────────────
  const filteredLeads = filterStatus
    ? allLeads.filter((l) => l.status === filterStatus)
    : allLeads;

  return (
    <div className="flex flex-col gap-8">
      {/* Başlık */}
      <div>
        <h1 className="font-serif text-3xl text-slate-900 font-light">
          Randevu Talepleri
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Chatbot üzerinden gelen tüm randevu talepleri
        </p>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <p className="font-serif text-4xl text-slate-900 font-light">
              {s.value}
            </p>
            <p className="text-slate-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtreleme sekmeleri */}
      <div className="flex gap-1 flex-wrap bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit">
        {FILTER_TABS.map((tab) => {
          const isActive = (filterStatus ?? "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `?status=${tab.value}` : "/admin"}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? "bg-rose-400 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
            <span className="text-5xl">💬</span>
            <p className="font-serif text-xl text-slate-700">
              Henüz randevu talebi yok
            </p>
            <p className="text-slate-400 text-sm max-w-xs">
              Chatbot üzerinden ilk randevu talebi gelince burada görünecek.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Ad Soyad
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    Tercih Tarih
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    Özet
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Zaman
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.map((lead) => {
                  const statusCfg =
                    STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.classes}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">
                        {lead.preferred_date ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 hidden lg:table-cell max-w-[200px]">
                        <span
                          title={lead.request_summary ?? ""}
                          className="truncate block"
                        >
                          {lead.request_summary
                            ? lead.request_summary.slice(0, 50) +
                              (lead.request_summary.length > 50 ? "…" : "")
                            : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                        {formatRelativeTime(lead.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/lead/${lead.id}`}
                            className="text-rose-400 hover:text-rose-600 text-xs font-medium transition-colors whitespace-nowrap"
                          >
                            Detay →
                          </Link>
                          <DeleteLeadButton leadId={lead.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
