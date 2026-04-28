'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchPosts, formatDate, BlogPost } from './lib/blogger';
import PostCard from './components/PostCard';
import Sidebar from './components/Sidebar';

const POSTS_PER_PAGE = 8;

const BANNERS = [
  { text: "TÜRKİYENİN EN BÜYÜK VE KALİTELİ DİSCORD BOT KOD PAYLAŞIM SİTESİ", color: "#8cc63f", icon: "fa-solid fa-leaf" },
  { text: "SİTEMİZE HOŞ GELDİNİZ! YENİ NESİL KOD PAYLAŞIM PLATFORMU", color: "#e60000", icon: "fa-solid fa-fire" },
  { text: "BİLGİSAYAR, YAZILIM VE BOT KODLARI HAKKINDA HER ŞEY BURADA", color: "#00a8cc", icon: "fa-solid fa-code" },
  { text: "DİSCORD SUNUCUMUZA KATILARAK BİZE DESTEK OLABİLİRSİNİZ", color: "#5865f2", icon: "fa-brands fa-discord" },
];

const TABS = [
  { label: 'SON EKLENENLER', icon: 'fa-clock',     cat: '' },
  { label: 'TRENDLER',       icon: 'fa-fire',      cat: 'Discord-bot-kodları' },
  { label: 'TAVSİYEMİZ',     icon: 'fa-thumbs-up', cat: 'Tavsiyemiz' },
  { label: 'POPÜLERLER',     icon: 'fa-star',      cat: 'Popüler' },
];

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts]               = useState<BlogPost[]>([]);
  const [heroPosts, setHeroPosts]       = useState<BlogPost[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [heroIdx, setHeroIdx]           = useState(0);
  const [tickerIdx, setTickerIdx]       = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [bannerIdx, setBannerIdx]       = useState(0);
  const [activeTab, setActiveTab]       = useState('SON EKLENENLER');
  const [allPosts, setAllPosts]         = useState<BlogPost[]>([]); // for shuffle
  const [debugInfo, setDebugInfo]       = useState<string>(''); // DEBUG

  // Fetch posts — liste için sayfalama
  useEffect(() => {
    setLoading(true);
    const tab = TABS.find(t => t.label === activeTab);
    
    // 1. sayfada hero için 5 post + liste için 8 post = 13 post çek
    // Diğer sayfalarda normal 8 post çek
    const postsToFetch = page === 1 ? POSTS_PER_PAGE + 5 : POSTS_PER_PAGE;
    // startIndex: 1. sayfa = 1, 2. sayfa = 14 (5 hero + 8 liste + 1), 3. sayfa = 22, vb.
    const startIndex = page === 1 ? 1 : 1 + 5 + ((page - 1) * POSTS_PER_PAGE);
    
    fetchPosts(postsToFetch, startIndex, tab?.cat || '').then(({ posts: p, total: t }) => {
      console.log(`📄 Sayfa ${page} - İstenen: ${postsToFetch}, Gelen: ${p.length}, Toplam: ${t}, StartIndex: ${startIndex}`);
      console.log('📝 Gelen postlar:', p.map(post => ({ id: post.id, title: post.title })));
      
      // DEBUG: Ekrana yazdır
      setDebugInfo(`Sayfa: ${page} | İstenen: ${postsToFetch} | Gelen: ${p.length} | Toplam: ${t} | Hero: ${heroPosts.length}`);
      
      setPosts(p);
      setTotal(t);
      setLoading(false);
    });
  }, [page, activeTab, heroPosts.length]);

  // Hero için sadece 1 kez ilk 5 postu çek (sayfa/tab değişince güncelle)
  useEffect(() => {
    const tab = TABS.find(t => t.label === activeTab);
    fetchPosts(5, 1, tab?.cat || '').then(({ posts: p }) => {
      setHeroPosts(p);
    });
  }, [activeTab]);

  // Fetch all posts once for shuffle
  useEffect(() => {
    fetchPosts(100, 1, '').then(({ posts: p }) => setAllPosts(p));
  }, []);

  // Hero slider
  useEffect(() => {
    if (!posts.length) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % Math.min(posts.length, 5)), 6000);
    return () => clearInterval(t);
  }, [posts]);

  // Ticker
  useEffect(() => {
    if (!posts.length || tickerPaused) return;
    const t = setInterval(() => setTickerIdx(i => (i + 1) % Math.min(posts.length, 8)), 4000);
    return () => clearInterval(t);
  }, [posts, tickerPaused]);

  // Banner
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  // Shuffle: random post
  const handleShuffle = useCallback(() => {
    const pool = allPosts.length > 0 ? allPosts : posts;
    if (!pool.length) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    router.push(random.url);
  }, [allPosts, posts, router]);

  // Expose shuffle to Navbar via custom event
  useEffect(() => {
    const handler = () => handleShuffle();
    window.addEventListener('cmf-shuffle', handler);
    return () => window.removeEventListener('cmf-shuffle', handler);
  }, [handleShuffle]);

  // Toplam sayfa hesaplama: İlk 5 post hero'da gösteriliyor, geri kalanı sayfalara bölünüyor
  const totalPages  = Math.ceil(Math.max(0, total - 5) / POSTS_PER_PAGE) + 1;
  const tickerPosts = posts.slice(0, 8);
  // 1. sayfada: ilk 5 post hero'da, sonraki 8 post listede
  // Diğer sayfalarda: tüm postlar listede
  const listPosts   = page === 1 ? posts.slice(5, 13) : posts.slice(0, POSTS_PER_PAGE);

  return (
    <>
      {/* DEBUG PANEL - Geçici */}
      <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: '#e60000', color: '#fff', padding: '20px 30px', borderRadius: '12px', fontSize: '16px', zIndex: 99999, fontFamily: 'monospace', boxShadow: '0 8px 30px rgba(230,0,0,0.8)', fontWeight: 'bold', border: '3px solid #fff' }}>
        🐛 DEBUG: Sayfa={page} | İstenen={page === 1 ? 13 : 8} | Gelen={posts.length} | Toplam={total} | Hero={heroPosts.length} | Liste={listPosts.length}
      </div>

      {/* ── TICKER ── */}
      {tickerPosts.length > 0 && (
        <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div className="post-ticker-bar">
              <Link href={tickerPosts[tickerIdx]?.url || '#'} className="post-ticker-content" style={{ textDecoration: 'none' }}>
                {tickerPosts[tickerIdx]?.thumbnail && (
                  <img src={tickerPosts[tickerIdx].thumbnail} alt="" className="post-ticker-img" />
                )}
                <div className="post-ticker-info">
                  <div className="post-ticker-meta">
                    <i className="fa-solid fa-user" style={{ marginRight: '4px', color: '#e60000', fontSize: '9px' }}></i>
                    {tickerPosts[tickerIdx]?.author} — {tickerPosts[tickerIdx]?.published ? formatDate(tickerPosts[tickerIdx].published) : ''}
                  </div>
                  <div className="post-ticker-title">{tickerPosts[tickerIdx]?.title}</div>
                </div>
              </Link>
              <div className="post-ticker-controls">
                <button className="ticker-btn" onClick={() => setTickerIdx(i => (i - 1 + tickerPosts.length) % tickerPosts.length)} aria-label="Önceki">
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
                <button className="ticker-btn" onClick={() => setTickerPaused(p => !p)} aria-label={tickerPaused ? 'Oynat' : 'Duraklat'}>
                  <i className={`fa-solid ${tickerPaused ? 'fa-play' : 'fa-pause'}`}></i>
                </button>
                <button className="ticker-btn" onClick={() => setTickerIdx(i => (i + 1) % tickerPosts.length)} aria-label="Sonraki">
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ANA İÇERİK + SIDEBAR ── */}
      <div className="main-layout">
        <div>

          {/* Dönen Banner */}
          <div
            key={bannerIdx}
            style={{
              background: `linear-gradient(90deg, ${BANNERS[bannerIdx].color}22, ${BANNERS[bannerIdx].color}11)`,
              border: `1px solid ${BANNERS[bannerIdx].color}44`,
              padding: '10px 15px',
              color: '#fff',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              borderRadius: '3px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              animation: 'fadeIn 0.5s',
            }}
          >
            <i className={BANNERS[bannerIdx].icon} style={{ fontSize: '14px', color: BANNERS[bannerIdx].color }}></i>
            <span style={{ color: BANNERS[bannerIdx].color, fontWeight: 700 }}>{BANNERS[bannerIdx].text}</span>
          </div>

          {/* Sekmeler */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid #222', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(tab.label); setPage(1); }}
                style={{
                  background: activeTab === tab.label ? '#e60000' : 'transparent',
                  color: activeTab === tab.label ? '#fff' : '#888',
                  border: 'none',
                  borderBottom: activeTab === tab.label ? '2px solid #e60000' : '2px solid transparent',
                  padding: '10px 18px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  marginBottom: '-2px',
                }}
                onMouseEnter={e => { if (activeTab !== tab.label) e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { if (activeTab !== tab.label) e.currentTarget.style.color = '#888'; }}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hero Featured Grid — sadece 1. sayfada */}
          {page === 1 && heroPosts.length > 0 && (
            <div className="featured-grid" style={{ marginBottom: '30px' }}>

              {/* Sol: Büyük Hero Slider */}
              {heroPosts[heroIdx] && (
                <div className="featured-main" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => router.push(heroPosts[heroIdx].url)}
                >
                  {heroPosts[heroIdx].thumbnail && (
                    <img
                      key={heroIdx}
                      src={heroPosts[heroIdx].thumbnail}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, animation: 'fadeIn 0.6s' }}
                    />
                  )}
                  <div className="featured-main-overlay"></div>
                  <div className="featured-main-content">
                    <span className="featured-cat-badge">{heroPosts[heroIdx].categories[0]?.replace(/-/g, ' ') || 'GÜNCEL'}</span>
                    <h2 className="featured-main-title">{heroPosts[heroIdx].title}</h2>
                    <div className="featured-main-meta">
                      <span><i className="fa-solid fa-user" style={{ color: '#e60000', marginRight: '5px' }}></i>{heroPosts[heroIdx].author}</span>
                      <span><i className="fa-regular fa-clock" style={{ marginRight: '5px' }}></i>{formatDate(heroPosts[heroIdx].published)}</span>
                      <span style={{ marginLeft: 'auto', background: '#e60000', color: '#fff', padding: '4px 12px', fontSize: '11px', fontWeight: 700, borderRadius: '2px' }}>
                        Devamını Oku →
                      </span>
                    </div>
                  </div>
                  {/* Dots */}
                  <div className="featured-slider-dots">
                    {heroPosts.map((_, i) => (
                      <div
                        key={i}
                        onClick={e => { e.stopPropagation(); setHeroIdx(i); }}
                        className={`slider-dot ${heroIdx === i ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sağ: 2x2 Grid */}
              <div className="featured-side">
                {heroPosts.filter((_, i) => i !== heroIdx).slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="featured-small" onClick={() => router.push(p.url)} style={{ cursor: 'pointer' }}>
                    {p.thumbnail && (
                      <img src={p.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <div className="featured-small-overlay"></div>
                    <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
                      <span className="featured-small-cat" style={{ background: idx % 2 === 0 ? '#2ea44f' : '#e60000' }}>
                        {p.categories[0]?.replace(/-/g, ' ') || 'KATEGORİ'}
                      </span>
                    </div>
                    <div className="featured-small-content">
                      <div className="featured-small-title">{p.title}</div>
                      <div className="featured-small-meta">{formatDate(p.published)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bölüm başlığı */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 10px', marginBottom: '10px', borderBottom: '2px solid #e60000' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-fire" style={{ color: '#e60000', fontSize: '15px' }}></i>
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#fff' }}>
                {activeTab === 'SON EKLENENLER' ? 'EN YENİLER' : activeTab}
              </span>
            </div>
            <button
              onClick={handleShuffle}
              title="Rastgele Yazı"
              style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '5px 12px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e60000'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
            >
              <i className="fa-solid fa-shuffle"></i> Rastgele
            </button>
          </div>

          {/* Yazı Listesi */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : listPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
              <i className="fa-solid fa-inbox" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
              Bu kategoride henüz yazı bulunmuyor.
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {listPosts.map(post => <PostCard key={post.id} post={post} />)}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Önceki sayfa">
                    <i className="fa-solid fa-angle-left"></i>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const num = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return (
                      <button key={num} className={`page-btn${page === num ? ' active' : ''}`} onClick={() => setPage(num)}>
                        {num}
                      </button>
                    );
                  })}
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Sonraki sayfa">
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Sidebar />
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
