import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CommentRole = 'admin' | 'member' | 'guest';

export interface CommentType {
  id: string;
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
