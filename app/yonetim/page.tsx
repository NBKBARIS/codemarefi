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

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!prof || (prof.role !== 'admin' && prof.role !== 'mod')) {
        alert('Bu sayfaya erişim yetkiniz yok!');
        router.push('/');
        return;
      }

      setUser(session.user);
      setProfile(prof);
      fetchPosts();
    }
    checkAuth();
  }, [router]);

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

  if (loading) return <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Yükleniyor...</div>;

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
