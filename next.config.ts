import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.bp.blogspot.com' },
      { protocol: 'https', hostname: 'bp.blogspot.com' },
      { protocol: 'https', hostname: '*.google.com' },
    ],
    unoptimized: true,
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
