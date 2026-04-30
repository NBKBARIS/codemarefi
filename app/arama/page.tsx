'use client';
import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BlogPost, searchPosts } from '../lib/blogger';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

// ── İstemci tarafı arama cache'i (5 dakika) ──────────────────
const searchCache = new Map<string, { results: BlogPost[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

function getCached(q: string): BlogPost[] | null {
  const entry = searchCache.get(q);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { searchCache.delete(q); return null; }
  return entry.results;
}

function setCache(q: string, results: BlogPost[]) {
  searchCache.set(q, { results, ts: Date.now() });
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // URL'den query al
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setInputVal(q);
    setQuery(q);
  }, [searchParams]);

  // Debounce: kullanıcı yazmayı bırakınca 500ms sonra ara
  function handleInputChange(val: string) {
    setInputVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val.trim().length >= 2) {
        router.push(`/arama?q=${encodeURIComponent(val.trim())}`);
      }
    }, 500);
  }

  // Arama yap
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setPosts([]);
      setSearched(false);
      return;
    }

    const q = query.trim().toLowerCase();

    // Cache'de var mı?
    const cached = getCached(q);
    if (cached) {
      setPosts(cached);
      setSearched(true);
      return;
    }

    setLoading(true);
    setSearched(false);
    searchPosts(q).then(results => {
      setCache(q, results);
      setPosts(results);
      setSearched(true);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setSearched(true);
    });
  }, [query]);

  return (
    <>
      {/* Arama başlığı + input */}
      <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '30px 20px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ color: '#666', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#e60000', marginRight: '6px' }}></i>
            Site İçi Arama
          </div>
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <input
              type="text"
              value={inputVal}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="Gönderi, kategori veya konu ara..."
              autoFocus
              style={{
                width: '100%',
                background: '#0a0a0a',
                border: '2px solid #e60000',
                borderRadius: '4px',
                padding: '14px 50px 14px 18px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
              }}
            />
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#e60000' }}></i>
            ) : (
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}></i>
            )}
          </div>
          {query && searched && (
            <p style={{ color: '#555', fontSize: '13px', marginTop: '10px' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>&quot;{query}&quot;</span> için{' '}
              <span style={{ color: '#e60000', fontWeight: 700 }}>{posts.length}</span> sonuç bulundu
              {posts.length > 0 && <span style={{ color: '#444' }}> · önbellekten sunulabilir</span>}
            </p>
          )}
        </div>
      </div>

      <div className="main-layout">
        <div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : !query || query.trim().length < 2 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
              <i className="fa-solid fa-keyboard" style={{ fontSize: '40px', marginBottom: '15px', display: 'block', color: '#333' }}></i>
              <p style={{ fontSize: '15px', color: '#666' }}>Aramak istediğiniz kelimeyi yazın</p>
              <p style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>En az 2 karakter girin</p>
            </div>
          ) : searched && posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '40px', marginBottom: '15px', display: 'block', color: '#333' }}></i>
              <p style={{ fontSize: '16px', marginBottom: '8px', color: '#666' }}>&quot;{query}&quot; için sonuç bulunamadı.</p>
              <p style={{ fontSize: '13px', color: '#444' }}>Farklı anahtar kelimeler deneyin.</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
        <Sidebar hideSearch={true} />
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
