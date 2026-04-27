'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchPosts } from './lib/blogger';
import PostCard from './components/PostCard';
import Sidebar from './components/Sidebar';

const POSTS_PER_PAGE = 8;
const CAT_COLORS = ['#5865f2', '#ff5722', '#2ea44f', '#0070f3', '#e91e63', '#9c27b0', '#00bcd4', '#e67e22'];

export default function HomePage() {
  const [posts, setPosts] = useState<{ id: string; title: string; url: string; published: string; thumbnail?: string; author: string; categories: string[]; summary: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  const banners = [
    { text: "TÜRKİYENİN EN BÜYÜK VE KALİTELİ DİSCORD BOT KOD PAYLAŞIM SİTESİ {CodeMareFi}", color: "#8cc63f", icon: "fa-solid fa-leaf" },
    { text: "SİTEMİZE HOŞ GELDİNİZ! YENİ NESİL KOD PAYLAŞIM PLATFORMU", color: "#e60000", icon: "fa-solid fa-fire" },
    { text: "BİLGİSAYAR, YAZILIM VE BOT KODLARI HAKKINDA HER ŞEY BURADA", color: "#00a8cc", icon: "fa-solid fa-code" },
    { text: "DİSCORD SUNUCUMUZA KATILARAK BİZE DESTEK OLABİLİRSİNİZ", color: "#5865f2", icon: "fa-brands fa-discord" },
  ];

  useEffect(() => {
    setLoading(true);
    fetchPosts(POSTS_PER_PAGE + 5, (page - 1) * POSTS_PER_PAGE + 1).then(({ posts: p, total: t }) => {
      setPosts(p);
      setTotal(t);
      setLoading(false);
    });
  }, [page]);

  // Slider auto-advance
  useEffect(() => {
    if (!posts.length) return;
    const t = setInterval(() => setSliderIdx(i => (i + 1) % Math.min(posts.length, 8)), 5000);
    return () => clearInterval(t);
  }, [posts]);

  // Ticker auto-advance
  useEffect(() => {
    if (!posts.length || tickerPaused) return;
    const t = setInterval(() => setTickerIdx(i => (i + 1) % Math.min(posts.length, 8)), 4000);
    return () => clearInterval(t);
  }, [posts, tickerPaused]);

  // Banner auto-advance
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 3500);
    return () => clearInterval(t);
  }, [banners.length]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const slider = posts[sliderIdx] || null;
  // Sağdaki 2 kart için: slider'ın bir öncesi ve sonrası
  const rightCards = posts.slice(1, 3);
  const tickerPosts = posts.slice(0, 8);
  const listPosts = posts.slice(0, POSTS_PER_PAGE);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');
  const prev = () => setSliderIdx(i => (i - 1 + Math.min(posts.length, 8)) % Math.min(posts.length, 8));
  const next = () => setSliderIdx(i => (i + 1) % Math.min(posts.length, 8));

  return (
    <>
      {/* SON YAZILAR - ust yatay thumbnail serit */}
      {posts.length > 0 && (
        <div style={{ background: '#111', borderBottom: '1px solid #222' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', overflow: 'hidden' }}>
            {posts.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={p.url}
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  borderRight: '1px solid #1a1a1a',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* thumbnail */}
                <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', background: '#222' }}>
                  {p.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail}
                      alt=""
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                    />
                  )}
                </div>
                {/* meta */}
                <div style={{ padding: '6px 8px', background: '#111', flex: 1 }}>
                  <div style={{ color: '#888', fontSize: '10px', marginBottom: '3px' }}>
                    <i className="fa-regular fa-clock" style={{ marginRight: '3px' }}></i>
                    {fmtDate(p.published)}
                  </div>
                  <div style={{
                    color: '#ddd', fontSize: '12px', fontWeight: 600, lineHeight: 1.3,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {p.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SON YAZILAR TICKER */}
      {tickerPosts.length > 0 && (
        <div style={{ background: '#141414', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div className="post-ticker-bar">
              <Link href={tickerPosts[tickerIdx]?.url || '#'} className="post-ticker-content" style={{ textDecoration: 'none' }}>
                {tickerPosts[tickerIdx]?.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tickerPosts[tickerIdx].thumbnail} alt="" className="post-ticker-img" />
                )}
                <div className="post-ticker-info">
                  <div className="post-ticker-meta">
                    <i className="fa-solid fa-user" style={{ marginRight: '4px', color: '#e60000', fontSize: '9px' }}></i>
                    {tickerPosts[tickerIdx]?.author} — {tickerPosts[tickerIdx]?.published ? fmtDate(tickerPosts[tickerIdx].published) : ''}
                  </div>
                  <div className="post-ticker-title">{tickerPosts[tickerIdx]?.title}</div>
                </div>
              </Link>
              <div className="post-ticker-controls">
                <button className="ticker-btn" onClick={() => setTickerIdx(i => (i - 1 + tickerPosts.length) % tickerPosts.length)}>
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
                <button className="ticker-btn" onClick={() => setTickerPaused(p => !p)}>
                  <i className={`fa-solid ${tickerPaused ? 'fa-play' : 'fa-pause'}`}></i>
                </button>
                <button className="ticker-btn" onClick={() => setTickerIdx(i => (i + 1) % tickerPosts.length)}>
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANA ICERIK + SIDEBAR */}
      <div className="main-layout">
        <div>

          {/* DİNAMİK ROTATING BANNER */}
          <div style={{ background: banners[bannerIdx].color, padding: '12px 15px', color: '#fff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'background 0.5s ease' }}>
            <i className={banners[bannerIdx].icon} style={{ fontSize: '14px' }}></i>
            <span style={{ transition: 'opacity 0.3s ease', animation: 'fadeIn 0.5s' }} key={bannerIdx}>{banners[bannerIdx].text}</span>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <div style={{ padding: '12px 15px', color: '#fff', fontSize: '13px', fontWeight: 'bold', borderBottom: '2px solid #e60000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '-1px', transition: 'color 0.2s' }}>
              <i className="fa-solid fa-gauge-high"></i> CODEMAREFI TRENDLER
            </div>
            <div style={{ padding: '12px 15px', color: '#888', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#888'}>
              <i className="fa-solid fa-thumbs-up"></i> TAVSİYEMİZ
            </div>
            <div style={{ padding: '12px 15px', color: '#888', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#888'}>
              <i className="fa-solid fa-star"></i> POPÜLERLER
            </div>
            <div style={{ padding: '12px 15px', color: '#888', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#888'}>
              <i className="fa-solid fa-clock"></i> SON EKLENENLER
            </div>
          </div>

          {/* PREMIUM FEATURED SECTION: 1 Buyuk Sol + 2x2 Grid Sag */}
          {posts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '15px', marginBottom: '30px', height: '500px' }}>
              
              {/* SOL: Buyuk Hero Kart */}
              {posts[0] && (
                <Link
                  href={posts[0].url}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#000',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    transition: 'transform 0.3s ease',
                    height: '100%'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {posts[0].thumbnail && (
                    <img src={posts[0].thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  )}
                  {/* Overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }}>
                    <div style={{ background: '#e60000', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '2px', display: 'inline-block', marginBottom: '12px', textTransform: 'uppercase' }}>
                      {posts[0].categories[0] || 'GÜNCEL'}
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {posts[0].title}
                    </h2>
                    <div style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '15px' }}>
                      {posts[0].summary}
                    </div>
                    <div style={{ color: '#eee', fontSize: '11px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span><i className="fa-solid fa-user" style={{ color: '#e60000', marginRight: '6px' }}></i>{posts[0].author}</span>
                      <span><i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i>{fmtDate(posts[0].published)}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* SAG: 2x2 Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px' }}>
                {posts.slice(1, 5).map((p, idx) => (
                  <Link
                    key={p.id}
                    href={p.url}
                    style={{
                      position: 'relative',
                      background: '#000',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      height: '100%'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {p.thumbnail && (
                      <img src={p.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                    )}
                    {/* Overlay */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <div style={{ 
                        background: idx % 2 === 0 ? '#2ea44f' : '#f68b1e', 
                        color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 6px', borderRadius: '2px', textTransform: 'uppercase' 
                      }}>
                        {p.categories[0] || 'KATEGORİ'}
                      </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                      <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.title}
                      </div>
                      <div style={{ color: '#bbb', fontSize: '10px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{fmtDate(p.published)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}


          {/* TRENDLER BASLIGI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 0 8px', marginBottom: '10px', borderBottom: '2px solid #e60000' }}>
            <i className="fa-solid fa-fire" style={{ color: '#e60000', fontSize: '15px' }}></i>
            <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#fff' }}>NBK BARIŞ Trendler</span>
          </div>

          {/* YAZI LISTESI */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : (
            <>
              <div className="posts-grid">
                {listPosts.map(post => <PostCard key={post.id} post={post} />)}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
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
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <Sidebar />
      </div>
    </>
  );
}
