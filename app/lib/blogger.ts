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

async function getMergedPosts(): Promise<BlogPost[]> {
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
    authorId: p.author_id, // UUID — profil linki için
    commentCount: 0,
    slug: p.id
  }));

  const bloggerPosts: BlogPost[] = localPosts.map(p => ({ ...p, url: `/post/${p.id}` })) as BlogPost[];
  
  return [...bloggerPosts, ...mappedUserPosts].sort((a, b) => 
    new Date(b.published).getTime() - new Date(a.published).getTime()
  );
}


export async function fetchPosts(maxResults = 10, startIndex = 1, label?: string): Promise<{ posts: BlogPost[]; total: number }> {
  let allPosts = await getMergedPosts();
  
  if (label) {
    allPosts = allPosts.filter(p => p.categories.includes(label));
  }

  const total = allPosts.length;
  const start = startIndex - 1;
  const paginated = allPosts.slice(start, start + maxResults);

  return { posts: paginated, total };
}


export async function searchPosts(query: string): Promise<BlogPost[]> {
  await new Promise(r => setTimeout(r, 100));
  const q = query.toLowerCase();
  
  const filtered = localPosts.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.content.toLowerCase().includes(q)
  );

  const mappedPosts = filtered.map(p => ({ ...p, url: `/post/${p.id}` }));
  return mappedPosts as BlogPost[];
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  // Önce localPosts'ta ara
  const local = localPosts.find(p => p.id === id);
  if (local) return ({ ...local, url: `/post/${local.id}` } as BlogPost);

  // Yoksa Supabase'de ara
  const { data: userPost } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (userPost) {
    return {
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
