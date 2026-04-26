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

function apiUrl(params: Record<string, string>): string {
  const base = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
  const qs = new URLSearchParams(params).toString();
  return `${base}/api/posts?${qs}`;
}

export async function fetchPosts(maxResults = 10, startIndex = 1, label?: string): Promise<{ posts: BlogPost[]; total: number }> {
  const params: Record<string, string> = {
    maxResults: String(maxResults),
    startIndex: String(startIndex),
  };
  if (label) params.label = label;

  const res = await fetch(apiUrl(params));
  if (!res.ok) return { posts: [], total: 0 };

  const data = await res.json();
  const feed = data.feed;
  if (!feed) return { posts: [], total: 0 };
  const total = parseInt(feed['openSearch$totalResults']?.['$t'] || '0', 10);
  const entries = feed.entry || [];

  return { posts: entries.map(parsePost), total };
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  const params: Record<string, string> = { q: query, maxResults: '20', startIndex: '1' };
  const res = await fetch(apiUrl(params));
  if (!res.ok) return [];
  const data = await res.json();
  const entries = data.feed?.entry || [];
  return entries.map(parsePost);
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  const params: Record<string, string> = { postId: id };
  const res = await fetch(apiUrl(params));
  if (!res.ok) return null;

  const data = await res.json();
  // Handle different potential structures from proxy/blogger
  const entry = data.entry || (data.title ? data : null);
  if (!entry) return null;

  return parsePost(entry);
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
