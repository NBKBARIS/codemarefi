'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BlogPost, searchPosts } from '../lib/blogger';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get query from searchParams OR window.location.search as fallback
    const q = searchParams.get('q') || 
              (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') : '') || '';
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchPosts(query).then(results => {
      setPosts(results);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [query]);

  return (
    <>
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '2rem',
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Arama Sonuçları</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
          &quot;{query}&quot; için sonuçlar
        </h1>
      </div>

      <div className="main-layout">
        <div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : (
            <>
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p>&quot;{query}&quot; için sonuç bulunamadı.</p>
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {posts.length} sonuç bulundu
                  </p>
                  <div className="posts-grid">
                    {posts.map(post => <PostCard key={post.id} post={post} />)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <Sidebar />
      </div>
    </>
  );
}

export default function AramaPage() {
  return (
    <Suspense fallback={<div className="loading-spinner"><div className="spinner" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
