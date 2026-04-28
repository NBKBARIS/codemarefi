'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  role?: string;
}

interface UserComment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!id) return;

      const param = decodeURIComponent(Array.isArray(id) ? id[0] : id);

      // Önce UUID olarak dene, sonra full_name olarak
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

      let profileData: any = null;

      if (isUUID) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', param)
          .single();
        if (!error) profileData = data;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('full_name', param)
          .single();
        if (!error) profileData = data;
      }

      if (profileData) {
        setProfile(profileData);

        // Yorumlar
        const { data: commentData } = await supabase
          .from('comments')
          .select('id, content, created_at, post_id')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (commentData) setComments(commentData);

        // Onaylı gönderi sayısı
        const { count } = await supabase
          .from('user_posts')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', profileData.id)
          .eq('is_approved', true);
        setPostCount(count ?? 0);
      } else {
        setError(true);
      }

      setLoading(false);
    }

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e60000' }}>
        <i className="fa-solid fa-spinner fa-spin fa-3x"></i>
      </div>
    );
  }

  if (!profile || error) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '20px' }}>
        <i className="fa-solid fa-user-slash fa-4x" style={{ color: '#e60000' }}></i>
        <h2>Kullanıcı Bulunamadı</h2>
        <Link href="/" style={{ color: '#e60000', textDecoration: 'underline' }}>Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingBottom: '50px' }}>
      
      {/* Banner Area */}
      <div style={{ height: '200px', background: 'linear-gradient(45deg, #e60000 0%, #000 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: '-60px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <img 
            src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
            alt={profile.full_name} 
            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0a0a0a', background: '#111', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '80px auto 0', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#fff', fontWeight: '800' }}>{profile.full_name}</h1>
        
        {/* Rütbe Rozeti */}
        <div style={{ 
          display: 'inline-block',
          padding: '6px 20px',
          borderRadius: '50px',
          background: profile?.role === 'admin' ? 'rgba(230,0,0,0.15)' : (profile?.role === 'mod' ? 'rgba(46,164,79,0.15)' : (profile?.role === 'author' ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.05)')),
          color: profile?.role === 'admin' ? '#e60000' : (profile?.role === 'mod' ? '#2ea44f' : (profile?.role === 'author' ? '#ff8c00' : '#888')),
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          border: `1px solid ${profile?.role === 'admin' ? '#e60000' : (profile?.role === 'mod' ? '#2ea44f' : (profile?.role === 'author' ? '#ff8c00' : '#333'))}`,
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <i className={`fa-solid ${profile?.role === 'admin' ? 'fa-user-shield' : (profile?.role === 'mod' ? 'fa-shield-halved' : (profile?.role === 'author' ? 'fa-pen-nib' : 'fa-user'))}`} style={{ marginRight: '8px' }}></i>
          {profile?.role === 'admin' ? 'Yönetici' : (profile?.role === 'mod' ? 'Moderatör' : (profile?.role === 'author' ? 'Yazar' : 'Üye'))}
        </div>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>
          <i className="fa-solid fa-calendar-days" style={{ marginRight: '8px' }}></i>
          {(() => {
            let dateStr = profile.created_at;
            if (!dateStr || isNaN(new Date(dateStr).getTime())) {
              if (comments.length > 0) {
                // Yorumlar en yeniden eskiye sıralı, en sonuncu en eskidir
                dateStr = comments[comments.length - 1].created_at;
              }
            }
            
            if (dateStr && !isNaN(new Date(dateStr).getTime())) {
              return `${new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinde katıldı`;
            }
            return 'Yeni katıldı';
          })()}
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#e60000' }}>{postCount}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
              <i className="fa-solid fa-pen-nib" style={{ marginRight: '5px', color: '#e60000' }}></i>
              Gönderi
            </div>
          </div>
          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#007bff' }}>{comments.length}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
              <i className="fa-solid fa-comment" style={{ marginRight: '5px', color: '#007bff' }}></i>
              Yorum
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ borderBottom: '2px solid #e60000', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>
            <i className="fa-solid fa-bolt" style={{ marginRight: '10px', color: '#e60000' }}></i>
            Son Aktiviteler
          </h3>

          {comments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: '#111', borderRadius: '12px', color: '#555' }}>
              Henüz bir aktivite bulunmuyor.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ background: '#111', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #e60000' }}>
                  <div style={{ fontSize: '11px', color: '#e60000', marginBottom: '5px' }}>
                    <i className="fa-solid fa-comment" style={{ marginRight: '5px' }}></i>
                    Yorum Yaptı • {comment.created_at && !isNaN(new Date(comment.created_at).getTime()) ? new Date(comment.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#ddd', fontStyle: 'italic', marginBottom: '10px' }}>
                    "{comment.content}"
                  </div>
                  <Link 
                    href={`/post/${comment.post_id}`} 
                    style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e60000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                  >
                    Konuyu Gör <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
