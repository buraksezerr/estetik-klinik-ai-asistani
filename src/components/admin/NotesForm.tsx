"use client";

import { useState } from "react";
import { updateLeadNotes } from "@/app/admin/actions";

interface NotesFormProps {
  leadId: string;
  initialNotes: string | null;
}

export default function NotesForm({ leadId, initialNotes }: NotesFormProps) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    setSaved(false);
    await updateLeadNotes(leadId, notes);
    setIsLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Aradığınızda hastanın söyledikleri, randevu detayları vb."
        rows={5}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
      />
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Kaydediliyor..." : saved ? "Kaydedildi ✓" : "Notu Kaydet"}
      </button>
    </div>
  );
}
