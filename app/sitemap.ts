import { MetadataRoute } from 'next';
import { localPosts } from './lib/localPosts';
import { createClient } from '@supabase/supabase-js';

const CATEGORIES = [
  'Discord-bot-kodları', 'Discord-bot-konuları', 'Discord-Konuları',
  'Discord-Hazır-Bot-Altyapılar', 'Genel Konular', 'JavaScript',
  'Blogger-Konuları', 'CSS', 'Html', 'Tavsiyemiz', 'Popüler', 'Python',
  'Web-Tasarım', 'UI-UX', 'Yazılım-Haberleri', 'Siber-Güvenlik', 'Yapay-Zeka',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.codemarefi.com.tr';
  const now = new Date();

  // Ana sayfalar
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/hakkimizda`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/iletisim`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/arama`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${baseUrl}/paylas`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Kategori sayfaları
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${baseUrl}/kategori/${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // localPosts
  const localPostRoutes: MetadataRoute.Sitemap = localPosts.map(post => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.updated || post.published),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Supabase user_posts (onaylı)
  let userPostRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from('user_posts')
      .select('id, created_at, updated_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(500);

    if (data) {
      userPostRoutes = data.map(p => ({
        url: `${baseUrl}/post/${p.id}`,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Supabase erişilemezse sessizce geç
  }

  return [...staticRoutes, ...categoryRoutes, ...localPostRoutes, ...userPostRoutes];
}
