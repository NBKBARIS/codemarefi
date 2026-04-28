import { supabase } from './supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'comment' | 'post_approved' | 'post_rejected';
  title: string;
  message: string | null;
  post_id: string | null;
  is_read: boolean;
  created_at: string;
}

export async function sendNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message?: string,
  postId?: string,
) {
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      type,
      title,
      message: message ?? null,
      post_id: postId ?? null,
    });
  } catch (e) {
    // sessizce geç
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  return count ?? 0;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  return (data as Notification[]) ?? [];
}

export async function markAllRead(userId: string) {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
}

export async function markOneRead(id: string) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}
