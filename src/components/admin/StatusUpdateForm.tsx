"use client";

import { useState } from "react";
import { updateLeadStatus } from "@/app/admin/actions";

const STATUS_OPTIONS = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Arandı" },
  { value: "scheduled", label: "Randevu Verildi" },
  { value: "completed", label: "Tamamlandı" },
  { value: "cancelled", label: "İptal" },
] as const;

type LeadStatus = (typeof STATUS_OPTIONS)[number]["value"];

interface StatusUpdateFormProps {
  leadId: string;
  currentStatus: string;
}

export default function StatusUpdateForm({
  leadId,
  currentStatus,
}: StatusUpdateFormProps) {
  const [status, setStatus] = useState<LeadStatus>(
    currentStatus as LeadStatus
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave() {
    setIsLoading(true);
    setMessage(null);
    const result = await updateLeadStatus(leadId, status);
    setIsLoading(false);
    setMessage(
      result.success
        ? { type: "success", text: "Durum güncellendi." }
        : { type: "error", text: "Güncelleme başarısız." }
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as LeadStatus)}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={isLoading || status === currentStatus}
        className="bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Kaydediliyor..." : "Kaydet"}
      </button>
      {message && (
        <p
          className={`text-xs ${
            message.type === "success"
              ? "text-emerald-600"
              : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
