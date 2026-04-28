'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

type LeaderEntry = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  count: number;
};

// Rozet bilgileri — 1. 2. 3. sıra
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

type Tab = 'posts' | 'comments';

export default function Leaderboard() {
  const [tab, setTab] = useState<Tab>('posts');
  const [postLeaders, setPostLeaders] = useState<LeaderEntry[]>([]);
  const [commentLeaders, setCommentLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  async function fetchLeaders() {
    setLoading(true);
    try {
      // --- En çok onaylı gönderi paylaşanlar ---
      const { data: postData } = await supabase
        .from('user_posts')
        .select('author_id, profiles(full_name, avatar_url, role)')
        .eq('is_approved', true);

      if (postData) {
        const counts: Record<string, LeaderEntry> = {};
        postData.forEach((row: any) => {
          if (!row.author_id || !row.profiles) return;
          if (!counts[row.author_id]) {
            counts[row.author_id] = {
              user_id: row.author_id,
              full_name: row.profiles.full_name || 'Anonim',
              avatar_url: row.profiles.avatar_url,
              role: row.profiles.role || 'member',
              count: 0,
            };
          }
          counts[row.author_id].count++;
        });
        const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 10);
        setPostLeaders(sorted);
      }

      // --- En çok yorum yapanlar ---
      const { data: commentData } = await supabase
        .from('comments')
        .select('user_id, profiles(full_name, avatar_url, role)')
        .not('user_id', 'is', null);

      if (commentData) {
        const counts: Record<string, LeaderEntry> = {};
        commentData.forEach((row: any) => {
          if (!row.user_id || !row.profiles) return;
          if (!counts[row.user_id]) {
            counts[row.user_id] = {
              user_id: row.user_id,
              full_name: row.profiles.full_name || 'Anonim',
              avatar_url: row.profiles.avatar_url,
              role: row.profiles.role || 'member',
              count: 0,
            };
          }
          counts[row.user_id].count++;
        });
        const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 10);
        setCommentLeaders(sorted);
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const leaders = tab === 'posts' ? postLeaders : commentLeaders;
  const emptyMsg = tab === 'posts' ? 'Henüz onaylı gönderi yok.' : 'Henüz yorum yapılmamış.';
  const countLabel = tab === 'posts' ? 'gönderi' : 'yorum';

  return (
    <div className="sidebar-widget" style={{ overflow: 'hidden' }}>
      {/* Başlık */}
      <div className="widget-header" style={{ background: 'linear-gradient(90deg, #1a0000, #111)', borderBottom: '2px solid #e60000' }}>
        <i className="fa-solid fa-trophy" style={{ color: '#FFD700' }}></i>
        <span style={{ letterSpacing: '1px' }}>LIDERBOARD</span>
      </div>

      {/* Sekmeler */}
      <div style={{ display: 'flex', borderBottom: '1px solid #222' }}>
        {([
          { key: 'posts', icon: 'fa-pen-nib', label: 'Paylaşım' },
          { key: 'comments', icon: 'fa-comments', label: 'Yorum' },
        ] as { key: Tab; icon: string; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              background: tab === t.key ? '#1a0000' : 'transparent',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #e60000' : '2px solid transparent',
              color: tab === t.key ? '#fff' : '#666',
              padding: '9px 0',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <i className={`fa-solid ${t.icon}`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ padding: '10px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ color: '#e60000' }}></i>
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '12px' }}>{emptyMsg}</div>
        ) : (
          leaders.map((entry, i) => {
            const rank = RANK_STYLES[i];
            const roleBadge = ROLE_BADGE[entry.role] || ROLE_BADGE['member'];
            const isTop3 = i < 3;

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
                {/* Sıra numarası / madalya */}
                <div style={{
                  width: '28px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  {isTop3 ? (
                    <i
                      className={`fa-solid ${rank.icon}`}
                      style={{
                        fontSize: '20px',
                        color: rank.color,
                        filter: `drop-shadow(${rank.glow})`,
                      }}
                    ></i>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#555', fontWeight: 700 }}>{i + 1}.</span>
                  )}
                </div>

                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={entry.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.full_name}`}
                    alt={entry.full_name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${isTop3 ? rank.color : '#333'}`,
                    }}
                  />
                </div>

                {/* İsim + Rol */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isTop3 ? rank.color : '#ccc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {entry.full_name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <span style={{
                      background: roleBadge.color,
                      color: '#fff',
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontWeight: 700,
                    }}>
                      {roleBadge.label}
                    </span>
                    {isTop3 && (
                      <span style={{
                        background: rank.color,
                        color: '#000',
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}>
                        <i className={`fa-solid ${rank.icon}`} style={{ fontSize: '9px' }}></i>
                        {rank.label} SIRA
                      </span>
                    )}
                  </div>
                </div>

                {/* Sayı */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: isTop3 ? rank.color : '#555',
                  flexShrink: 0,
                  textAlign: 'right',
                }}>
                  {entry.count}
                  <div style={{ fontSize: '9px', color: '#555', fontWeight: 400 }}>{countLabel}</div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Alt not */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #1a1a1a', fontSize: '10px', color: '#444', textAlign: 'center' }}>
        <i className="fa-solid fa-rotate" style={{ marginRight: '4px' }}></i>
        Her sayfa yüklenişinde güncellenir
      </div>
    </div>
  );
}
