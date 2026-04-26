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
  let base = '';
  if (typeof window === 'undefined') {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      base = process.env.NEXT_PUBLIC_SITE_URL;
    } else if (process.env.VERCEL_URL) {
      base = `https://${process.env.VERCEL_URL}`;
    } else {
      base = 'http://localhost:3000';
    }
  }
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
  // On the server, bypass the proxy and hit Blogger directly to avoid self-fetch network/DNS issues on Vercel
  if (typeof window === 'undefined') {
    const BLOG_ID = process.env.BLOG_ID || '5795750681970782630';
    const API_KEY = process.env.BLOGGER_API_KEY || '';
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${id}?key=${API_KEY}&fetchBody=true&fetchImages=true`;
    
    try {
      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (!res.ok) return null;
      const raw = await res.json();
      
      // Inline transform to match parsePost expectations
      let thumb = raw.images?.[0]?.url || '';
      if (!thumb && raw.content) {
        const m = raw.content.match(/<img[^>]+src="([^">]+)"/);
        if (m) thumb = m[1];
      }
      if (thumb) {
        thumb = thumb.replace(/\/s\d+(-c)?\//, '/s1600/').replace('http://', 'https://');
      }

      const entry = {
        id:        { $t: raw.id || '' },
        title:     { $t: raw.title || '' },
        content:   { $t: raw.content || '' },
        published: { $t: raw.published || '' },
        updated:   { $t: raw.updated || '' },
        link: [
          { rel: 'alternate', href: raw.url || '' },
        ],
        category:  (raw.labels || []).map((l: string) => ({ term: l })),
        author:    [{ name: { $t: raw.author?.displayName || 'MareFi' } }],
        'media$thumbnail': thumb ? { url: thumb } : undefined,
        'thr$total': { $t: String(raw.replies?.totalItems || 0) },
      };
      
      return parsePost(entry);
    } catch (e) {
      console.error('Direct Blogger fetch failed:', e);
      return null;
    }
  }

  // Client-side fallback (if ever called from the client)
  const params: Record<string, string> = { postId: id };
  const res = await fetch(apiUrl(params));
  if (!res.ok) return null;

  const data = await res.json();
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
