'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const greenText = useTypewriter(GREEN_MSGS, 55, 25, 3000);
  const redText = useTypewriter(RED_MSGS, 65, 28, 2800);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data));
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuth);
      window.removeEventListener('scroll', fn);
    };
  }, []);

  const navItems = [
    { label: 'Home', icon: 'fa-house', href: '/', active: true },
    { label: '+ En Yeniler', href: '/kategori/En-Yeniler' },
    { label: '★ MEGA Menü', href: '/arama' },
    { label: '♥ Öne Çıkan Yazılar', href: '/kategori/Öne-Çıkanlar' },
    { label: '✎ Web Tasarım', href: '/kategori/Web-Tasarım' },
    { label: '</> Discord Bot Konuları', href: '/kategori/Discord-bot-konuları' },
  ];

  return (
    <>
      {/* ── EN ÜST BAR: sayfalar + sosyal ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '5px 0' }} className="top-social-bar">
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0' }} className="top-nav-links">
            {[
              { l: 'Ana Sayfa', href: '/' },
              { l: 'İletisim', href: '/iletisim' },
              { l: 'Duyurular', href: '/kategori/Genel%20Konular' },
              { l: 'Hakkımızda', href: '/hakkimizda' },
              { l: 'Site Haritası', href: '/sitemap.xml' }
            ].map(item => (
              <Link key={item.l} href={item.href} style={{ color: '#bbb', fontSize: '12px', padding: '3px 10px', borderRight: '1px solid #222', textDecoration: 'none', transition: 'color 0.2s', display: 'inline-block' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
                onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
              >{item.l}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[
              { icon: 'fa-twitter',     url: 'https://twitter.com/mare_fi' },
              { icon: 'fa-facebook-f',  url: 'https://www.facebook.com/CodeMareFi' },
              { icon: 'fa-google-plus-g', url: null },
              { icon: 'fa-instagram',   url: null },
              { icon: 'fa-youtube',     url: null },
              { icon: 'fa-vimeo-v',     url: null },
              { icon: 'fa-soundcloud',  url: null },
              { icon: 'fa-pinterest-p', url: null },
              { icon: 'fa-github',      url: null },
              { icon: 'fa-dribbble',    url: null },
              { icon: 'fa-vk',          url: null },
            ].map(s => (
              s.url ? (
                <a
                  key={s.icon}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#888', fontSize: '12px', padding: '3px 5px', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#888')}
                >
                  <i className={`fa-brands ${s.icon}`}></i>
                </a>
              ) : (
                <span
                  key={s.icon}
                  title="Çok Yakında"
                  style={{ color: '#333', fontSize: '12px', padding: '3px 5px', cursor: 'default' }}
                >
                  <i className={`fa-brands ${s.icon}`}></i>
                </span>
              )
            ))}
            <a href="/arama" style={{ color: '#888', fontSize: '12px', padding: '3px 8px', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </a>

            {/* Yönetim & Paylaş Butonları (Herkes Görür) */}
            <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/yonetim" style={{
                background: '#333',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fa-solid fa-user-shield" style={{ color: '#e60000' }}></i>
                Yönetim
              </Link>

              <Link href="/paylas" style={{
                background: '#e60000',
                color: '#fff',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fa-solid fa-plus"></i>
                Paylaş
              </Link>

              {/* Giriş / Profil Butonu */}
              <div style={{ marginLeft: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user ? (
                  <Link href="/profil" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e60000' }} />
                    ) : (
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e60000' }}>
                        <i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i>
                      </div>
                    )}
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{profile?.full_name || 'Profilim'}</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                    style={{
                      background: '#1a1a1a',
                      color: '#888',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#888'; }}
                  >
                    <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '5px' }}></i>
                    Giriş Yap
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TYPEWRITER DUYURU BARLARI ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '6px 15px 0' }}>
        {/* Yeşil bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #2ea44f', background: 'rgba(46,164,79,0.06)', padding: '8px 14px', marginBottom: '5px', fontSize: '13px', fontWeight: 600, minHeight: '38px' }}>
          <i className="fa-solid fa-bullhorn" style={{ fontSize: '15px', color: '#2ea44f' }}></i>
          <span style={{ color: '#fff' }}>{greenText}<span style={{ color: '#e60000', animation: 'blink 0.7s infinite' }}>|</span></span>
        </div>
        {/* Kırmızı bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e60000', background: 'rgba(230,0,0,0.06)', padding: '8px 14px', fontSize: '13px', fontWeight: 600, minHeight: '38px' }}>
          <i className="fa-solid fa-bullhorn" style={{ fontSize: '15px', color: '#e60000' }}></i>
          <span style={{ color: '#fff' }}>{redText}<span style={{ color: '#e60000', animation: 'blink 0.7s infinite' }}>|</span></span>
        </div>
      </div>

      {/* ── HEADER: LOGO + AD ── */}
      <div className="site-header">
        <Link href="/" style={{ textDecoration: 'none' }} className="site-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="CodeMareFi"
          />
        </Link>
        {/* Reklam alanı */}
        <div style={{ flex: 1, maxWidth: '760px', height: '90px', marginLeft: '20px' }} className="header-ad"></div>
      </div>

      {/* ── STICKY NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`navbar-item ${item.active ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 18px',
                height: '46px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                borderRight: '1px solid #2a2a2a',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {item.icon && <i className={`fa-solid ${item.icon}`} style={{ fontSize: '13px' }}></i>}
              {item.label}
            </Link>
          ))}
          {/* Shuffle */}
          <div
            onClick={() => window.dispatchEvent(new CustomEvent('cmf-shuffle'))}
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

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}
