'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogPost, fetchPosts } from '../../lib/blogger';
import PostCard from '../../components/PostCard';
import Sidebar from '../../components/Sidebar';

const POSTS_PER_PAGE = 10;

export default function KategoriPage() {
  const params = useParams();
  const rawCat = params.slug as string;
  const category = decodeURIComponent(rawCat);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const startIndex = (page - 1) * POSTS_PER_PAGE + 1;
    fetchPosts(POSTS_PER_PAGE, startIndex, category).then(({ posts, total }) => {
      setPosts(posts);
      setTotal(total);
      setLoading(false);
    });
  }, [category, page]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  function getCatIcon(cat: string) {
    const icons: { [key: string]: { icon: string; color: string; anim: string } } = {
      'Discord-bot-kodları': { icon: 'fa-solid fa-robot', color: '#5865F2', anim: 'float 3s ease-in-out infinite' },
      'Discord-bot-konuları': { icon: 'fa-solid fa-comments', color: '#5865F2', anim: 'pulse 2s infinite' },
      'Discord-Konuları': { icon: 'fa-solid fa-gamepad', color: '#7289da', anim: 'bounce 2s infinite' },
      'Hazır': { icon: 'fa-solid fa-bolt', color: '#f1c40f', anim: 'flash 1.5s infinite' },
      'Genel': { icon: 'fa-solid fa-book', color: '#3498db', anim: 'float 3s ease-in-out infinite' },
      'JavaScript': { icon: 'fa-brands fa-js', color: '#f7df1e', anim: 'pulse 2s infinite' },
      'Blogger': { icon: 'fa-solid fa-pen-nib', color: '#e67e22', anim: 'float 3s ease-in-out infinite' },
      'CSS': { icon: 'fa-brands fa-css3-alt', color: '#2980b9', anim: 'pulse 2s infinite' },
      'Html': { icon: 'fa-brands fa-html5', color: '#e67e22', anim: 'pulse 2s infinite' },
      'Python': { icon: 'fa-brands fa-python', color: '#3498db', anim: 'float 3s ease-in-out infinite' },
      'Tavsiye': { icon: 'fa-solid fa-thumbs-up', color: '#2ecc71', anim: 'bounce 2s infinite' },
      'Popüler': { icon: 'fa-solid fa-fire', color: '#e60000', anim: 'pulse 1.5s infinite' },
    };

    const match = Object.keys(icons).find(k => cat.includes(k));
    return match ? icons[match] : { icon: 'fa-solid fa-folder', color: '#999', anim: 'none' };
  }
  const catData = getCatIcon(category);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}} />

      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '2.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '3rem',
          color: catData.color,
          animation: catData.anim
        }}>
          <i className={catData.icon}></i>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Kategori</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{category.replace(/-/g, ' ')}</h1>
          {total > 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{total} yazı bulundu</div>}
        </div>
      </div>

      <div className="main-layout">
        <div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : (
            <>
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p>Bu kategoride henüz yazı yok.</p>
                </div>
              ) : (
                <div className="posts-grid">
                  {posts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Önceki</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return (
                      <button key={pageNum} className={`page-btn ${page === pageNum ? 'active' : ''}`} onClick={() => setPage(pageNum)}>
                        {pageNum}
                      </button>
                    );
                  })}
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Sonraki →</button>
                </div>
              )}
            </>
          )}
        </div>
        <Sidebar />
      </div>
    </>
  );
}
