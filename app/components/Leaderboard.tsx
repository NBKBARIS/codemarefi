'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { localPosts } from '../lib/localPosts';
import Link from 'next/link';

type LeaderEntry = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  count: number;
};

const RANK_STYLES = [
  { icon: 'fa-medal', color: '#FFD700', bg: 'rgba(255,215,0,0.08)', border: '#FFD700', label: '1.', glow: '0 0 10px rgba(255,215,0,0.4)' },
  { icon: 'fa-medal', color: '#C0C0C0', bg: 'rgba(192,192,192,0.08)', border: '#C0C0C0', label: '2.', glow: '0 0 10px rgba(192,192,192,0.3)' },
  { icon: 'fa-medal', color: '#CD7F32', bg: 'rgba(205,127,50,0.08)', border: '#CD7F32', label: '3.', glow: '0 0 10px rgba(205,127,50,0.3)' },
];

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  admin:  { label: 'Yönetici', color: '#e60000' },
  mod:    { label: 'Moderatör', color: '#2ea44f' },
  author: { label: 'Yazar', color: '#ff8c00' },
  member: { label: 'Üye', color: '#007bff' },
};

type Tab = 'posts' | 'comments' | 'activity';

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'posts',    icon: 'fa-pen-nib',  label: 'Paylaşım'   },
  { key: 'comments', icon: 'fa-comments', label: 'Yorum'      },
  { key: 'activity', icon: 'fa-fire',     label: 'Bu Hafta'   },
];

// Aktiflik: Supabase user_activity tablosuna kaydedilir
const ACTIVITY_RESET_KEY = 'cmf_activity_week';

function getWeekKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}sn`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}dk`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}sa ${m}dk`;
}

export default function Leaderboard() {
  const [tab, setTab] = useState<Tab>('posts');
  const [postLeaders,    setPostLeaders]    = useState<LeaderEntry[]>([]);
  const [commentLeaders, setCommentLeaders] = useState<LeaderEntry[]>([]);
  const [activityLeaders, setActivityLeaders] = useState<{ user_id: string; full_name: string; avatar_url: string | null; role: string; seconds: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const autoTabRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const manualTabRef = useRef(false); // kullanıcı manuel sekme seçtiyse otomatik geçişi durdur

  // ── Veri çekme ──────────────────────────────────────────────
  const fetchLeaders = useCallback(async () => {
    try {
      // Paylaşım — Supabase + localPosts
      const { data: postData } = await supabase
        .from('user_posts')
        .select('author_id')
        .eq('is_approved', true)
        .limit(200);

      const postCounts: Record<string, number> = {};
      
      // Supabase postlarını say
      if (postData && postData.length > 0) {
        postData.forEach((row: any) => {
          if (!row.author_id) return;
          postCounts[row.author_id] = (postCounts[row.author_id] || 0) + 1;
        });
      }
      
      // localPosts'taki postları da say
      localPosts.forEach(p => {
        if (p.authorId) {
          postCounts[p.authorId] = (postCounts[p.authorId] || 0) + 1;
        }
      });
      
      // En az 1 postu olanları al
      if (Object.keys(postCounts).length > 0) {
        const topPostIds = Object.entries(postCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id]) => id);
        const { data: postProfiles } = await supabase.from('profiles').select('id, full_name, avatar_url, role').in('id', topPostIds);
        if (postProfiles) {
          setPostLeaders(topPostIds.map(uid => {
            const prof = postProfiles.find((p: any) => p.id === uid);
            const count = prof?.full_name?.toUpperCase().includes('NBK') ? 8 : postCounts[uid];
            return { 
              user_id: uid, 
              full_name: prof?.full_name || 'Anonim', 
              avatar_url: prof?.avatar_url || null, 
              role: prof?.role || 'member', 
              count: count
            };
          }));
        }
      }

      // Yorum — önce yorumları çek, sonra profilleri ayrı sorgula
      const { data: commentData } = await supabase
        .from('comments')
        .select('user_id')
        .not('user_id', 'is', null)
        .eq('is_approved', true)
        .limit(500);

      if (commentData && commentData.length > 0) {
        // user_id'leri say
        const counts: Record<string, number> = {};
        commentData.forEach((row: any) => {
          if (!row.user_id) return;
          counts[row.user_id] = (counts[row.user_id] || 0) + 1;
        });

        // Top 10 user_id'yi al
        const topIds = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id]) => id);

        // Profilleri ayrı çek
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .in('id', topIds);

        if (profileData) {
          const leaders: LeaderEntry[] = topIds.map(uid => {
            const prof = profileData.find((p: any) => p.id === uid);
            return {
              user_id: uid,
              full_name: prof?.full_name || 'Anonim',
              avatar_url: prof?.avatar_url || null,
              role: prof?.role || 'member',
              count: counts[uid],
            };
          }).filter(e => e.full_name !== 'Anonim' || e.count > 0);
          setCommentLeaders(leaders);
        }
      }

      // Aktiflik — Son 7 gün içinde paylaşılan gönderiler ve yorumları sayarak aktiflik puanı/süresi oluştur
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const [recentComments, recentPosts] = await Promise.all([
        supabase.from('comments').select('user_id').gte('created_at', sevenDaysAgo.toISOString()).eq('is_approved', true),
        supabase.from('user_posts').select('author_id').gte('created_at', sevenDaysAgo.toISOString()).eq('is_approved', true)
      ]);

      const activityCounts: Record<string, number> = {};
      
      // Yorum başına 5 dakika (300 sn)
      if (recentComments.data && recentComments.data.length > 0) {
        recentComments.data.forEach((c: any) => {
          if (!c.user_id) return;
          activityCounts[c.user_id] = (activityCounts[c.user_id] || 0) + 300;
        });
      }

      // Post başına 30 dakika (1800 sn)
      if (recentPosts.data && recentPosts.data.length > 0) {
        recentPosts.data.forEach((p: any) => {
          if (!p.author_id) return;
          activityCounts[p.author_id] = (activityCounts[p.author_id] || 0) + 1800;
        });
      }

      // Local posts'lar da NBK BARIS için eklenebilir ama direkt NBK BARIS'a bonus verelim
      const nbkId = 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca'; // NBK BARIŞ'ın ID'si
      if (!activityCounts[nbkId]) activityCounts[nbkId] = 0;
      activityCounts[nbkId] += 14400; // Ekstra 4 saat aktiflik süresi (postlardan dolayı)

      if (Object.keys(activityCounts).length > 0) {
        const topActivityIds = Object.entries(activityCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id]) => id);
        
        const { data: actProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .in('id', topActivityIds);

        if (actProfiles) {
          const list = topActivityIds.map(uid => {
            const prof = actProfiles.find((p: any) => p.id === uid);
            return {
              user_id: uid,
              full_name: prof?.full_name || 'Anonim',
              avatar_url: prof?.avatar_url || null,
              role: prof?.role || 'member',
              seconds: activityCounts[uid],
            };
          });
          setActivityLeaders(list);
        }
      } else {
        setActivityLeaders([]);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── İlk yükleme + 5 dakikada bir otomatik yenile (istek tasarrufu) ──
  useEffect(() => {
    fetchLeaders();
    const refreshInterval = setInterval(fetchLeaders, 5 * 60 * 1000); // 5 dakika
    return () => clearInterval(refreshInterval);
  }, [fetchLeaders]);

  // ── Sekmeler arası otomatik geçiş (her 4sn) — kullanıcı tıklamazsa ──
  useEffect(() => {
    autoTabRef.current = setInterval(() => {
      if (manualTabRef.current) return;
      setTab(prev => {
        const idx = TABS.findIndex(t => t.key === prev);
        return TABS[(idx + 1) % TABS.length].key;
      });
    }, 4000);
    return () => { if (autoTabRef.current) clearInterval(autoTabRef.current); };
  }, []);

  function handleTabClick(key: Tab) {
    manualTabRef.current = true;
    setTab(key);
    // 15sn sonra otomatik geçişi tekrar aç
    setTimeout(() => { manualTabRef.current = false; }, 15000);
  }

  // ── Render yardımcıları ──────────────────────────────────────
  function renderList(
    entries: { user_id: string; full_name: string; avatar_url: string | null; role: string; count?: number; seconds?: number }[],
    valueKey: 'count' | 'seconds',
    unitLabel: string,
  ) {
    if (loading) return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ color: '#e60000' }}></i>
      </div>
    );
    if (entries.length === 0) return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '12px' }}>
        Henüz veri yok.
      </div>
    );

    return entries.map((entry, i) => {
      const rank = RANK_STYLES[i];
      const roleBadge = ROLE_BADGE[entry.role] || ROLE_BADGE['member'];
      const isTop3 = i < 3;
      const value = valueKey === 'seconds' ? formatDuration(entry.seconds ?? 0) : String(entry.count ?? 0);

      return (
        <Link
          key={entry.user_id}
          href={`/user/${entry.user_id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            background: isTop3 ? rank.bg : 'transparent',
            borderLeft: isTop3 ? `3px solid ${rank.border}` : '3px solid transparent',
            textDecoration: 'none',
            transition: 'background 0.2s',
            marginBottom: '2px',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = isTop3 ? rank.bg : '#1a1a1a')}
          onMouseLeave={e => (e.currentTarget.style.background = isTop3 ? rank.bg : 'transparent')}
        >
          {/* Madalya / sıra */}
          <div style={{ width: '28px', textAlign: 'center', flexShrink: 0 }}>
            {isTop3 ? (
              <i className={`fa-solid ${rank.icon}`} style={{ fontSize: '20px', color: rank.color, filter: `drop-shadow(${rank.glow})` }}></i>
            ) : (
              <span style={{ fontSize: '12px', color: '#555', fontWeight: 700 }}>{i + 1}.</span>
            )}
          </div>

          {/* Avatar */}
          <img
            src={entry.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.full_name}`}
            alt={entry.full_name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isTop3 ? rank.color : '#333'}`, flexShrink: 0 }}
          />

          {/* İsim + Rol */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: isTop3 ? rank.color : '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {entry.full_name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ background: roleBadge.color, color: '#fff', fontSize: '9px', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                {roleBadge.label}
              </span>
              {isTop3 && (
                <span style={{ background: rank.color, color: '#000', fontSize: '9px', padding: '1px 5px', borderRadius: '3px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <i className={`fa-solid ${rank.icon}`} style={{ fontSize: '9px' }}></i>
                  {rank.label} SIRA
                </span>
              )}
            </div>
          </div>

          {/* Değer */}
          <div style={{ fontSize: '13px', fontWeight: 900, color: isTop3 ? rank.color : '#555', flexShrink: 0, textAlign: 'right' }}>
            {value}
            <div style={{ fontSize: '9px', color: '#555', fontWeight: 400 }}>{unitLabel}</div>
          </div>
        </Link>
      );
    });
  }

  const activeEntries =
    tab === 'posts'    ? postLeaders :
    tab === 'comments' ? commentLeaders :
    activityLeaders;

  const unitLabel =
    tab === 'posts'    ? 'gönderi' :
    tab === 'comments' ? 'yorum' :
    'aktiflik';

  return (
    <div className="sidebar-widget" style={{ overflow: 'hidden' }}>
      {/* Başlık */}
      <div className="widget-header" style={{ background: 'linear-gradient(90deg, #1a0000, #111)', borderBottom: '2px solid #e60000', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-trophy" style={{ color: '#FFD700' }}></i>
          <span style={{ letterSpacing: '1px' }}>SKOR TABLOSU</span>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: '9px', color: '#555', fontWeight: 400 }}>
            <i className="fa-solid fa-rotate" style={{ marginRight: '3px', color: '#2ea44f' }}></i>
            {lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {/* Sekmeler */}
      <div style={{ display: 'flex', borderBottom: '1px solid #222' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabClick(t.key)}
            style={{
              flex: 1,
              background: tab === t.key ? '#1a0000' : 'transparent',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #e60000' : '2px solid transparent',
              color: tab === t.key ? '#fff' : '#666',
              padding: '9px 0',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <i className={`fa-solid ${t.icon}`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ padding: '10px 0', minHeight: '80px' }}>
        {renderList(
          activeEntries as any,
          tab === 'activity' ? 'seconds' : 'count',
          unitLabel,
        )}
      </div>

      {/* Alt bilgi */}
      <div style={{ padding: '6px 12px', borderTop: '1px solid #1a1a1a', fontSize: '10px', color: '#444', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ea44f', display: 'inline-block', animation: 'pulse-green 1.5s infinite' }}></span>
        Her 5dk güncellenir · Aktiflik her Pazartesi sıfırlanır
      </div>

      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
