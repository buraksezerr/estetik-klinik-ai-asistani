-- ============================================================
-- Rönaplasti Demo — leads tablosu güncelleme
-- ============================================================
-- Kullanım: Supabase Dashboard > SQL Editor > New query
-- Bu dosyanın tamamını yapıştır ve "Run" ile çalıştır.
-- ============================================================

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS notes        TEXT,
  ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ;
