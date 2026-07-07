# Estetik Klinik Yapay Zeka Asistanı

Estetik cerrahi klinikleri için geliştirilmiş, **Claude API tabanlı** hasta asistanı ve lead yönetim sistemi. Web sitesindeki chat widget'ı üzerinden hastaların sorularını doktorun üslubuyla yanıtlar, uygun anda **function calling (tool use)** ile randevu talebini otomatik oluşturur; klinik sekreteri gelen lead'leri admin panelinden yönetir.

> **Demo notu:** Uygulamadaki "Op. Dr. Sıla Köşker" kurgusal bir demo kimliğidir; gerçek bir kişiyi veya kliniği temsil etmez. İçerik tıbbi tavsiye yerine geçmez. Aynı mimari, `.env` üzerinden farklı bir klinik kimliğiyle yapılandırılabilir.

---

## Ne Yapıyor?

**Hasta tarafı**
- Klinik tanıtım sitesi (hizmetler, SSS, iletişim) içine gömülü chat widget'ı
- Chatbot; rinoplasti, septoplasti gibi işlemler hakkında doktorun klinik felsefesine uygun, tıbbi terminolojiye hakim yanıtlar verir
- Hasta ad, telefon ve tarih tercihi verdiğinde model `create_appointment` aracını çağırır ve randevu talebi (lead) veritabanına düşer
- Konuşma geçmişi oturum bazlı saklanır; hasta kaldığı yerden devam eder

**Klinik tarafı (admin panel)**
- Supabase Auth ile korunan sekreter/doktor paneli
- Lead listesi: durum takibi (yeni → arandı → randevulaştı), not ekleme, arama kaydı
- Lead detayında chatbot konuşma geçmişinin tamamı görüntülenir
- FullCalendar tabanlı randevu takvimi görünümü

## Mimari

```
Hasta → ChatWidget → /api/chat → Claude API (system prompt + tools)
                          │             │
                          │      stop_reason: "tool_use"
                          │             ▼
                          │      create_appointment → leads tablosu
                          ▼
                    Supabase (conversations, messages, leads)
                          ▲
        Admin Panel ──────┘  (Supabase Auth + middleware koruması)
```

- **Tool use döngüsü:** [src/app/api/chat/route.ts](src/app/api/chat/route.ts) — Claude yanıtı `tool_use` içerdiğinde araç çalıştırılır, sonuç `tool_result` olarak modele geri beslenir ve final yanıt üretilir (max iterasyon korumalı).
- **Persona yönetimi:** [src/lib/sila-prompt.ts](src/lib/sila-prompt.ts) — doktorun uzmanlık alanı, üslubu ve sınırları (hangi işlemleri yapmadığı, tıbbi tavsiye vermeme kuralı) system prompt'ta tanımlı.
- **Araç tanımı:** [src/lib/tools.ts](src/lib/tools.ts) — JSON Schema ile `create_appointment` aracı; [src/lib/tool-handlers.ts](src/lib/tool-handlers.ts) lead kaydını yazar.
- **Erişim kontrolü:** [src/middleware.ts](src/middleware.ts) — admin rotaları Supabase oturumu olmadan erişime kapalı.

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) · TypeScript |
| Yapay zeka | Anthropic Claude API (`@anthropic-ai/sdk`) — system prompt + tool use |
| Veritabanı & Auth | Supabase (PostgreSQL, Row Level Security, Auth) |
| UI | Tailwind CSS 4 · Framer Motion · FullCalendar · Lucide |

## Kurulum

```bash
npm install
cp .env.example .env.local   # anahtarları doldur
```

1. [Supabase](https://supabase.com)'de proje oluştur, `supabase-schema.sql` ve ardından `supabase-alter-leads.sql` dosyalarını SQL editöründe çalıştır.
2. Supabase **Authentication > Users**'tan admin kullanıcısı oluştur.
3. `.env.local` içine Anthropic API anahtarı ile Supabase URL/anahtarlarını gir (şablon ve açıklamalar [.env.example](.env.example) içinde).
4. `npm run dev` → [http://localhost:3000](http://localhost:3000)

| Sayfa | Adres |
|---|---|
| Klinik sitesi + chat widget | `/` |
| Admin girişi | `/admin/login` |
| Lead paneli | `/admin` |
| Randevu takvimi | `/admin/calendar` |

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx               # Klinik tanıtım sayfası
│   ├── api/chat/route.ts      # Claude tool-use döngüsü + mesaj kalıcılığı
│   └── admin/                 # Korumalı panel (lead listesi, detay, takvim)
├── components/
│   ├── ChatWidget.tsx         # Hasta chat arayüzü
│   └── admin/                 # Lead durumu, not, silme bileşenleri
├── lib/
│   ├── anthropic.ts           # Claude client yapılandırması
│   ├── sila-prompt.ts         # Doktor persona system prompt'u
│   ├── tools.ts               # create_appointment araç şeması
│   ├── tool-handlers.ts       # Araç → veritabanı işleyicisi
│   └── supabase-*.ts          # Client/server/auth yardımcıları
└── middleware.ts              # Admin rota koruması
supabase-schema.sql            # conversations, messages, leads şeması
```

---

Geliştirici: **Burak Sezer** · [buuraksezer@gmail.com](mailto:buuraksezer@gmail.com)
