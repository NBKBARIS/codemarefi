'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getPendingPosts, approvePost, deletePost, UserPost } from '../lib/userPosts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

export default function YonetimPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<'no-session' | 'no-permission' | null>(null);


  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAccessDenied('no-session');
        setLoading(false);
        return;
      }
      
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!prof || (prof.role !== 'admin' && prof.role !== 'mod')) {
        setAccessDenied('no-permission');
        setLoading(false);
        return;
      }

      setUser(session.user);
      setProfile(prof);
      fetchPosts();
    }
    checkAuth();
  }, []);

  async function fetchPosts() {
    try {
      const pending = await getPendingPosts();
      setPosts(pending);
    } catch (error) {
      console.error('Yazılar çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    if (!confirm('Bu yazıyı onaylamak istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      await approvePost(id);
      setPosts(posts.filter(p => p.id !== id));
      alert('Yazı onaylandı ve yayına alındı!');
    } catch (error) {
      alert('Onaylama hatası!');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu yazıyı SİLMEK istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      alert('Yazı silindi.');
    } catch (error) {
      alert('Silme hatası!');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ color: '#e60000', fontSize: '36px' }}></i>
    </div>
  );

  if (accessDenied) {
    return (
      <main style={{ background: '#050505', minHeight: '100vh', color: '#fff' }}>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            {/* Kırmızı uyarı ikonu */}
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'rgba(230,0,0,0.1)', border: '3px solid #e60000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 30px', fontSize: '40px', color: '#e60000',
              boxShadow: '0 0 40px rgba(230,0,0,0.2)'
            }}>
              <i className={accessDenied === 'no-session' ? 'fa-solid fa-lock' : 'fa-solid fa-shield-halved'}></i>
            </div>

            {/* Başlık */}
            <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px', color: '#e60000', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {accessDenied === 'no-session' ? 'Giriş Gerekli' : 'Yetkisiz Erişim'}
            </h1>

            {/* Kırmızı çizgi */}
            <div style={{ width: '60px', height: '3px', background: '#e60000', margin: '0 auto 20px' }}></div>

            {/* Mesaj */}
            <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.7, marginBottom: '30px' }}>
              {accessDenied === 'no-session'
                ? 'Bu sayfaya erişmek için Discord hesabınızla giriş yapmanız gerekmektedir.'
                : 'Bu sayfaya erişim için yönetici veya moderatör yetkisine sahip olmanız gerekmektedir. Hesabınızın yetki seviyesi bu sayfaya erişim için yeterli değil.'}
            </p>

            {/* Kod bloğu stili uyarı */}
            <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderLeft: '4px solid #e60000', borderRadius: '4px', padding: '15px', marginBottom: '30px', textAlign: 'left', fontFamily: 'monospace', fontSize: '13px', color: '#666' }}>
              <span style={{ color: '#e60000' }}>ERROR</span> {accessDenied === 'no-session' ? '401' : '403'}: Access Denied<br/>
              <span style={{ color: '#555' }}>// {accessDenied === 'no-session' ? 'Authentication required' : 'Insufficient permissions'}</span>
            </div>

            {/* Buton */}
            <button
              onClick={() => router.push('/')}
              style={{ background: '#e60000', color: '#fff', border: 'none', padding: '14px 35px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#b00000'}
              onMouseLeave={e => e.currentTarget.style.background = '#e60000'}
            >
              <i className="fa-solid fa-house" style={{ marginRight: '8px' }}></i>
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ background: '#050505', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <i className="fa-solid fa-user-shield" style={{ color: '#e60000' }}></i>
            Yönetim Paneli
          </h1>
          <div style={{ background: '#111', padding: '10px 20px', borderRadius: '50px', border: '1px solid #1e1e1e', fontSize: '14px' }}>
            Yetki: <span style={{ color: '#e60000', fontWeight: 700 }}>{profile?.role?.toUpperCase()}</span>
          </div>
        </div>

        <h2 style={{ fontSize: '18px', color: '#888', marginBottom: '20px' }}>Onay Bekleyen Yazılar ({posts.length})</h2>

        {posts.length === 0 ? (
          <div style={{ background: '#111', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #1e1e1e', color: '#555' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
            <p>Şu an onay bekleyen herhangi bir yazı bulunmuyor.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {posts.map(post => (
              <div key={post.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                <img src={post.thumbnail_url} alt="Thumbnail" style={{ width: '200px', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 5px 0' }}>{post.title}</h3>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                      Gönderen: <span style={{ color: '#fff' }}>{post.profiles?.full_name}</span> | 
                      Kategori: <span style={{ color: '#e60000' }}>{post.categories?.[0]}</span>
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                      onClick={() => handleApprove(post.id)}
                      disabled={actionLoading === post.id}
                      style={{ background: '#2ea44f', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                    >
                      {actionLoading === post.id ? '...' : 'Onayla'}
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      disabled={actionLoading === post.id}
                      style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                    >
                      {actionLoading === post.id ? '...' : 'Sil'}
                    </button>
                    <a 
                      href={`/preview/${post.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: '#888', fontSize: '12px', display: 'flex', alignItems: 'center', marginLeft: 'auto', textDecoration: 'none' }}
                    >
                      Yazıyı Oku <i className="fa-solid fa-up-right-from-square" style={{ marginLeft: '5px' }}></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
