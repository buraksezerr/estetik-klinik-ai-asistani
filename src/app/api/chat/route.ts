import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { SILA_SYSTEM_PROMPT } from "@/lib/sila-prompt";
import { CREATE_APPOINTMENT_TOOL } from "@/lib/tools";
import type { CreateAppointmentInput } from "@/lib/tools";
import { handleCreateAppointment } from "@/lib/tool-handlers";
import type { MessageParam, ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";

interface ChatRequestBody {
  message: string;
  sessionId: string;
}

interface ChatResponse {
  reply: string;
  conversationId: string;
  appointmentCreated?: boolean;
  leadId?: string;
}

const MAX_TOOL_ITERATIONS = 3;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { message, sessionId } = body;

    if (!message?.trim() || !sessionId?.trim()) {
      return NextResponse.json(
        { error: "message ve sessionId zorunludur." },
        { status: 400 }
      );
    }

    // ── 1. Conversation bul veya oluştur ────────────────────
    let conversationId: string;

    const { data: existing, error: findError } = await supabaseServer
      .from("conversations")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (findError) {
      console.error("[chat] Conversation arama hatası:", findError);
      return NextResponse.json({ error: "Veritabanı hatası." }, { status: 500 });
    }

    if (existing) {
      conversationId = existing.id as string;
    } else {
      const { data: created, error: createError } = await supabaseServer
        .from("conversations")
        .insert({ session_id: sessionId })
        .select("id")
        .single();

      if (createError || !created) {
        console.error("[chat] Conversation oluşturma hatası:", createError);
        return NextResponse.json({ error: "Veritabanı hatası." }, { status: 500 });
      }
      conversationId = created.id as string;
    }

    // ── 2. Kullanıcı mesajını kaydet ────────────────────────
    const { error: insertUserError } = await supabaseServer
      .from("messages")
      .insert({ conversation_id: conversationId, role: "user", content: message });

    if (insertUserError) {
      console.error("[chat] Kullanıcı mesajı kayıt hatası:", insertUserError);
      return NextResponse.json({ error: "Veritabanı hatası." }, { status: 500 });
    }

    // ── 3. Mesaj geçmişini al ───────────────────────────────
    const { data: history, error: historyError } = await supabaseServer
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (historyError) {
      console.error("[chat] Geçmiş alma hatası:", historyError);
      return NextResponse.json({ error: "Veritabanı hatası." }, { status: 500 });
    }

    const claudeMessages: MessageParam[] = (history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content as string,
    }));

    // ── 4. Claude API — tool use döngüsü ───────────────────
    let reply = "";
    let appointmentCreated = false;
    let leadId: string | undefined;

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await anthropic.messages.create({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system: SILA_SYSTEM_PROMPT,
        tools: [CREATE_APPOINTMENT_TOOL],
        messages: claudeMessages,
      });

      if (response.stop_reason === "tool_use") {
        // Asistan yanıtını (tool_use blokları dahil) geçmişe ekle
        claudeMessages.push({
          role: "assistant",
          content: response.content,
        });

        // Tool çağrılarını işle, sonuçları topla
        const toolResults: ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type !== "tool_use") continue;

          if (block.name === "create_appointment") {
            const result = await handleCreateAppointment(
              block.input as CreateAppointmentInput,
              conversationId,
              supabaseServer
            );

            if (result.success && result.leadId) {
              appointmentCreated = true;
              leadId = result.leadId;
            }

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          } else {
            // Bilinmeyen tool — hata olarak dön
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify({ success: false, error: "Bilinmeyen araç." }),
              is_error: true,
            });
          }
        }

        // Tool sonuçlarını kullanıcı mesajı olarak geçmişe ekle
        claudeMessages.push({
          role: "user",
          content: toolResults,
        });

        // Döngü devam eder, Claude final yanıtını üretecek
      } else {
        // stop_reason: "end_turn" — metin yanıtı çıkar
        const textBlock = response.content.find((b) => b.type === "text");
        if (textBlock && textBlock.type === "text") {
          reply = textBlock.text;
        }
        break;
      }
    }

    if (!reply) {
      console.error("[chat] Tool döngüsü max iterasyona ulaştı veya metin üretilmedi.");
      reply = "Bir sorun oluştu, lütfen tekrar deneyin.";
    }

    // ── 5. Final yanıtı DB'ye kaydet ───────────────────────
    const { error: insertAssistantError } = await supabaseServer
      .from("messages")
      .insert({ conversation_id: conversationId, role: "assistant", content: reply });

    if (insertAssistantError) {
      console.error("[chat] Asistan mesajı kayıt hatası:", insertAssistantError);
    }

    // ── 6. Yanıtı döner ─────────────────────────────────────
    const responseBody: ChatResponse = { reply, conversationId };
    if (appointmentCreated) {
      responseBody.appointmentCreated = true;
      responseBody.leadId = leadId;
    }

    return NextResponse.json(responseBody);
  } catch (err) {
    console.error("[chat] Beklenmeyen hata:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
