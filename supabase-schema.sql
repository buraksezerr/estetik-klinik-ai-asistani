-- ============================================================
-- Rönaplasti Demo — Supabase Tablo Şeması
-- Dr. Sıla Köşker KBB ve Estetik Cerrahi Kliniği
-- ============================================================
-- Kullanım: Supabase Dashboard > SQL Editor > New query
-- Bu dosyanın tamamını yapıştır ve "Run" ile çalıştır.
-- ============================================================


-- ── TABLO 1: conversations ──────────────────────────────────
-- Her web ziyareti = bir oturum (session). Kullanıcı siteye
-- girdiğinde yeni bir conversation kaydı açılır.

CREATE TABLE IF NOT EXISTS conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT NOT NULL,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  user_identifier TEXT
);

CREATE INDEX IF NOT EXISTS idx_conversations_session_id
  ON conversations (session_id);


-- ── TABLO 2: messages ───────────────────────────────────────
-- Bir conversation içindeki her mesaj satır olarak tutulur.
-- role: 'user' (hasta) veya 'assistant' (yapay zeka) olabilir.

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON messages (conversation_id);


-- ── TABLO 3: leads ──────────────────────────────────────────
-- Randevu talebi bırakan hastaların kayıtları.
-- status sırası: new → contacted → scheduled → completed / cancelled

CREATE TABLE IF NOT EXISTS leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID REFERENCES conversations (id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  preferred_date   TEXT,
  request_summary  TEXT,
  status           TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at
  ON leads (created_at DESC);
