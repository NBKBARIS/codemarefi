// Blogger API helper — all fetches go through /api/posts proxy to avoid CORS
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  categories: string[];
  url: string;
  thumbnail?: string;
  author: string;
  authorId?: string; // UUID — user postlarda profil linki için
  commentCount: number;
  slug: string;
}

function extractSlugFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1].replace('.html', '');
  } catch {
    return url;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePost(entry: any): BlogPost {
  const links: Array<{ rel: string; href: string }> = entry.link || [];
  const altLink = links.find((l) => l.rel === 'alternate')?.href || '';
  const categories: string[] = (entry.category || []).map((c: { term: string }) => c.term);
  
  // High quality thumbnail fix
  let thumb: string = entry['media$thumbnail']?.url || '';
  const content = entry.content?.['$t'] || '';
  
  if (thumb) {
    thumb = thumb.replace(/\/s\d+(-c)?\//, '/s1600/').replace('http://', 'https://');
  } else {
    // If no native thumbnail, extract first image from content
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      thumb = imgMatch[1].replace(/\/s\d+(-c)?\//, '/s1600/').replace('http://', 'https://');
    }
  }
  
  const thr: string = entry['thr$total']?.['$t'] || '0';
  const idStr: string = entry.id?.['$t'] || '';
  // Extract only the numeric part of the ID (e.g., from post-123456789)
  const postId = idStr.split('-').pop() || idStr;
  const slug = extractSlugFromUrl(altLink);

  return {
    id: postId,
    title: entry.title?.['$t'] || '',
    content: content,
    published: entry.published?.['$t'] || '',
    updated: entry.updated?.['$t'] || '',
    categories,
    url: `/post/${postId}`, // Map to ID-based local route
    thumbnail: thumb,
    author: entry.author?.[0]?.name?.['$t'] || 'NBK BARIŞ',
    commentCount: parseInt(thr, 10),
    slug,
  };
}

import { localPosts, LocalPost } from './localPosts';
import { supabase } from './supabase';
import { getApprovedPosts, UserPost } from './userPosts';

// ── İstemci tarafı in-memory cache ───────────────────────────
const postCache = new Map<string, { data: any; ts: number }>();
const POST_CACHE_TTL = 30 * 1000; // 30 saniye (debug için kısalttık)

function getCache<T>(key: string): T | null {
  const entry = postCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > POST_CACHE_TTL) { postCache.delete(key); return null; }
  return entry.data as T;
}
function setPostCache(key: string, data: any) {
  postCache.set(key, { data, ts: Date.now() });
}

// Tüm merged postları cache'le
let mergedPostsCache: { data: BlogPost[]; ts: number } | null = null;

async function getMergedPosts(): Promise<BlogPost[]> {
  // Cache geçerliyse direkt dön
  if (mergedPostsCache && Date.now() - mergedPostsCache.ts < POST_CACHE_TTL) {
    return mergedPostsCache.data;
  }

  const approved = await getApprovedPosts();
  
  const mappedUserPosts: BlogPost[] = approved.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    published: p.created_at,
    updated: p.created_at,
    categories: p.categories,
    url: `/post/${p.id}`,
    thumbnail: p.thumbnail_url,
    author: p.profiles?.full_name || 'Üye',
    authorId: p.author_id,
    commentCount: 0,
    slug: p.id
  }));

  const bloggerPosts: BlogPost[] = localPosts.map(p => ({ ...p, url: `/post/${p.id}` })) as BlogPost[];
  const localIds = new Set(localPosts.map(p => p.id));
  const localTitles = new Set(localPosts.map(p => p.title.trim().toLowerCase()));

  const filteredUserPosts = mappedUserPosts.filter(p => !localIds.has(p.id) && !localTitles.has(p.title.trim().toLowerCase()));

  const merged = [...bloggerPosts, ...filteredUserPosts].sort((a, b) =>
    new Date(b.published).getTime() - new Date(a.published).getTime()
  );

  mergedPostsCache = { data: merged, ts: Date.now() };
  return merged;
}


// Cache'i dışarıdan temizlemek için
export function invalidatePostCache() {
  mergedPostsCache = null;
  postCache.clear();
}

export async function fetchPosts(maxResults = 10, startIndex = 1, label?: string): Promise<{ posts: BlogPost[]; total: number }> {
  let allPosts = await getMergedPosts();
  
  console.log(`🔍 fetchPosts çağrıldı - maxResults: ${maxResults}, startIndex: ${startIndex}, label: ${label || 'yok'}`);
  console.log(`📚 Toplam post sayısı (filtreleme öncesi): ${allPosts.length}`);
  
  if (label) {
    allPosts = allPosts.filter(p => p.categories.includes(label));
    console.log(`🏷️ Label filtrelendi (${label}): ${allPosts.length} post kaldı`);
  }

  const total = allPosts.length;
  const start = startIndex - 1;
  const paginated = allPosts.slice(start, start + maxResults);
  
  console.log(`✂️ Slice: ${start} - ${start + maxResults}, Dönen: ${paginated.length} post`);

  return { posts: paginated, total };
}


export async function searchPosts(query: string): Promise<BlogPost[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // localPosts'ta ara
  const localResults = localPosts
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.categories.some(c => c.toLowerCase().includes(q))
    )
    .map(p => ({ ...p, url: `/post/${p.id}` })) as BlogPost[];

  // Supabase user_posts'ta ara (onaylı)
  const { data: userResults } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_approved', true)
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .limit(20);

  const mappedUserPosts: BlogPost[] = (userResults || []).map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    published: p.created_at,
    updated: p.created_at,
    categories: p.categories,
    url: `/post/${p.id}`,
    thumbnail: p.thumbnail_url,
    author: p.profiles?.full_name || 'Üye',
    authorId: p.author_id,
    commentCount: 0,
    slug: p.id,
  }));

  // Supabase sonuçlarından localResults içinde olanları (ID veya başlık eşleşmesi) filtrele
  const localIds = new Set(localResults.map(p => p.id));
  const localTitles = new Set(localResults.map(p => p.title.trim().toLowerCase()));

  const filteredUserPosts = mappedUserPosts.filter(p => !localIds.has(p.id) && !localTitles.has(p.title.trim().toLowerCase()));

  // Birleştir, tarihe göre sırala
  return [...localResults, ...filteredUserPosts].sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  // Cache'de var mı?
  const cached = getCache<BlogPost>(`post:${id}`);
  if (cached) return cached;

  // Önce localPosts'ta ara
  const local = localPosts.find(p => p.id === id);
  if (local) {
    const result = { ...local, url: `/post/${local.id}` } as BlogPost;
    setPostCache(`post:${id}`, result);
    return result;
  }

  // Yoksa Supabase'de ara
  const { data: userPost } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (userPost) {
    const result: BlogPost = {
      id: userPost.id,
      title: userPost.title,
      content: userPost.content,
      published: userPost.created_at,
      updated: userPost.created_at,
      categories: userPost.categories,
      url: `/post/${userPost.id}`,
      thumbnail: userPost.thumbnail_url,
      author: userPost.profiles?.full_name || 'Üye',
      authorId: userPost.author_id,
      commentCount: 0,
      slug: userPost.id
    };
    setPostCache(`post:${id}`, result);
    return result;
  }

  return null;
}


export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getTagClass(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('discord-bot-kodları') || cat.includes('discord-bot-kod')) return 'tag-discord';
  if (cat.includes('javascript')) return 'tag-js';
  if (cat.includes('genel')) return 'tag-genel';
  if (cat.includes('blogger')) return 'tag-blogger';
  return 'tag-default';
}

export const CATEGORIES = [
  'Discord-bot-kodları',
  'Discord-bot-konuları',
  'Discord-Konuları',
  'Discord-Hazır-Bot-Altyapılar',
  'Genel Konular',
  'JavaScript',
  'Blogger-Konuları',
  'CSS',
  'Html',
  'Tavsiyemiz',
  'Popüler',
  'Python',
];
