import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const CREATE_APPOINTMENT_TOOL: Tool = {
  name: "create_appointment",
  description:
    "Hasta için randevu talebi oluşturur. Sadece hasta isim, telefon ve tercih tarih aralığı verdikten sonra çağrılmalıdır.",
  input_schema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description: "Hastanın tam adı",
      },
      phone: {
        type: "string",
        description:
          "Telefon numarası (Türkiye formatı, örn: 05321234567)",
      },
      preferred_date: {
        type: "string",
        description:
          "Tercih edilen tarih/saat veya tarih aralığı (serbest metin, örn: '15 Mayıs Perşembe öğleden sonra')",
      },
      request_summary: {
        type: "string",
        description:
          "Hastanın ne için randevu istediği, kısa özet (örn: 'Rinoplasti bilgi görüşmesi')",
      },
    },
    required: ["name", "phone", "preferred_date"],
  },
};

export interface CreateAppointmentInput {
  name: string;
  phone: string;
  preferred_date: string;
  request_summary?: string;
}
