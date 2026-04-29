-- Aktiflik tablosu oluştur
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_key TEXT NOT NULL, -- Örnek: "2026-W18"
  seconds INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_key)
);

-- Index ekle (hızlı sorgulama için)
CREATE INDEX IF NOT EXISTS idx_user_activity_week ON user_activity(week_key);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);

-- RLS (Row Level Security) aktif et
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Herkes kendi aktivitesini görebilir
CREATE POLICY "Users can view own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Herkes kendi aktivitesini güncelleyebilir
CREATE POLICY "Users can update own activity" ON user_activity
  FOR UPDATE USING (auth.uid() = user_id);

-- Herkes kendi aktivitesini ekleyebilir
CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Herkes tüm aktiviteleri görebilir (leaderboard için)
CREATE POLICY "Anyone can view all activities" ON user_activity
  FOR SELECT USING (true);
