import { MetadataRoute } from 'next';
import { localPosts } from './lib/localPosts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://codemarefi.com';

  // Ana sayfalar
  const routes = ['', '/hakkimizda', '/iletisim', '/arama'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Blog yazılarını haritaya ekleyelim
  const postRoutes = localPosts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.updated || post.published),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes];
}
