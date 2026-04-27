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
      {/* ═══════════════════════════════════════
          SON YAZILAR - üst yatay thumbnail şerit
          (orijinalde navbar altında 5 kart yan yana)
      ═══════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════
          SON YAZILAR TICKER (tek satır cycling)
      ═══════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════
          ANA İÇERİK + SIDEBAR
      ═══════════════════════════════════════ */}
      <div className="main-layout">
        <div>

          {/* SLIDER: Büyük sol + 2 tall kart sağ */}
          {posts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', height: '430px', marginBottom: '15px', overflow: 'hidden', background: '#000', gap: '2px' }}>

              {/* SOL: Büyük slider */}
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundImage: slider?.thumbnail ? `url(${slider.thumbnail})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#111',
                  transition: 'background-image 0.3s',
                }}
                onClick={() => slider && (window.location.href = slider.url)}
              >
                {/* Karanlık overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)', zIndex: 1 }}></div>

                {/* Dots (üstte ortalanmış) */}
                <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 3 }}>
                  {posts.slice(0, 8).map((_, i) => (
                    <div
                      key={i}
                      onClick={e => { e.stopPropagation(); setSliderIdx(i); }}
                      style={{
                        width: i === sliderIdx ? '20px' : '8px',
                        height: '8px',
                        background: i === sliderIdx ? '#e60000' : 'rgba(255,255,255,0.5)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>

                {/* Prev / Next butonlar */}
                <div onClick={e => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '14px 11px', cursor: 'pointer', zIndex: 4, transition: 'background 0.2s' }}>
                  <i className="fa-solid fa-angle-left"></i>
                </div>
                <div onClick={e => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '14px 11px', cursor: 'pointer', zIndex: 4, transition: 'background 0.2s' }}>
                  <i className="fa-solid fa-angle-right"></i>
                </div>

                {/* İçerik */}
                {slider && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 16px', zIndex: 2 }}>
                    <span style={{ background: '#e60000', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: '6px' }}>
                      {slider.categories[0]?.replace(/-/g, ' ') || 'GENEL'}
                    </span>
                    <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, lineHeight: 1.3, margin: '0 0 8px', textShadow: '1px 1px 3px #000', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {slider.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#ccc' }}>
                      <span><i className="fa-solid fa-user" style={{ marginRight: '4px', color: '#e60000' }}></i>{slider.author}</span>
                      <span><i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>{fmtDate(slider.published)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SAĞ: 4 küçük kart (2x2 grid) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px' }}>
                {posts.slice(1, 5).map((p, idx) => {
                  const colors = ['#7289da', '#f57c00', '#00a8cc', '#ffca28', '#2ea44f'];
                  const catColor = colors[idx % colors.length];
                  
                  return (
                    <Link
                      key={p.id}
                      href={p.url}
                      style={{
                        display: 'block',
                        position: 'relative',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        backgroundImage: p.thumbnail ? `url(${p.thumbnail})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#111',
                      }}
                      onMouseEnter={(e) => {
                        const img = e.currentTarget;
                        img.style.transform = 'scale(1.02)';
                        img.style.transition = 'transform 0.3s ease';
                        img.style.zIndex = '10';
                      }}
                      onMouseLeave={(e) => {
                        const img = e.currentTarget;
                        img.style.transform = 'scale(1)';
                        img.style.zIndex = '1';
                      }}
                    >
                      {/* Kategori label sol üst (kutu şeklinde) */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: catColor, padding: '4px 8px', zIndex: 2, borderRadius: '2px' }}>
                        <span style={{ color: '#fff', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {p.categories[0]?.replace(/-/g, ' ') || 'GENEL'}
                        </span>
                      </div>
                      
                      {/* Overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', zIndex: 1 }}></div>
                      
                      {/* Content altta */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', zIndex: 2 }}>
                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '1px 1px 3px #000', marginBottom: '6px' }}>
                          {p.title}
                        </div>
                        <div style={{ color: '#bbb', fontSize: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span><i className="fa-regular fa-clock" style={{ marginRight: '4px', fontSize: '9px' }}></i>{fmtDate(p.published)}</span>
                          <span><i className="fa-solid fa-user" style={{ marginRight: '4px', fontSize: '9px', color: '#fff' }}></i>{p.author}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          )}

          {/* ── TRENDLER BAŞLIĞI ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 0 8px', marginBottom: '10px', borderBottom: '2px solid #e60000' }}>
            <i className="fa-solid fa-fire" style={{ color: '#e60000', fontSize: '15px' }}></i>
            <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#fff' }}>NBK BARIŞ Trendler</span>
          </div>

          {/* ── YAZI LİSTESİ ── */}
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
