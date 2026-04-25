import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, ArrowLeft, Calendar, FileText, Clock } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import StatusUpdateForm from "@/components/admin/StatusUpdateForm";
import NotesForm from "@/components/admin/NotesForm";
import DeleteLeadButton from "@/components/admin/DeleteLeadButton";

interface Lead {
  id: string;
  conversation_id: string | null;
  name: string;
  phone: string;
  preferred_date: string | null;
  request_summary: string | null;
  status: string;
  created_at: string;
  notes: string | null;
  contacted_at: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  new: { label: "Yeni", classes: "bg-rose-100 text-rose-700" },
  contacted: { label: "Arandı", classes: "bg-amber-100 text-amber-700" },
  scheduled: {
    label: "Randevu Verildi",
    classes: "bg-emerald-100 text-emerald-700",
  },
  completed: { label: "Tamamlandı", classes: "bg-sky-100 text-sky-700" },
  cancelled: { label: "İptal", classes: "bg-slate-100 text-slate-500" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: lead } = await supabaseServer
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!lead) notFound();

  const typedLead = lead as Lead;

  const messages: Message[] = [];
  if (typedLead.conversation_id) {
    const { data } = await supabaseServer
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", typedLead.conversation_id)
      .order("created_at", { ascending: true });
    messages.push(...((data as Message[]) ?? []));
  }

  const statusCfg =
    STATUS_CONFIG[typedLead.status] ?? STATUS_CONFIG.new;

  const waNumber = typedLead.phone.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-6">
      {/* Geri butonu */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Tüm Talepler
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* ── Sol sütun (60%) ───────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Hasta Bilgileri */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-serif text-2xl text-slate-900">
                  {typedLead.name}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Randevu Talebi Detayı
                </p>
              </div>
              <span
                className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${statusCfg.classes}`}
              >
                {statusCfg.label}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <InfoRow
                icon={<Phone size={15} />}
                label="Telefon"
                value={typedLead.phone}
              />
              <InfoRow
                icon={<Calendar size={15} />}
                label="Tercih Tarih"
                value={typedLead.preferred_date ?? "Belirtilmedi"}
              />
              {typedLead.request_summary && (
                <InfoRow
                  icon={<FileText size={15} />}
                  label="Talep Özeti"
                  value={typedLead.request_summary}
                />
              )}
              <InfoRow
                icon={<Clock size={15} />}
                label="Oluşturulma"
                value={formatDate(typedLead.created_at)}
              />
              {typedLead.contacted_at && (
                <InfoRow
                  icon={<Phone size={15} />}
                  label="Arandığı Zaman"
                  value={formatDate(typedLead.contacted_at)}
                />
              )}
            </div>
          </div>

          {/* Konuşma Geçmişi */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-serif text-lg text-slate-900 mb-4">
              Chatbot ile Konuşma
            </h2>
            {messages.length === 0 ? (
              <p className="text-slate-400 text-sm py-6 text-center">
                Konuşma geçmişi bulunamadı.
              </p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-rose-50 text-slate-800 rounded-br-sm"
                          : "bg-stone-50 text-slate-700 rounded-bl-sm border border-slate-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 px-1">
                      {msg.role === "user" ? "Hasta" : "Asistan"} ·{" "}
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Sağ sütun (40%) ───────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Durum Yönetimi */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-serif text-lg text-slate-900 mb-4">Durum</h2>
            <StatusUpdateForm
              leadId={typedLead.id}
              currentStatus={typedLead.status}
            />
          </div>

          {/* Notlar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-serif text-lg text-slate-900 mb-4">
              Dahili Notlar
            </h2>
            <NotesForm
              leadId={typedLead.id}
              initialNotes={typedLead.notes}
            />
          </div>

          {/* Hızlı Aksiyonlar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-serif text-lg text-slate-900 mb-4">
              Hızlı Aksiyonlar
            </h2>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${typedLead.phone}`}
                className="flex items-center gap-2 justify-center border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                <Phone size={15} />
                Telefonu Ara
              </a>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                <span className="text-base">💬</span>
                WhatsApp&apos;tan Yaz
              </a>
              <div className="pt-2 border-t border-slate-100">
                <DeleteLeadButton
                  leadId={typedLead.id}
                  redirectAfter
                  variant="full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}
