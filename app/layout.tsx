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
  metadataBase: new URL('https://www.codemarefi.com'),
  title: "CodeMareFi - Modern Yazılım ve Discord Bot Geliştirme Platformu",
  description: "Türkiye'nin en kaliteli Discord bot kodları, güncel yazılım haberleri ve modern web teknolojileri rehberi. CodeMareFi ile geleceğin kodlarını keşfedin.",
  keywords: "discord bot kodları, discord bot komutları, yazılım geliştirme, javascript kod paylaşım, teknoloji haberleri, codemarefi",
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "CodeMareFi - Yazılım & Discord Bot Dünyası",
    description: "Türkiye'nin en büyük ve modern Discord Bot Kod Paylaşım Platformu",
    type: "website",
    url: "https://codemarefi.com",
    images: ['/favicon.png'],
  },
  verification: {
    google: "8aOQLQYj5GxcMWcGMtjF5y7D_pJh-BV4hUYSZb6BMmE",
  },
};

import Preloader from "./components/Preloader";
import SecurityProvider from "./components/SecurityProvider";
import MobileBlocker from "./components/MobileBlocker";
import ClientOnly from "./components/ClientOnly";


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
        <MobileBlocker />
        <SecurityProvider />
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
