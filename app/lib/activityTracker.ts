import { supabase } from './supabase';

// Hafta anahtarı oluştur (örnek: "2026-W18")
function getWeekKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

let activityInterval: ReturnType<typeof setInterval> | null = null;
let lastActivityTime = Date.now();

// Aktiflik takibini başlat
export function startActivityTracking() {
  // Zaten çalışıyorsa tekrar başlatma
  if (activityInterval) return;

  // Her 10 saniyede bir aktifliği kaydet
  activityInterval = setInterval(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastActivityTime) / 1000);
    lastActivityTime = now;

    // Eğer 60 saniyeden fazla geçtiyse (kullanıcı başka sekmeye geçmiş olabilir), sayma
    if (elapsedSeconds > 60) return;

    const weekKey = getWeekKey();

    try {
      // Önce mevcut kaydı kontrol et
      const { data: existing } = await supabase
        .from('user_activity')
        .select('seconds')
        .eq('user_id', session.user.id)
        .eq('week_key', weekKey)
        .single();

      if (existing) {
        // Güncelle
        await supabase
          .from('user_activity')
          .update({
            seconds: existing.seconds + elapsedSeconds,
            last_active: new Date().toISOString()
          })
          .eq('user_id', session.user.id)
          .eq('week_key', weekKey);
      } else {
        // Yeni kayıt oluştur
        await supabase
          .from('user_activity')
          .insert({
            user_id: session.user.id,
            week_key: weekKey,
            seconds: elapsedSeconds,
            last_active: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Activity tracking error:', error);
    }
  }, 10000); // 10 saniye

  // Sayfa kapanırken durdur
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', stopActivityTracking);
  }
}

// Aktiflik takibini durdur
export function stopActivityTracking() {
  if (activityInterval) {
    clearInterval(activityInterval);
    activityInterval = null;
  }
}

// Kullanıcı aktivitesini kaydet (mouse hareketi, klavye vs.)
export function recordUserActivity() {
  lastActivityTime = Date.now();
}
