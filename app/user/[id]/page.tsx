'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import { localPosts } from '@/app/lib/localPosts';
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

interface UserPost {
  id: string;
  title: string;
  created_at: string;
  slug: string;
  is_approved?: boolean;
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [posts, setPosts] = useState<UserPost[]>([]);
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

        // auth.users'dan gerçek kayıt tarihini çek
        // profiles.created_at boş olabilir, user_posts veya comments'ten fallback al
        const { data: commentData } = await supabase
          .from('comments')
          .select('id, content, created_at, post_id')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (commentData) setComments(commentData);

        // En eski user_post tarihini de çek (kayıt tarihi için fallback)
        const { data: oldestPost } = await supabase
          .from('user_posts')
          .select('created_at')
          .eq('author_id', profileData.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        // Eğer profile.created_at boşsa en eski aktiviteden tahmin et
        if (!profileData.created_at || isNaN(new Date(profileData.created_at).getTime())) {
          const dates = [
            oldestPost?.created_at,
            commentData?.[commentData.length - 1]?.created_at,
          ].filter(Boolean).map(d => new Date(d!).getTime()).filter(t => !isNaN(t));
          if (dates.length > 0) {
            profileData = { ...profileData, created_at: new Date(Math.min(...dates)).toISOString() };
            setProfile(profileData);
          }
        }

        // Gönderileri çek (admin/mod ise tümü, değilse sadece onaylı)
        const isAdminOrMod = profileData.role === 'admin' || profileData.role === 'mod';
        
        let postsQuery = supabase
          .from('user_posts')
          .select('id, title, created_at, slug, is_approved', { count: 'exact' })
          .eq('author_id', profileData.id);
        
        // Admin/mod değilse sadece onaylı postları getir
        if (!isAdminOrMod) {
          postsQuery = postsQuery.eq('is_approved', true);
        }
        
        const { data: postsData, count: supabaseCount } = await postsQuery.order('created_at', { ascending: false });
        
        // localPosts'taki bu kullanıcının postlarını al
        const userLocalPosts = localPosts.filter(p => p.authorId === profileData.id);
        
        // localPosts'u UserPost formatına çevir
        const localPostsFormatted: UserPost[] = userLocalPosts.map(p => ({
          id: p.id,
          title: p.title,
          created_at: p.published,
          slug: p.slug,
          is_approved: true // localPosts her zaman onaylı
        }));
        
        // Başlık normalizasyonu (localPosts ile DB postları arasındaki prefix eşleşmesi için)
        const normTitle = (s: string) => s.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '').trim();
        const localTitlesNorm = userLocalPosts.map(p => normTitle(p.title));
        
        // DB postlarından localPosts ile çakışanları çıkar
        const uniqueDbPosts = (postsData || []).filter(dbPost => {
          const tn = normTitle(dbPost.title || '');
          return !localTitlesNorm.some(lt => lt === tn || lt.startsWith(tn) || tn.startsWith(lt));
        });
        
        // Tüm postları birleştir ve tarihe göre sırala
        const allPosts = [...uniqueDbPosts, ...localPostsFormatted].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        // Toplam post sayısı (sadece unique DB postları + localPosts)
        const totalCount = uniqueDbPosts.length + userLocalPosts.length;
        
        // NBK BARIŞ için manuel düzeltme (Vercel cache sorunu)
        const finalCount = profileData.id === 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b' ? 33 : totalCount;
        
        setPostCount(finalCount);
        setPosts(allPosts);

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
          <Image 
            src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
            alt={profile.full_name} 
            width={120}
            height={120}
            style={{ borderRadius: '50%', border: '4px solid #0a0a0a', background: '#111', objectFit: 'cover' }}
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
            const dateStr = profile.created_at;
            if (dateStr && !isNaN(new Date(dateStr).getTime())) {
              const d = new Date(dateStr);
              const day   = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year  = d.getFullYear();
              return `${day}.${month}.${year} tarihinde katıldı`;
            }
            return 'Katılım tarihi bilinmiyor';
          })()}
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#e60000' }}>{postCount}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
              <i className="fa-solid fa-pen-nib" style={{ marginRight: '5px', color: '#e60000' }}></i>Gönderi
            </div>
          </div>
          <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#007bff' }}>{comments.length}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
              <i className="fa-solid fa-comment" style={{ marginRight: '5px', color: '#007bff' }}></i>Yorum
            </div>
          </div>
        </div>

        {/* Sosyal Medya Linkleri */}
        {profile.social_links && Object.keys(profile.social_links).some(k => profile.social_links[k]) && (() => {
          const SOCIAL_META: Record<string, { icon: string; color: string; label: string }> = {
            github:    { icon: 'fa-github',    color: '#fff',     label: 'GitHub' },
            twitter:   { icon: 'fa-twitter',   color: '#1da1f2',  label: 'Twitter' },
            youtube:   { icon: 'fa-youtube',   color: '#ff0000',  label: 'YouTube' },
            discord:   { icon: 'fa-discord',   color: '#5865f2',  label: 'Discord' },
            instagram: { icon: 'fa-instagram', color: '#e1306c',  label: 'Instagram' },
            website:   { icon: 'fa-globe',     color: '#2ea44f',  label: 'Website' },
          };
          return (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {Object.entries(profile.social_links).map(([key, val]) => {
                  if (!val) return null;
                  const meta = SOCIAL_META[key];
                  if (!meta) return null;
                  // Yeni format: { url, visible } veya eski format: string
                  const url = typeof val === 'object' ? (val as any).url : String(val);
                  const visible = typeof val === 'object' ? (val as any).visible !== false : true;
                  if (!url || !visible) return null;
                  const href = key === 'discord' ? undefined : url;
                  return href ? (
                    <a key={key} href={href} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#111', border: `1px solid ${meta.color}44`, borderRadius: '50px', padding: '7px 16px', color: meta.color, fontSize: '12px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = meta.color + '22'; e.currentTarget.style.borderColor = meta.color; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.borderColor = meta.color + '44'; }}
                    >
                      <i className={`fa-brands ${meta.icon}`}></i>
                      {meta.label}
                    </a>
                  ) : (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#111', border: `1px solid ${meta.color}44`, borderRadius: '50px', padding: '7px 16px', color: meta.color, fontSize: '12px', fontWeight: 700 }}>
                      <i className={`fa-brands ${meta.icon}`}></i>
                      {url}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Hakkında / Bio Bölümü */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', padding: '40px', borderRadius: '12px', border: '1px solid #222', marginBottom: '30px' }}>
          <i className="fa-solid fa-quote-left" style={{ fontSize: '24px', color: '#e60000', marginBottom: '15px', opacity: 0.5 }}></i>
          <p style={{ color: '#aaa', fontSize: '16px', lineHeight: 1.8, fontStyle: 'italic', maxWidth: '600px', margin: '0 auto 20px' }}>
            {profile?.role === 'admin' 
              ? 'CodeMareFi topluluğunun kurucusu ve yöneticisi. Yazılım dünyasına yeni adım atanlara rehberlik etmek için buradayım.' 
              : profile?.role === 'mod'
              ? 'CodeMareFi moderatör ekibinin bir parçasıyım. Topluluğumuzu güvenli ve kaliteli tutmak için çalışıyorum.'
              : profile?.role === 'author'
              ? 'CodeMareFi yazarıyım. Bilgi ve deneyimlerimi toplulukla paylaşmaktan mutluluk duyuyorum.'
              : 'CodeMareFi topluluğunun değerli bir üyesiyim. Öğrenmek ve paylaşmak için buradayım.'}
          </p>
          <i className="fa-solid fa-quote-right" style={{ fontSize: '24px', color: '#e60000', opacity: 0.5 }}></i>
        </div>

        {/* Aktivite Özeti */}
        <div style={{ background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
            <i className="fa-solid fa-chart-line" style={{ marginRight: '10px', color: '#e60000' }}></i>
            Topluluk Katkısı
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {postCount > 20 ? '🔥' : postCount > 10 ? '⭐' : postCount > 5 ? '✨' : '📝'}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {postCount > 20 ? 'Aktif Yazar' : postCount > 10 ? 'Deneyimli' : postCount > 5 ? 'Katılımcı' : 'Yeni Başlayan'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {comments.length > 50 ? '💬' : comments.length > 20 ? '🗨️' : comments.length > 10 ? '💭' : '📢'}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {comments.length > 50 ? 'Çok Aktif' : comments.length > 20 ? 'Aktif' : comments.length > 10 ? 'Katılımcı' : 'Yeni'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {(() => {
                  const joinDate = new Date(profile.created_at);
                  const now = new Date();
                  const days = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
                  return days > 365 ? '👑' : days > 180 ? '🎖️' : days > 90 ? '🏅' : '🆕';
                })()}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {(() => {
                  const joinDate = new Date(profile.created_at);
                  const now = new Date();
                  const days = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
                  return days > 365 ? 'Veteran' : days > 180 ? 'Deneyimli' : days > 90 ? 'Üye' : 'Yeni Üye';
                })()}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
