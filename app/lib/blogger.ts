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

import { localPosts, LocalPost } from './localPosts';

export async function fetchPosts(maxResults = 10, startIndex = 1, label?: string): Promise<{ posts: BlogPost[]; total: number }> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 100));

  let filtered = [...localPosts];
  if (label) {
    filtered = filtered.filter(p => p.categories.includes(label));
  }

  // Sort by published date descending
  filtered.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  const total = filtered.length;
  // startIndex is 1-based in Blogger API
  const start = startIndex - 1;
  const paginated = filtered.slice(start, start + maxResults);

  const mappedPosts = paginated.map(p => ({ ...p, url: `/post/${p.id}` }));
  return { posts: mappedPosts as BlogPost[], total };
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
  await new Promise(r => setTimeout(r, 100));
  const post = localPosts.find(p => p.id === id);
  return post ? ({ ...post, url: `/post/${post.id}` } as BlogPost) : null;
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
