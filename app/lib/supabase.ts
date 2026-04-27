import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'codemarefi-auth-token',
  }
});

export type CommentRole = 'admin' | 'mod' | 'member' | 'guest';

export interface CommentType {
  id: string;
  user_id: string | null;
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  role: CommentRole;
  avatar_url: string | null;
  is_approved: boolean;
  likes: number;
  created_at: string;
  replies?: CommentType[]; // for nested structure
}
