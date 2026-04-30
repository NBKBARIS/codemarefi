import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Blogger (eski)
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.bp.blogspot.com' },
      { protocol: 'https', hostname: 'bp.blogspot.com' },
      { protocol: 'https', hostname: '*.google.com' },
      // Unsplash (post thumbnails)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Supabase Storage (profil resimleri)
      { protocol: 'https', hostname: 'mvhlvnnocklutgljueid.supabase.co' },
      // DiceBear (avatar generator)
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
    formats: ['image/webp', 'image/avif'], // Modern formatlar
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive boyutlar
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Küçük resimler
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 gün cache
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "img-src * data: blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
