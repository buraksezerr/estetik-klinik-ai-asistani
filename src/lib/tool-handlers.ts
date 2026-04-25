import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateAppointmentInput } from "@/lib/tools";

export interface AppointmentResult {
  success: boolean;
  leadId?: string;
  message?: string;
  error?: string;
}

export async function handleCreateAppointment(
  input: CreateAppointmentInput,
  conversationId: string,
  supabase: SupabaseClient
): Promise<AppointmentResult> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      conversation_id: conversationId,
      name: input.name,
      phone: input.phone,
      preferred_date: input.preferred_date,
      request_summary: input.request_summary ?? null,
      status: "new",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[tool:create_appointment] DB hatası:", error);
    return { success: false, error: "Randevu kaydedilemedi." };
  }

  return {
    success: true,
    leadId: data.id as string,
    message: "Randevu talebi kaydedildi.",
  };
}
