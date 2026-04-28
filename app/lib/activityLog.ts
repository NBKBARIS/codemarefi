import { supabase } from './supabase';

export type LogAction =
  | 'user_register'       // Kayıt oldu
  | 'user_login'          // Giriş yaptı
  | 'post_submit'         // Gönderi gönderdi
  | 'post_approved'       // Gönderi onaylandı
  | 'post_rejected'       // Gönderi reddedildi
  | 'post_deleted'        // Gönderi silindi
  | 'comment_posted'      // Yorum yaptı
  | 'comment_deleted'     // Yorum silindi
  | 'bad_word_detected'   // Küfür/argo tespit edildi
  | 'user_banned'         // Kullanıcı banlandı
  | 'user_unbanned'       // Ban kaldırıldı
  | 'role_changed'        // Rütbe değiştirildi
  | 'username_changed';   // İsim değiştirildi

export interface ActivityLog {
  id: string;
  action: LogAction;
  actor_id: string | null;      // işlemi yapan (admin/mod veya kullanıcının kendisi)
  target_id: string | null;     // etkilenen kullanıcı
  target_name: string | null;   // etkilenen kullanıcı adı
  details: string | null;       // ek bilgi (gönderi başlığı, küfür içeriği vb.)
  ip: string | null;
  created_at: string;
}

export async function writeLog(
  action: LogAction,
  details: string,
  actorId?: string | null,
  targetId?: string | null,
  targetName?: string | null,
) {
  try {
    await supabase.from('activity_logs').insert({
      action,
      actor_id: actorId ?? null,
      target_id: targetId ?? null,
      target_name: targetName ?? null,
      details,
    });
  } catch (e) {
    // Log yazma hatası sessizce geçilir, ana işlemi engellemesin
  }
}

export const LOG_LABELS: Record<LogAction, { label: string; color: string; icon: string }> = {
  user_register:     { label: 'Kayıt Oldu',          color: '#2ea44f', icon: 'fa-user-plus' },
  user_login:        { label: 'Giriş Yaptı',          color: '#007bff', icon: 'fa-right-to-bracket' },
  post_submit:       { label: 'Gönderi Gönderdi',     color: '#ff8c00', icon: 'fa-paper-plane' },
  post_approved:     { label: 'Gönderi Onaylandı',    color: '#2ea44f', icon: 'fa-circle-check' },
  post_rejected:     { label: 'Gönderi Reddedildi',   color: '#e60000', icon: 'fa-circle-xmark' },
  post_deleted:      { label: 'Gönderi Silindi',      color: '#e60000', icon: 'fa-trash' },
  comment_posted:    { label: 'Yorum Yaptı',          color: '#00bcd4', icon: 'fa-comment' },
  comment_deleted:   { label: 'Yorum Silindi',        color: '#e60000', icon: 'fa-comment-slash' },
  bad_word_detected: { label: 'Uygunsuz İçerik',     color: '#ff4444', icon: 'fa-triangle-exclamation' },
  user_banned:       { label: 'Kullanıcı Banlandı',   color: '#e60000', icon: 'fa-ban' },
  user_unbanned:     { label: 'Ban Kaldırıldı',       color: '#2ea44f', icon: 'fa-unlock' },
  role_changed:      { label: 'Rütbe Değiştirildi',   color: '#9c27b0', icon: 'fa-user-gear' },
  username_changed:  { label: 'İsim Değiştirildi',    color: '#ff8c00', icon: 'fa-pen' },
};
