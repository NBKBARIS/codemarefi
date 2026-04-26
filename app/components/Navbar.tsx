'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const GREEN_MSGS = [
  'Sitemizden En İyi Şekilde Yararlanabilmek için GOOGLE Chrome Kullanmanızı Tavsiye Ederiz {CodeMareFi}',
  'TÜRKİYENİN EN BÜYÜK VE KALİTELİ DİSCORD BOT KOD PAYLAŞIM SİTESİ {CodeMareFi}',
  'Yorum Yaparak Ve Paylaşarak Bize Destek Olabilirsiniz {CodeMareFi}',
];
const RED_MSGS = [
  'Ücretli BOT yazıyorum diyenlere inanmayın Aynı botu ve kodları CodeMareFi de ücretsiz bulabilirsiniz {MareFi}',
  'DİSCORD BOT KODLARI VE 900 YE YAKIN DİSCORD BOT KOMUTLARI YAKINDA PAYLAŞILACAKTIR TAKİPTE KALIN {MareFi}',
  'CodeMareFi Sitemizde Bulunan Herhangi Bir Konularda Aldığınız Hatayı Yorumlarda Belirtiniz {MareFi}',
];

function useTypewriter(msgs: string[], charDelay = 60, deleteDelay = 30, pause = 2800) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const cur = msgs[idx];
    const t = setTimeout(() => {
      if (!deleting && text === cur) { setTimeout(() => setDeleting(true), pause); return; }
      if (deleting && text === '') { setDeleting(false); setIdx(i => (i + 1) % msgs.length); return; }
      setText(cur.substring(0, deleting ? text.length - 1 : text.length + 1));
    }, deleting ? deleteDelay : charDelay);
    return () => clearTimeout(t);
  }, [text, deleting, idx, msgs, charDelay, deleteDelay, pause]);
  return text;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const greenText = useTypewriter(GREEN_MSGS, 55, 25, 3000);
  const redText = useTypewriter(RED_MSGS, 65, 28, 2800);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navItems = [
    { label: 'Home', icon: 'fa-house', href: '/', active: true },
    { label: '+ En Yeniler', href: '/kategori/En-Yeniler' },
    { label: '★ MEGA Menü', href: '#' },
    { label: '♥ Öne Çıkan Yazılar', href: '/kategori/Öne-Çıkanlar' },
    { label: '✎ Web Tasarım', href: '/kategori/Web-Tasarım' },
    { label: '</> Discord Bot Konuları', href: '/kategori/Discord-bot-konuları' },
  ];

  return (
    <>
      {/* ── EN ÜST BAR: sayfalar + sosyal ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '5px 0' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {['Ana Sayfa', 'Yönetim', 'İletişim', 'Duyurular', 'Hakkımızda', 'Site Haritası'].map(l => (
              <a key={l} href="#" style={{ color: '#bbb', fontSize: '12px', padding: '3px 10px', borderRight: '1px solid #222', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
                onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
              >{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[
              { icon: 'fa-twitter', url: 'https://twitter.com/mare_fi' },
              { icon: 'fa-facebook-f', url: 'https://facebook.com/CodeMareFi' },
              { icon: 'fa-google-plus-g', url: '#' },
              { icon: 'fa-instagram', url: '#' },
              { icon: 'fa-youtube', url: '#' },
              { icon: 'fa-vimeo-v', url: '#' },
              { icon: 'fa-soundcloud', url: '#' },
              { icon: 'fa-pinterest-p', url: '#' },
              { icon: 'fa-github', url: '#' },
              { icon: 'fa-dribbble', url: '#' },
              { icon: 'fa-vk', url: '#' },
            ].map(s => (
              <a key={s.icon} href={s.url} target="_blank" rel="noreferrer" style={{ color: '#888', fontSize: '12px', padding: '3px 5px', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                <i className={`fa-brands ${s.icon}`}></i>
              </a>
            ))}
            <a href="/arama" style={{ color: '#888', fontSize: '12px', padding: '3px 8px', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </a>
          </div>
        </div>
      </div>

      {/* ── TYPEWRITER DUYURU BARLARI ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '6px 15px 0' }}>
        {/* Yeşil bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #2ea44f', background: 'rgba(46,164,79,0.06)', padding: '8px 14px', marginBottom: '5px', fontSize: '13px', fontWeight: 600, minHeight: '38px' }}>
          <span style={{ fontSize: '16px' }}>📢</span>
          <span style={{ color: '#fff' }}>{greenText}<span style={{ color: '#e60000', animation: 'blink 0.7s infinite' }}>|</span></span>
        </div>
        {/* Kırmızı bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e60000', background: 'rgba(230,0,0,0.06)', padding: '8px 14px', fontSize: '13px', fontWeight: 600, minHeight: '38px' }}>
          <span style={{ fontSize: '16px' }}>📢</span>
          <span style={{ color: '#fff' }}>{redText}<span style={{ color: '#e60000', animation: 'blink 0.7s infinite' }}>|</span></span>
        </div>
      </div>

      {/* ── HEADER: LOGO + AD ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '18px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="CodeMareFi"
            style={{ height: '75px', width: 'auto' }}
          />
        </Link>
        {/* Reklam alanı */}
        <div style={{ flex: 1, maxWidth: '760px', height: '90px', marginLeft: '20px' }}></div>
      </div>

      {/* ── STICKY NAVBAR ── */}
      <nav style={{
        background: '#1a1a1a',
        borderTop: '1px solid #222',
        borderBottom: '2px solid #e60000',
        position: 'sticky',
        top: 0,
        zIndex: 999,
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'stretch' }}>
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 18px',
                height: '46px',
                fontSize: '13px',
                fontWeight: 700,
                color: item.active ? '#fff' : '#e60000',
                background: item.active ? '#e60000' : 'transparent',
                textDecoration: 'none',
                borderRight: '1px solid #2a2a2a',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                if (!item.active) {
                  (e.currentTarget as HTMLElement).style.background = '#2a2a2a';
                }
              }}
              onMouseLeave={e => {
                if (!item.active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              {item.icon && <i className={`fa-solid ${item.icon}`} style={{ fontSize: '13px' }}></i>}
              {item.label}
            </Link>
          ))}
          {/* Shuffle */}
          <div
            style={{ marginLeft: 'auto', background: '#e60000', width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#cc0000')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#e60000')}
            title="Rastgele Yazı"
          >
            <i className="fa-solid fa-shuffle" style={{ color: '#fff', fontSize: '15px' }}></i>
          </div>
        </div>
      </nav>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '36px', height: '36px',
          background: '#e60000', color: '#fff',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', zIndex: 1000,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'all' : 'none',
          transition: 'opacity 0.3s',
        }}
        aria-label="Yukarı çık"
      >
        <i className="fa-solid fa-angle-up"></i>
      </button>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}
