import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
          '/yonetim',      // Admin paneli indexlenmesin
          '/profil',       // Kişisel profil sayfası
          '/paylas',       // Form sayfası
          '/auth/',        // Auth callback sayfaları
        ],
      },
      {
        // Google bot için özel kural — daha agresif tarama
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/yonetim', '/profil', '/auth/'],
      },
    ],
    sitemap: 'https://www.codemarefi.com/sitemap.xml',
    host: 'https://www.codemarefi.com',
  };
}
