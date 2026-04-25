"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase-server";

interface ActionResult {
  success: boolean;
  error?: string;
}

const VALID_STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "completed",
  "cancelled",
] as const;

type LeadStatus = (typeof VALID_STATUSES)[number];

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus
): Promise<ActionResult> {
  if (!VALID_STATUSES.includes(newStatus)) {
    return { success: false, error: "Geçersiz durum değeri." };
  }

  const updateData: { status: string; contacted_at?: string } = {
    status: newStatus,
  };

  if (newStatus === "contacted") {
    updateData.contacted_at = new Date().toISOString();
  }

  const { error } = await supabaseServer
    .from("leads")
    .update(updateData)
    .eq("id", leadId);

  if (error) {
    console.error("[admin] updateLeadStatus hatası:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/lead/${leadId}`);
  return { success: true };
}

export async function updateLeadNotes(
  leadId: string,
  notes: string
): Promise<ActionResult> {
  const { error } = await supabaseServer
    .from("leads")
    .update({ notes })
    .eq("id", leadId);

  if (error) {
    console.error("[admin] updateLeadNotes hatası:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/lead/${leadId}`);
  return { success: true };
}
