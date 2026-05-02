import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.codemarefi.com.tr'),
  title: {
    default: 'CodeMareFi - Discord Bot Kodları & Yazılım Platformu',
    template: '%s | CodeMareFi',
  },
  description: "Türkiye'nin en büyük Discord bot kod paylaşım platformu. Ücretsiz Discord bot kodları, JavaScript, Python, web tasarım rehberleri ve yazılım haberleri.",
  keywords: [
    'discord bot kodları', 'discord bot komutları', 'ücretsiz discord bot',
    'javascript discord bot', 'python discord bot', 'discord.js',
    'web tasarım', 'yazılım geliştirme', 'kod paylaşım', 'codemarefi',
    'discord bot yapımı', 'discord bot 2026', 'türkçe discord bot',
  ],
  authors: [{ name: 'NBK BARIŞ', url: 'https://www.codemarefi.com.tr' }],
  creator: 'NBK BARIŞ',
  publisher: 'CodeMareFi',
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'CodeMareFi - Discord Bot Kodları & Yazılım Platformu',
    description: "Türkiye'nin en büyük Discord bot kod paylaşım platformu. Ücretsiz bot kodları, yazılım rehberleri.",
    type: 'website',
    url: 'https://www.codemarefi.com.tr',
    siteName: 'CodeMareFi',
    locale: 'tr_TR',
    images: [{ url: 'https://www.codemarefi.com.tr/codemarefi-logo.png', width: 1456, height: 720, alt: 'CodeMareFi Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeMareFi - Discord Bot Kodları & Yazılım',
    description: "Türkiye'nin en büyük Discord bot kod paylaşım platformu.",
    images: ['https://www.codemarefi.com.tr/codemarefi-logo.png'],
    creator: '@mare_fi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.codemarefi.com.tr',
    languages: {
      'tr-TR': 'https://www.codemarefi.com.tr',
    },
  },
  verification: {
    google: '8aOQLQYj5GxcMWcGMtjF5y7D_pJh-BV4hUYSZb6BMmE',
  },
};

import Preloader from "./components/Preloader";
import SecurityProvider from "./components/SecurityProvider";
import MobileBlocker from "./components/MobileBlocker";
import ClientOnly from "./components/ClientOnly";
import ActivityTracker from "./components/ActivityTracker";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <Script 
          src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body>
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'CodeMareFi',
            url: 'https://www.codemarefi.com.tr',
            description: "Türkiye'nin en büyük Discord bot kod paylaşım platformu",
            inLanguage: 'tr-TR',
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: 'https://www.codemarefi.com.tr/arama?q={search_term_string}' },
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              name: 'CodeMareFi',
              url: 'https://www.codemarefi.com.tr',
              logo: { '@type': 'ImageObject', url: 'https://www.codemarefi.com.tr/codemarefi-logo.png' },
              sameAs: [
                'https://www.facebook.com/CodeMareFi',
                'https://twitter.com/mare_fi',
              ],
            },
          })}}
        />
        <MobileBlocker />
        <SecurityProvider />
        <ActivityTracker />
        <Preloader />

        <ClientOnly>
          <Navbar />
        </ClientOnly>
        <div id="main-content-wrapper" style={{ minHeight: '80vh' }}>
          {children}
        </div>
        <ClientOnly>
          <Footer />
        </ClientOnly>
      </body>
    </html>
  );
}
