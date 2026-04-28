import { supabase } from './supabase';

export interface UserPost {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  author_id: string;
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

export async function deletePost(id: string) {
  const { error } = await supabase
    .from('user_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
