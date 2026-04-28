import { supabase } from './supabase';

export interface UserPost {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  author_id: string;
  user_id?: string;
  is_approved: boolean;
  categories: string[];
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export async function submitUserPost(post: Omit<UserPost, 'id' | 'is_approved' | 'created_at' | 'profiles'>) {
  const { data, error } = await supabase
    .from('user_posts')
    .insert([post])
    .select();
  
  if (error) throw error;
  return data;
}

export async function getPendingPosts() {
  const { data, error } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_approved', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserPost[];
}

export async function getApprovedPosts() {
  const { data, error } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserPost[];
}

export async function approvePost(id: string) {
  const { error } = await supabase
    .from('user_posts')
    .update({ is_approved: true })
    .eq('id', id);

  if (error) throw error;
}

export async function updatePost(id: string, updates: { title: string; content: string; categories: string[] }) {
  // Düzenleme yapılınca tekrar onay beklesin
  const { error } = await supabase
    .from('user_posts')
    .update({ ...updates, is_approved: false })
    .eq('id', id);

  if (error) throw error;
}

export async function deletePost(id: string) {
  // Önce yazarı bul
  const { data: post } = await supabase
    .from('user_posts')
    .select('author_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('user_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Silme sonrası yazarın onaylı gönderi sayısını kontrol et
  // Eğer 0 kaldıysa YAZAR -> ÜYE'ye düşür
  if (post?.author_id) {
    const { count } = await supabase
      .from('user_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', post.author_id)
      .eq('is_approved', true);

    if ((count ?? 0) === 0) {
      // Onaylı gönderisi kalmadı — rolü kontrol et
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', post.author_id)
        .single();

      // Sadece 'author' rolündeyse 'member'a düşür (admin/mod dokunma)
      if (profile?.role === 'author') {
        await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', post.author_id);
      }
    }
  }
}
