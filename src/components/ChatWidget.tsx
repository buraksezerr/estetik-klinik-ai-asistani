"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Merhaba! Dr. Sıla Köşker KBB ve Estetik Cerrahi Kliniği'nin dijital asistanıyım. Rinoplasti, septoplasti veya burun estetiği hakkında sorularınız için buradayım. Size nasıl yardımcı olayım?",
  timestamp: new Date(),
};

function getSessionId(): string {
  const key = "sila_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Bir hata oluştu, lütfen tekrar deneyin.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bir hata oluştu, lütfen tekrar deneyin.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  }

  return (
    <>
      {/* ── Açık pencere ───────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[400px] h-[650px] max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:bottom-0 max-sm:right-0 rounded-2xl max-sm:rounded-none shadow-2xl overflow-hidden bg-white border border-slate-100">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100/60 shrink-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-sm border border-rose-100">
              <span className="font-serif text-lg text-amber-700 font-medium select-none">
                SK
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-slate-900 truncate">
                Dr. Sıla Köşker Asistanı
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs text-slate-500">Çevrimiçi</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/60 transition-colors"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mesaj alanı */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-stone-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-rose-400 text-white rounded-br-sm"
                      : "bg-white text-slate-800 rounded-bl-sm border border-slate-200 shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}

            {/* Yazıyor animasyonu */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Giriş alanı */}
          <div className="px-3 py-3 border-t border-slate-100 bg-white shrink-0 flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Mesajınızı yazın..."
              rows={1}
              className="flex-1 resize-none text-sm px-3 py-2.5 bg-stone-50 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none border-0 disabled:opacity-50 max-h-24 leading-relaxed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-rose-400 text-white hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              aria-label="Gönder"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── Kapalı buton ───────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-rose-400 hover:bg-rose-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center chat-pulse"
          aria-label="Chat'i aç"
        >
          <MessageCircle size={28} strokeWidth={1.5} />
        </button>
      )}
    </>
  );
}
