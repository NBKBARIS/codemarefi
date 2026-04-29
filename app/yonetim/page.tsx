'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getPendingPosts, approvePost, deletePost, UserPost } from '../lib/userPosts';
import { writeLog, LOG_LABELS, ActivityLog, LogAction } from '../lib/activityLog';
import { sendNotification } from '../lib/notifications';
import { enhanceSeo } from '../lib/seoEnhancer';
import { localPosts } from '../lib/localPosts';
import { useRouter } from 'next/navigation';

type Tab = 'posts' | 'users' | 'comments' | 'logs';

export default function YonetimPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<'no-session' | 'no-permission' | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [userSearch, setUserSearch] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setAccessDenied('no-session'); setLoading(false); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!prof || (prof.role !== 'admin' && prof.role !== 'mod')) { setAccessDenied('no-permission'); setLoading(false); return; }
      setUser(session.user);
      setProfile(prof);
      fetchPosts();
    }
    checkAuth();
  }, []);

  async function fetchPosts() {
    try { const pending = await getPendingPosts(); setPosts(pending); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200);
    if (data) setUsers(data);
  }

  async function fetchComments() {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(200);
    if (data) setAllComments(data);
  }

  async function fetchLogs() {
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(500);
    if (data) setLogs(data as ActivityLog[]);
  }

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'comments') fetchComments();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  async function handleApprove(id: string) {
    const post = posts.find(p => p.id === id);
    setActionLoading(id);
    try {
      // SEO otomatik düzeltici uygula
      const seo = enhanceSeo(
        post?.title || '',
        post?.content || '',
        post?.categories || [],
      );

      // SEO düzeltilmiş içerikle güncelle + onayla
      await supabase
        .from('user_posts')
        .update({ content: seo.content, is_approved: true })
        .eq('id', id);

      if (post?.author_id) {
        const { data: up } = await supabase.from('profiles').select('role').eq('id', post.author_id).single();
        if (up?.role === 'member') await supabase.from('profiles').update({ role: 'author' }).eq('id', post.author_id);
        await sendNotification(
          post.author_id,
          'post_approved',
          'Gönderiniz onaylandı!',
          `"${post.title}" başlıklı gönderiniz yayına alındı. SEO skoru: ${seo.seoScore}/100`,
          id,
        );
      }
      await writeLog('post_approved', `"${post?.title}" onaylandı (SEO: ${seo.seoScore}/100)`, user?.id, post?.author_id, post?.profiles?.full_name);
      setPosts(posts.filter(p => p.id !== id));
      alert(`Yazı onaylandı! SEO skoru: ${seo.seoScore}/100\nYapılan iyileştirmeler:\n• ${seo.improvements.join('\n• ') || 'İçerik zaten SEO uyumlu'}`);
    } catch (err: any) { alert('Onaylama hatası: ' + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleReject(id: string) {
    const post = posts.find(p => p.id === id);
    if (!confirm(`"${post?.title}" gönderisini REDDET ve sil?`)) return;
    setActionLoading(id);
    try {
      await deletePost(id);
      await writeLog('post_rejected', `"${post?.title}" reddedildi`, user?.id, post?.author_id, post?.profiles?.full_name);
      // Bildirim gönder
      if (post?.author_id) {
        await sendNotification(
          post.author_id,
          'post_rejected',
          'Gönderiniz reddedildi',
          `"${post.title}" başlıklı gönderiniz kurallara aykırı bulunarak reddedildi.`,
          undefined,
        );
      }
      setPosts(posts.filter(p => p.id !== id));
      alert('Gönderi reddedildi ve silindi.');
    } catch { alert('Hata!'); }
    finally { setActionLoading(null); }
  }

  async function handleDeletePost(id: string, title?: string, authorId?: string, authorName?: string) {
    if (!confirm('Bu yazıyı SİLMEK istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      await deletePost(id);
      await writeLog('post_deleted', `"${title}" silindi (admin)`, user?.id, authorId, authorName);
      setPosts(posts.filter(p => p.id !== id));
      alert('Yazı silindi.');
    } catch { alert('Silme hatası!'); }
    finally { setActionLoading(null); }
  }

  async function handleBanUser(userId: string, currentRole: string, userName: string) {
    const isBanned = currentRole === 'banned';
    if (!confirm(`${userName} kullanıcısını ${isBanned ? 'BAN KALDIR' : 'BANLA'}?`)) return;
    setActionLoading(userId);
    try {
      await supabase.from('profiles').update({ role: isBanned ? 'member' : 'banned' }).eq('id', userId);
      await writeLog(isBanned ? 'user_unbanned' : 'user_banned', `${userName} ${isBanned ? 'ban kaldırıldı' : 'banlandı'}`, user?.id, userId, userName);
      fetchUsers();
    } catch { alert('Hata!'); }
    finally { setActionLoading(null); }
  }

  async function handleChangeRole(userId: string, newRole: string, userName: string) {
    setActionLoading(userId);
    try {
      await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      await writeLog('role_changed', `${userName} rutbesi ${newRole} yapildi`, user?.id, userId, userName);
      fetchUsers();
    } catch { alert('Hata!'); }
    finally { setActionLoading(null); }
  }

  async function handleRenameUser(userId: string, oldName: string) {
    if (!newName.trim()) return;
    setActionLoading(userId);
    try {
      await supabase.from('profiles').update({ full_name: newName.trim() }).eq('id', userId);
      await writeLog('username_changed', `${oldName} -> ${newName.trim()}`, user?.id, userId, oldName);
      setEditingUser(null); setNewName('');
      fetchUsers();
    } catch { alert('Hata!'); }
    finally { setActionLoading(null); }
  }

  async function handleDeleteComment(id: string, content: string, authorName: string) {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      await supabase.from('comments').delete().eq('id', id);
      await writeLog('comment_deleted', `"${content.slice(0, 60)}..." silindi`, user?.id, null, authorName);
      setAllComments(allComments.filter(c => c.id !== id));
    } catch { alert('Hata!'); }
    finally { setActionLoading(null); }
  }

  const ROLE_COLORS: Record<string, string> = {
    admin: '#e60000', mod: '#2ea44f', author: '#ff8c00', member: '#007bff', banned: '#555'
  };
  const ROLE_LABELS: Record<string, string> = {
    admin: 'Yönetici', mod: 'Moderatör', author: 'Yazar', member: 'Üye', banned: 'Banlı'
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ color: '#e60000', fontSize: '36px' }}></i>
    </div>
  );

  if (accessDenied) {
    return (
      <div style={{ color: '#fff', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className={`fa-solid ${accessDenied === 'no-session' ? 'fa-user-lock' : 'fa-shield-halved'}`} style={{ fontSize: '60px', color: '#e60000', marginBottom: '20px' }}></i>
          <h1 style={{ color: '#e60000' }}>{accessDenied === 'no-session' ? 'Oturum Gerekli' : 'Yetki Yetersiz'}</h1>
          <button onClick={() => router.push('/')} style={{ background: '#e60000', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', marginTop: '20px' }}>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.id?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = logFilter === 'all' ? logs : logs.filter(l => l.action === logFilter);

  return (
    <div style={{ padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-user-shield" style={{ color: '#e60000' }}></i>
            Yönetim Paneli
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={async () => {
                if (!confirm('Tüm onaylı gönderilere SEO düzeltmesi uygulanacak. Devam?')) return;
                const { data: allPosts } = await supabase.from('user_posts').select('*').eq('is_approved', true);
                if (!allPosts?.length) { alert('Onaylı gönderi yok.'); return; }
                let fixed = 0;
                for (const p of allPosts) {
                  const seo = enhanceSeo(p.title, p.content, p.categories);
                  if (seo.improvements.length > 0) {
                    await supabase.from('user_posts').update({ content: seo.content }).eq('id', p.id);
                    fixed++;
                  }
                }
                alert(`${fixed} gönderi SEO düzeltmesi uygulandı!`);
              }}
              style={{ background: '#1a1a1a', color: '#2ea44f', border: '1px solid #2ea44f', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Tüm Postları SEO Düzelt
            </button>
            <button
              onClick={async () => {
                if (!confirm('Yerel dosyada bulunan 5 orijinal gönderi veritabanınıza (sizin adınıza) geri yüklenecektir. Onaylıyor musunuz?')) return;
                try {
                  let restored = 0;
                  for (const p of localPosts) {
                    const { data: check } = await supabase.from('user_posts').select('id').ilike('title', p.title).single();
                    if (!check) {
                      await supabase.from('user_posts').insert({
                        title: p.title,
                        content: p.content,
                        thumbnail_url: p.thumbnail,
                        author_id: user?.id,
                        categories: p.categories,
                        is_approved: true,
                        created_at: p.published
                      });
                      restored++;
                    }
                  }
                  alert(`${restored} gönderi başarıyla veritabanına kurtarıldı!`);
                  fetchPosts();
                } catch (e: any) { alert('Hata: ' + e.message); }
              }}
              style={{ background: '#1a1a1a', color: '#00a8cc', border: '1px solid #00a8cc', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fa-solid fa-life-ring"></i>
              Silinenleri Kurtar
            </button>
            <button
              onClick={async () => {
                if (!confirm('Tüm onaylı gönderilerdeki duble "CodeMareFi Notu" ve etiketler temizlenecektir. Devam?')) return;
                try {
                  const { data: allPosts } = await supabase.from('user_posts').select('id, title, content').eq('is_approved', true);
                  if (!allPosts?.length) { alert('Onaylı gönderi yok.'); return; }
                  let fixed = 0;
                  for (const post of allPosts) {
                    let content = post.content || '';
                    let changed = false;

                    const noteMarker = "CodeMareFi Notu:";
                    if (content.split(noteMarker).length > 2) {
                      const divPattern = /<div style="background:\s*rgba\(230,\s*0,\s*0,\s*0\.08\);[^>]*>[\s\S]*?<\/div>/gi;
                      let firstFound = false;
                      content = content.replace(divPattern, (match) => {
                        if (match.includes(noteMarker)) {
                          if (!firstFound) { firstFound = true; return match; }
                          return ''; // Remove duplicate
                        }
                        return match;
                      });
                      changed = true;
                    }

                    if (changed) {
                      await supabase.from('user_posts').update({ content }).eq('id', post.id);
                      fixed++;
                    }
                  }
                  alert(`${fixed} gönderideki dubleler temizlendi! Lütfen F5 atın.`);
                } catch (e: any) { alert('Hata: ' + e.message); }
              }}
              style={{ background: '#1a1a1a', color: '#ff8c00', border: '1px solid #ff8c00', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fa-solid fa-broom"></i>
              Duble Temizle
            </button>
            <div style={{ background: '#111', padding: '8px 18px', borderRadius: '50px', border: '1px solid #1e1e1e', fontSize: '13px' }}>
              <i className="fa-solid fa-circle" style={{ color: '#2ea44f', fontSize: '8px', marginRight: '6px' }}></i>
              {profile?.role?.toUpperCase()} — {profile?.full_name}
            </div>
          </div>
        </div>

        {/* Sekmeler */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #1e1e1e', marginBottom: '25px', overflowX: 'auto' }}>
          {([
            { key: 'posts',    icon: 'fa-file-pen',   label: `Onay Bekleyen (${posts.length})` },
            { key: 'users',    icon: 'fa-users',      label: 'Kullanıcılar' },
            { key: 'comments', icon: 'fa-comments',   label: 'Yorumlar' },
            { key: 'logs',     icon: 'fa-scroll',     label: 'Aktivite Logları' },
          ] as { key: Tab; icon: string; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              background: activeTab === t.key ? '#e60000' : 'transparent',
              color: activeTab === t.key ? '#fff' : '#666',
              border: 'none', padding: '10px 18px', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: activeTab === t.key ? '2px solid #e60000' : '2px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              <i className={`fa-solid ${t.icon}`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* ── ONAY BEKLEYENLEr ── */}
        {activeTab === 'posts' && (
          posts.length === 0 ? (
            <div style={{ background: '#111', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #1e1e1e', color: '#555' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '40px', marginBottom: '15px', display: 'block', color: '#2ea44f' }}></i>
              Onay bekleyen yazı yok.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {posts.map(post => (
                <div key={post.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                  <img src={post.thumbnail_url} alt="" style={{ width: '180px', height: '130px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>{post.title}</h3>
                      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                        <i className="fa-solid fa-user" style={{ color: '#e60000', marginRight: '5px' }}></i>
                        {post.profiles?.full_name} &nbsp;|&nbsp;
                        <i className="fa-solid fa-tag" style={{ color: '#e60000', marginRight: '5px' }}></i>
                        {post.categories?.[0]}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleApprove(post.id)} disabled={actionLoading === post.id}
                        style={{ background: '#2ea44f', color: '#fff', border: 'none', padding: '7px 18px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fa-solid fa-check"></i> Onayla
                      </button>
                      <button onClick={() => handleReject(post.id)} disabled={actionLoading === post.id}
                        style={{ background: '#e60000', color: '#fff', border: 'none', padding: '7px 18px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fa-solid fa-xmark"></i> Reddet
                      </button>
                      <a href={`/post/${post.id}`} target="_blank" rel="noreferrer"
                        style={{ color: '#888', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', marginLeft: 'auto' }}>
                        Önizle <i className="fa-solid fa-up-right-from-square"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── KULLANICI YÖNETİMİ ── */}
        {activeTab === 'users' && (
          <div>
            <input type="text" placeholder="İsim veya ID ile ara..." value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              style={{ width: '100%', maxWidth: '400px', background: '#111', border: '1px solid #333', padding: '10px 14px', color: '#fff', borderRadius: '4px', outline: 'none', fontSize: '13px', marginBottom: '15px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredUsers.map(u => (
                <div key={u.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.full_name}`} alt=""
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ROLE_COLORS[u.role] || '#333'}`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    {editingUser === u.id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input value={newName} onChange={e => setNewName(e.target.value)}
                          style={{ background: '#0a0a0a', border: '1px solid #e60000', color: '#fff', padding: '4px 8px', borderRadius: '3px', fontSize: '12px', width: '140px' }} placeholder="Yeni isim..." />
                        <button onClick={() => handleRenameUser(u.id, u.full_name)} style={{ background: '#2ea44f', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>Kaydet</button>
                        <button onClick={() => setEditingUser(null)} style={{ background: '#333', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>İptal</button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', fontWeight: 700, color: u.role === 'banned' ? '#555' : '#fff', textDecoration: u.role === 'banned' ? 'line-through' : 'none' }}>
                        {u.full_name || 'İsimsiz'}
                      </div>
                    )}
                    <span style={{ background: ROLE_COLORS[u.role] || '#333', color: '#fff', fontSize: '9px', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                    <span style={{ color: '#444', fontSize: '10px', marginLeft: '6px' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button onClick={() => { setEditingUser(u.id); setNewName(u.full_name || ''); }} title="İsim Değiştir"
                      style={{ background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    {u.role !== 'admin' && (
                      <select value={u.role} onChange={e => handleChangeRole(u.id, e.target.value, u.full_name)} disabled={actionLoading === u.id}
                        style={{ background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '5px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
                        <option value="member">Üye</option>
                        <option value="author">Yazar</option>
                        <option value="mod">Moderatör</option>
                        <option value="banned">Banlı</option>
                      </select>
                    )}
                    {u.role !== 'admin' && (
                      <button onClick={() => handleBanUser(u.id, u.role, u.full_name)} disabled={actionLoading === u.id} title={u.role === 'banned' ? 'Banı Kaldır' : 'Banla'}
                        style={{ background: u.role === 'banned' ? '#2ea44f' : '#e60000', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                        <i className={`fa-solid ${u.role === 'banned' ? 'fa-unlock' : 'fa-ban'}`}></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <div style={{ color: '#555', textAlign: 'center', padding: '30px' }}>Kullanıcı bulunamadı.</div>}
            </div>
          </div>
        )}

        {/* ── YORUM YÖNETİMİ ── */}
        {activeTab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allComments.length === 0 ? (
              <div style={{ color: '#555', textAlign: 'center', padding: '40px' }}>Yorum bulunamadı.</div>
            ) : allComments.map(c => (
              <div key={c.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{c.author_name}</span>
                    <span style={{ background: ROLE_COLORS[c.role] || '#333', color: '#fff', fontSize: '9px', padding: '1px 5px', borderRadius: '3px' }}>
                      {ROLE_LABELS[c.role] || c.role}
                    </span>
                    <span style={{ color: '#555', fontSize: '11px' }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: '3px' }}></i>
                      {new Date(c.created_at).toLocaleDateString('tr-TR')}
                    </span>
                    <a href={`/post/${c.post_id}`} target="_blank" rel="noreferrer" style={{ color: '#e60000', fontSize: '11px', marginLeft: 'auto', textDecoration: 'none' }}>
                      Yazıya Git <i className="fa-solid fa-arrow-right" style={{ fontSize: '9px' }}></i>
                    </a>
                  </div>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{c.content}</p>
                </div>
                <button onClick={() => handleDeleteComment(c.id, c.content, c.author_name)} disabled={actionLoading === c.id}
                  style={{ background: '#e60000', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── AKTİVİTE LOGLARI ── */}
        {activeTab === 'logs' && (
          <div>
            {/* Filtre */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <select value={logFilter} onChange={e => setLogFilter(e.target.value)}
                style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                <option value="all">Tüm Loglar</option>
                <option value="user_register">Kayıt</option>
                <option value="post_submit">Gönderi Gönderildi</option>
                <option value="post_approved">Gönderi Onaylandı</option>
                <option value="post_rejected">Gönderi Reddedildi</option>
                <option value="post_deleted">Gönderi Silindi</option>
                <option value="comment_posted">Yorum</option>
                <option value="comment_deleted">Yorum Silindi</option>
                <option value="bad_word_detected">Uygunsuz İçerik</option>
                <option value="user_banned">Ban</option>
                <option value="role_changed">Rütbe Değişimi</option>
              </select>
              <button onClick={fetchLogs} style={{ background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-solid fa-rotate"></i> Yenile
              </button>
              <span style={{ color: '#555', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                {filteredLogs.length} kayıt
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredLogs.length === 0 ? (
                <div style={{ color: '#555', textAlign: 'center', padding: '40px' }}>
                  <i className="fa-solid fa-scroll" style={{ fontSize: '30px', marginBottom: '10px', display: 'block' }}></i>
                  Henüz log kaydı yok.
                </div>
              ) : filteredLogs.map(log => {
                const meta = LOG_LABELS[log.action as LogAction] || { label: log.action, color: '#555', icon: 'fa-circle' };
                return (
                  <div key={log.id} style={{ background: '#0d0d0d', border: `1px solid #1a1a1a`, borderLeft: `3px solid ${meta.color}`, borderRadius: '4px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color, fontSize: '14px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ background: meta.color + '22', color: meta.color, fontSize: '10px', padding: '1px 7px', borderRadius: '3px', fontWeight: 700 }}>
                          {meta.label}
                        </span>
                        {log.target_name && (
                          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>{log.target_name}</span>
                        )}
                        <span style={{ color: '#444', fontSize: '11px', marginLeft: 'auto' }}>
                          {new Date(log.created_at).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      {log.details && (
                        <p style={{ color: '#666', fontSize: '12px', margin: 0, lineHeight: 1.4, wordBreak: 'break-word' }}>{log.details}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
