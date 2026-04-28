'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
  Notification,
} from '../lib/notifications';

const TYPE_META: Record<string, { icon: string; color: string }> = {
  comment:       { icon: 'fa-comment',       color: '#007bff' },
  post_approved: { icon: 'fa-circle-check',  color: '#2ea44f' },
  post_rejected: { icon: 'fa-circle-xmark',  color: '#e60000' },
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}sn önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // İlk yükleme + realtime
  useEffect(() => {
    loadData();

    // Realtime: yeni bildirim gelince güncelle
    const channel = supabase
      .channel('notifications:' + userId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, () => loadData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Panel dışına tıklayınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function loadData() {
    const [notifs, count] = await Promise.all([
      getNotifications(userId),
      getUnreadCount(userId),
    ]);
    setNotifications(notifs);
    setUnread(count);
  }

  async function handleOpen() {
    setOpen(o => !o);
  }

  async function handleMarkAll() {
    await markAllRead(userId);
    setUnread(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }

  async function handleClick(notif: Notification) {
    if (!notif.is_read) {
      await markOneRead(notif.id);
      setUnread(u => Math.max(0, u - 1));
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
    setOpen(false);
    if (notif.post_id) router.push(`/post/${notif.post_id}`);
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Zil ikonu */}
      <button
        onClick={handleOpen}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '4px 8px',
          color: open ? '#fff' : '#888',
          fontSize: '16px',
          transition: 'color 0.2s',
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.color = '#888'; }}
        title="Bildirimler"
      >
        <i className={`fa-solid fa-bell${unread > 0 ? ' fa-shake' : ''}`}></i>
        {unread > 0 && (
          <span style={{
            position: 'absolute',
            top: '0px',
            right: '2px',
            background: '#e60000',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 900,
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '320px',
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          zIndex: 9999,
          overflow: 'hidden',
        }}>
          {/* Başlık */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <i className="fa-solid fa-bell" style={{ color: '#e60000' }}></i>
              Bildirimler
              {unread > 0 && (
                <span style={{ background: '#e60000', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 900 }}>
                  {unread} yeni
                </span>
              )}
            </span>
            {unread > 0 && (
              <button onClick={handleMarkAll} style={{ background: 'none', border: 'none', color: '#555', fontSize: '11px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          {/* Liste */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#444' }}>
                <i className="fa-solid fa-bell-slash" style={{ fontSize: '28px', marginBottom: '10px', display: 'block' }}></i>
                <span style={{ fontSize: '12px' }}>Henüz bildirim yok</span>
              </div>
            ) : notifications.map(n => {
              const meta = TYPE_META[n.type] || { icon: 'fa-circle', color: '#555' };
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #111',
                    cursor: n.post_id ? 'pointer' : 'default',
                    background: n.is_read ? 'transparent' : 'rgba(230,0,0,0.04)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#111')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(230,0,0,0.04)')}
                >
                  {/* İkon */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: meta.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color, fontSize: '13px' }}></i>
                  </div>
                  {/* İçerik */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: n.is_read ? 400 : 700, color: n.is_read ? '#aaa' : '#fff', lineHeight: 1.4, marginBottom: '3px' }}>
                      {n.title}
                    </div>
                    {n.message && (
                      <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {n.message}
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                  {/* Okunmamış nokta */}
                  {!n.is_read && (
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e60000', flexShrink: 0, marginTop: '4px' }}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
