# Dr. Sıla Köşker Demo

KBB ve rinoplasti uzmanı kurgusal Dr. Sıla Köşker için chatbot + admin panel demo'su.

## ⚠️ Demo Uyarısı

Bu proje demo amaçlıdır. Dr. Sıla Köşker kurgusal bir karakterdir, gerçek bir doktor değildir. Tıbbi tavsiye yerine geçmez.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Anthropic Claude API
- Framer Motion

## Özellikler

- Hasta tarafı: Web chat widget
- Asistan: Dr. Sıla rolünde Claude AI
- Otomatik randevu tool'u (function calling)
- Admin panel: Sekreter için randevu yönetimi
- Konuşma geçmişi görüntüleme

## Kurulum

1. `npm install`
2. `.env.example` dosyasını `.env.local` olarak kopyala
3. Anahtarları doldur
4. Supabase'de `supabase-schema.sql` çalıştır
5. `supabase-alter-leads.sql` çalıştır (notes ve contacted_at kolonları için)
6. Authentication > Users'tan demo admin kullanıcı oluştur
7. `npm run dev`

## Lisans

Tüm hakları saklıdır.
