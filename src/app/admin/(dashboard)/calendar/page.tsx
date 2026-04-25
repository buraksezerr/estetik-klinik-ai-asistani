import { supabaseServer } from "@/lib/supabase-server";
import AdminCalendar, { type CalendarEvent } from "@/components/AdminCalendar";

interface Lead {
  id: string;
  name: string;
  phone: string;
  preferred_date: string | null;
  request_summary: string | null;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#ef4444",
  contacted: "#f59e0b",
  scheduled: "#10b981",
  completed: "#3b82f6",
  cancelled: "#9ca3af",
};

const TURKISH_MONTHS: Record<string, number> = {
  ocak: 0, şubat: 1, mart: 2, nisan: 3, mayıs: 4, haziran: 5,
  temmuz: 6, ağustos: 7, eylül: 8, ekim: 9, kasım: 10, aralık: 11,
};

function parseLeadDate(preferred_date: string | null, created_at: string): string {
  const fallback = created_at.split("T")[0];
  if (!preferred_date) return fallback;

  // ISO veya standart tarih formatı
  const direct = new Date(preferred_date);
  if (!isNaN(direct.getTime()) && direct.getFullYear() > 2000) {
    return direct.toISOString().split("T")[0];
  }

  // Türkçe ay adıyla parse ("15 Mayıs", "Haziran sonu" vb.)
  const lower = preferred_date.toLowerCase();
  const year = new Date().getFullYear();

  for (const [monthName, monthIdx] of Object.entries(TURKISH_MONTHS)) {
    if (lower.includes(monthName)) {
      const dayMatch = lower.match(/\b(\d{1,2})\b/);
      const day = dayMatch ? parseInt(dayMatch[1]) : 15;
      const parsed = new Date(year, monthIdx, day);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }
    }
  }

  return fallback;
}

function leadsToEvents(leads: Lead[]): CalendarEvent[] {
  return leads.map((lead) => {
    const color = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
    const title = lead.request_summary
      ? `${lead.name} — ${lead.request_summary.slice(0, 30)}`
      : lead.name;

    return {
      id: lead.id,
      title,
      date: parseLeadDate(lead.preferred_date, lead.created_at),
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        name: lead.name,
        phone: lead.phone,
        preferred_date: lead.preferred_date,
        request_summary: lead.request_summary,
        status: lead.status,
      },
    };
  });
}

export default async function CalendarPage() {
  const { data } = await supabaseServer
    .from("leads")
    .select(
      "id, name, phone, preferred_date, request_summary, status, created_at"
    )
    .order("created_at", { ascending: false });

  const leads: Lead[] = data ?? [];
  const events = leadsToEvents(leads);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-slate-900 font-light">
          Takvim
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Randevu taleplerinin takvim görünümü
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          <span className="text-5xl">📅</span>
          <p className="font-serif text-xl text-slate-700">
            Henüz randevu talebi yok
          </p>
          <p className="text-slate-400 text-sm max-w-xs">
            Hasta tarafına gidin, chatbot üzerinden bir randevu talebi
            oluşturun. Burada otomatik olarak görünecek.
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-rose-400 hover:text-rose-500 text-sm font-medium transition-colors"
          >
            Hasta tarafını aç →
          </a>
        </div>
      ) : (
        <AdminCalendar events={events} />
      )}
    </div>
  );
}
