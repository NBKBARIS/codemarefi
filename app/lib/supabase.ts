import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'codemarefi-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }
});

// ── Güvenlik: son aktiflik takibi ──────────────────────────────
const LAST_SEEN_KEY = 'cmf_last_seen';
const SESSION_TIMEOUT_DAYS = 7;
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_DAYS * 24 * 60 * 60 * 1000;

export function updateLastSeen() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_SEEN_KEY, Date.now().toString());
}

export function getLastSeen(): number | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(LAST_SEEN_KEY);
  return val ? parseInt(val) : null;
}

export function isSessionExpiredByInactivity(): boolean {
  const lastSeen = getLastSeen();
  if (!lastSeen) return false; // hiç kayıt yoksa expire sayma
  return Date.now() - lastSeen > SESSION_TIMEOUT_MS;
}

export function clearLastSeen() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LAST_SEEN_KEY);
}

export type CommentRole = 'admin' | 'mod' | 'author' | 'member' | 'guest';

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
