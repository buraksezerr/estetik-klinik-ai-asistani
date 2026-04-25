"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteLead } from "@/app/admin/actions";

interface Props {
  leadId: string;
  redirectAfter?: boolean;
  variant?: "icon" | "full";
}

export default function DeleteLeadButton({
  leadId,
  redirectAfter = false,
  variant = "icon",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  function handleClick() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    startTransition(async () => {
      await deleteLead(leadId);
      if (redirectAfter) {
        router.push("/admin");
      }
      setConfirm(false);
    });
  }

  if (variant === "full") {
    return (
      <div className="flex flex-col gap-1.5">
        {confirm && (
          <p className="text-xs text-red-500 text-center">
            Emin misiniz? Geri alınamaz.
          </p>
        )}
        <button
          onClick={handleClick}
          disabled={isPending}
          className={`flex items-center gap-2 justify-center text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 ${
            confirm
              ? "bg-red-500 hover:bg-red-600 text-white border border-red-500"
              : "border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-600"
          }`}
        >
          <Trash2 size={15} />
          {isPending ? "Siliniyor…" : confirm ? "Evet, Sil" : "Kaydı Sil"}
        </button>
        {confirm && (
          <button
            onClick={() => setConfirm(false)}
            className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors"
          >
            İptal
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      {confirm && (
        <>
          <button
            onClick={handleClick}
            disabled={isPending}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? "…" : "Sil"}
          </button>
          <span className="text-slate-200">|</span>
          <button
            onClick={() => setConfirm(false)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Hayır
          </button>
        </>
      )}
      {!confirm && (
        <button
          onClick={handleClick}
          className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
          title="Kaydı Sil"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
