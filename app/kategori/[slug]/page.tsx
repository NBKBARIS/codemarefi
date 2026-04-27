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
    const icons: { [key: string]: string } = {
      'Discord-bot-kodları': 'https://emoji.gg/assets/emoji/8468-discord-robot.gif',
      'Discord-bot-konuları': 'https://emoji.gg/assets/emoji/9129-blurple-chat.gif',
      'Discord-Konuları': 'https://emoji.gg/assets/emoji/3894-gamepad.gif',
      'Hazır': 'https://emoji.gg/assets/emoji/8743-neon-lightning.gif',
      'Genel': 'https://emoji.gg/assets/emoji/3547-book.gif',
      'JavaScript': 'https://emoji.gg/assets/emoji/9454-javascript.png',
      'Blogger': 'https://emoji.gg/assets/emoji/7808-edit.gif',
      'CSS': 'https://emoji.gg/assets/emoji/8316-css3.png',
      'Html': 'https://emoji.gg/assets/emoji/9519-html5.png',
      'Python': 'https://emoji.gg/assets/emoji/7888-python.png',
      'Tavsiye': 'https://emoji.gg/assets/emoji/2208-verify-red.gif',
      'Popüler': 'https://emoji.gg/assets/emoji/4473-fire.gif',
    };

    const match = Object.keys(icons).find(k => cat.includes(k));
    return match ? icons[match] : 'https://emoji.gg/assets/emoji/1234-folder.gif';
  }

  return (
    <>
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '2.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <img src={getCatIcon(category)} alt="" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
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
