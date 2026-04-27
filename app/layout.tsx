import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "CodeMareFi | Blogger Eklentileri ve Discord Bot Kod Paylaşım",
  description: "Blogger konuları, Discord bot komutları, JavaScript kod paylaşımları ve daha fazlası. Kodlara dair her şey CodeMareFi'de!",
  keywords: "discord bot kodları, discord bot komutları, blogger eklentileri, javascript kod paylaşım, codemarefi",
  openGraph: {
    title: "CodeMareFi | Discord Bot Kodları & Blogger Eklentileri",
    description: "Türkiye'nin en büyük Discord Bot Kod Paylaşım Sitesi",
    type: "website",
    url: "https://codemarefi.vercel.app",
  },
};

import Preloader from "./components/Preloader";

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
      </head>
      <body style={{ fontFamily: "'Outfit', Arial, sans-serif" }}>
        <div id="debug-indicator" style={{ position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', zIndex: 10001, padding: '2px 5px', fontSize: '10px', pointerEvents: 'none' }}>
          CodeMareFi-Debug-V3
        </div>
        <Preloader />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('contextmenu', event => event.preventDefault()); console.log('CodeMareFi Debug V3 Loaded');` }} />
      </body>
    </html>
  );
}
