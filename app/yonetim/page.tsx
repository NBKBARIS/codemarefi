'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getPendingPosts, getApprovedPosts, approvePost, deletePost, UserPost } from '../lib/userPosts';
import { writeLog, LOG_LABELS, ActivityLog, LogAction } from '../lib/activityLog';
import { sendNotification } from '../lib/notifications';
import { enhanceSeo } from '../lib/seoEnhancer';
import { localPosts } from '../lib/localPosts';
import { useRouter } from 'next/navigation';

type Tab = 'posts' | 'all_posts' | 'users' | 'comments' | 'logs';

export default function YonetimPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [allApprovedPosts, setAllApprovedPosts] = useState<UserPost[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<'no-session' | 'no-permission' | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newName, setNewName] = useState('');

  // İstatistikler
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPosts: 0,
    totalPosts: 0,
    totalComments: 0
  });

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setAccessDenied('no-session'); setLoading(false); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!prof || (prof.role !== 'admin' && prof.role !== 'mod')) { setAccessDenied('no-permission'); setLoading(false); return; }
      setUser(session.user);
      setProfile(prof);
      fetchPosts();
      fetchStats();
    }
    checkAuth();
  }, []);

  async function fetchStats() {
    const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: pCount } = await supabase.from('user_posts').select('*', { count: 'exact', head: true }).eq('is_approved', false);
    const { count: aCount } = await supabase.from('user_posts').select('*', { count: 'exact', head: true }).eq('is_approved', true);
    const { count: cCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
    
    setStats({
      totalUsers: uCount || 0,
      pendingPosts: pCount || 0,
      totalPosts: aCount || 0,
      totalComments: cCount || 0
    });
  }

  async function fetchPosts() {
    try { 
      const pending = await getPendingPosts(); 
      setPosts(pending); 
    }
    catch (e: any) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchAllApprovedPosts() {
    try {
      const approved = await getApprovedPosts();
      setAllApprovedPosts(approved);
    } catch (e: any) { console.error(e); }
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
    if (activeTab === 'all_posts') fetchAllApprovedPosts();
    if (activeTab === 'posts') fetchPosts();
  }, [activeTab]);

  async function handleApprove(id: string) {
    const post = posts.find(p => p.id === id);
    setActionLoading(id);
    try {
      const seo = enhanceSeo(post?.title || '', post?.content || '', post?.categories || []);
      const { error: updateError } = await supabase.from('user_posts').update({ content: seo.content, is_approved: true }).eq('id', id);
      if (updateError) throw updateError;

      if (post?.author_id) {
        const { data: up } = await supabase.from('profiles').select('role').eq('id', post.author_id).single();
        if (up?.role === 'member') {
          const { error: roleErr } = await supabase.from('profiles').update({ role: 'author' }).eq('id', post.author_id);
          if (roleErr) throw roleErr;
        }
        await sendNotification(post.author_id, 'post_approved', 'Gönderiniz onaylandı!', `"${post.title}" başlıklı gönderiniz yayına alındı.`, id);
      }
      await writeLog('post_approved', `"${post?.title}" onaylandı`, user?.id, post?.author_id, post?.profiles?.full_name);
      setPosts(posts.filter(p => p.id !== id));
      fetchStats();
      alert(`Yazı onaylandı! SEO skoru: ${seo.seoScore}/100`);
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
      if (post?.author_id) {
        await sendNotification(post.author_id, 'post_rejected', 'Gönderiniz reddedildi', `"${post.title}" başlıklı gönderiniz kurallara aykırı bulundu.`, undefined);
      }
      setPosts(posts.filter(p => p.id !== id));
      fetchStats();
      alert('Gönderi reddedildi.');
    } catch (err: any) { alert('Hata: ' + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleDeletePost(id: string, title?: string, authorId?: string, authorName?: string) {
    if (!confirm('Bu yazıyı SİLMEK istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      await deletePost(id);
      await writeLog('post_deleted', `"${title}" silindi (admin)`, user?.id, authorId, authorName);
      setPosts(posts.filter(p => p.id !== id));
      setAllApprovedPosts(allApprovedPosts.filter(p => p.id !== id));
      fetchStats();
      alert('Yazı silindi.');
    } catch (err: any) { alert('Silme hatası: ' + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleBanUser(userId: string, currentRole: string, userName: string) {
    const isBanned = currentRole === 'banned';
    if (!confirm(`${userName} kullanıcısını ${isBanned ? 'BAN KALDIR' : 'BANLA'}?`)) return;
    setActionLoading(userId);
    try {
      const { error } = await supabase.from('profiles').update({ role: isBanned ? 'member' : 'banned' }).eq('id', userId);
      if (error) throw error;
      await writeLog(isBanned ? 'user_unbanned' : 'user_banned', `${userName} ${isBanned ? 'ban kaldırıldı' : 'banlandı'}`, user?.id, userId, userName);
      fetchUsers();
    } catch (err: any) { alert('Hata: ' + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleChangeRole(userId: string, newRole: string, userName: string) {
    setActionLoading(userId);
    try {
      console.log('🔄 Rol değiştiriliyor:', { userId, newRole, userName });
      const { data, error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId).select();
      if (error) {
        console.error('❌ Rol değiştirme hatası:', error);
        throw error;
      }
      console.log('✅ Rol değiştirildi:', data);
      await writeLog('role_changed', `${userName} rutbesi ${newRole} yapildi`, user?.id, userId, userName);
      fetchUsers();
      alert(`✅ ${userName} kullanıcısının rolü ${newRole} olarak değiştirildi!`);
    } catch (err: any) { 
      console.error('❌ Hata:', err);
      alert('Hata: ' + err.message); 
    }
    finally { setActionLoading(null); }
  }

  async function handleRenameUser(userId: string, oldName: string) {
    if (!newName.trim()) return;
    setActionLoading(userId);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: newName.trim() }).eq('id', userId);
      if (error) throw error;
      await writeLog('username_changed', `${oldName} -> ${newName.trim()}`, user?.id, userId, oldName);
      setEditingUser(null); setNewName('');
      fetchUsers();
    } catch (err: any) { alert('Hata: ' + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleDeleteComment(id: string, content: string, authorName: string) {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
      await writeLog('comment_deleted', `"${content.slice(0, 60)}..." silindi`, user?.id, null, authorName);
      setAllComments(allComments.filter(c => c.id !== id));
      fetchStats();
    } catch (err: any) { alert('Hata: ' + err.message); }
    finally { setActionLoading(null); }
  }

  const ROLE_COLORS: Record<string, string> = {
    admin: '#e60000', mod: '#2ea44f', author: '#ff8c00', member: '#007bff', banned: '#555'
  };
  const ROLE_LABELS: Record<string, string> = {
    admin: 'Yönetici', mod: 'Moderatör', author: 'Yazar', member: 'Üye', banned: 'Banlı'
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ color: '#e60000', fontSize: '48px' }}></i>
    </div>
  );

  if (accessDenied) {
    return (
      <div style={{ color: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'rgba(20,20,20,0.6)', padding: '50px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid #1e1e1e' }}>
          <i className={`fa-solid ${accessDenied === 'no-session' ? 'fa-user-lock' : 'fa-shield-halved'}`} style={{ fontSize: '80px', color: '#e60000', marginBottom: '25px' }}></i>
          <h1 style={{ color: '#e60000', fontSize: '32px', marginBottom: '15px' }}>{accessDenied === 'no-session' ? 'Oturum Gerekli' : 'Yetki Yetersiz'}</h1>
          <p style={{ color: '#888', marginBottom: '30px' }}>Bu sayfaya erişim sadece yöneticiler içindir.</p>
          <button onClick={() => router.push('/')} style={{ background: '#e60000', color: '#fff', border: 'none', padding: '14px 35px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
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

  const filteredApprovedPosts = allApprovedPosts.filter(p =>
    p.title?.toLowerCase().includes(postSearch.toLowerCase()) ||
    p.profiles?.full_name?.toLowerCase().includes(postSearch.toLowerCase())
  );

  const filteredLogs = logFilter === 'all' ? logs : logs.filter(l => l.action === logFilter);

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'radial-gradient(circle at top right, #1a0000 0%, #050505 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '15px', color: '#fff', margin: 0 }}>
                <i className="fa-solid fa-user-shield" style={{ color: '#e60000' }}></i>
                Yönetim Paneli
              </h1>
              <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>Hoş geldin, {profile?.full_name}. Site trafiğini ve içeriği buradan yönetebilirsin.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 20px', borderRadius: '50px', border: '1px solid #1e1e1e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-circle" style={{ color: '#2ea44f', fontSize: '8px' }}></i>
                <span style={{ fontWeight: 800, color: ROLE_COLORS[profile?.role] }}>{profile?.role?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '40px' }}>
            {[
              { label: 'Kullanıcılar', val: stats.totalUsers, icon: 'fa-users', color: '#007bff' },
              { label: 'Onay Bekleyen', val: stats.pendingPosts, icon: 'fa-file-pen', color: '#ff8c00' },
              { label: 'Yayındaki Yazı', val: stats.totalPosts, icon: 'fa-newspaper', color: '#2ea44f' },
              { label: 'Toplam Yorum', val: stats.totalComments, icon: 'fa-comments', color: '#00bcd4' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(20,20,20,0.4)', border: '1px solid #1e1e1e', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(5px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: '20px' }}></i>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{s.val}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid #1e1e1e', marginBottom: '30px' }}>
            <button onClick={async () => {
                if (!confirm('Tüm gönderilere SEO düzeltmesi uygulanacak. Devam?')) return;
                const { data: allPosts } = await supabase.from('user_posts').select('*');
                if (!allPosts?.length) return;
                let fixed = 0;
                for (const p of allPosts) {
                  const seo = enhanceSeo(p.title, p.content, p.categories);
                  if (seo.improvements.length > 0) {
                    await supabase.from('user_posts').update({ content: seo.content }).eq('id', p.id);
                    fixed++;
                  }
                }
                alert(`${fixed} post düzeltildi.`);
              }} style={{ background: 'transparent', color: '#2ea44f', border: '1px solid #2ea44f33', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> SEO Toplu Düzelt
            </button>
            
            <button onClick={async () => {
                if (!confirm('Yerel gönderiler geri yüklensin mi?')) return;
                try {
                  let restored = 0;
                  for (const p of localPosts) {
                    const { data: check } = await supabase.from('user_posts').select('id').ilike('title', p.title).single();
                    if (!check) {
                      await supabase.from('user_posts').insert({
                        title: p.title, content: p.content, thumbnail_url: p.thumbnail, author_id: user?.id,
                        categories: p.categories, is_approved: true, created_at: p.published
                      });
                      restored++;
                    }
                  }
                  alert(`${restored} yazı kurtarıldı.`); fetchPosts(); fetchStats();
                } catch (e: any) { alert(e.message); }
              }} style={{ background: 'transparent', color: '#00a8cc', border: '1px solid #00a8cc33', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-life-ring"></i> Eksikleri Kurtar
            </button>

            <button onClick={async () => {
                if (!confirm('Duble notlar temizlensin mi?')) return;
                try {
                  const { data: allPosts } = await supabase.from('user_posts').select('id, content').eq('is_approved', true);
                  if (!allPosts) return;
                  let fixed = 0;
                  for (const post of allPosts) {
                    let content = post.content || '';
                    const noteMarker = "CodeMareFi Notu:";
                    if (content.split(noteMarker).length > 2) {
                      const divPattern = /<div style="background:\s*rgba\(230,\s*0,\s*0,\s*0\.08\);[^>]*>[\s\S]*?<\/div>/gi;
                      let firstFound = false;
                      content = content.replace(divPattern, (match) => {
                        if (match.includes(noteMarker)) {
                          if (!firstFound) { firstFound = true; return match; }
                          return '';
                        }
                        return match;
                      });
                      await supabase.from('user_posts').update({ content }).eq('id', post.id);
                      fixed++;
                    }
                  }
                  alert(`${fixed} yazı temizlendi.`);
                } catch (e: any) { alert(e.message); }
              }} style={{ background: 'transparent', color: '#ff8c00', border: '1px solid #ff8c0033', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-broom"></i> Duble Temizle
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '5px', borderBottom: '1px solid #1e1e1e', marginBottom: '30px', overflowX: 'auto', paddingBottom: '2px' }}>
          {([
            { key: 'posts',    icon: 'fa-file-pen',   label: `Bekleyen (${posts.length})` },
            { key: 'all_posts', icon: 'fa-newspaper',  label: 'Yayındakiler' },
            { key: 'users',    icon: 'fa-users',      label: 'Üyeler' },
            { key: 'comments', icon: 'fa-comments',   label: 'Yorumlar' },
            { key: 'logs',     icon: 'fa-scroll',     label: 'Loglar' },
          ] as { key: Tab; icon: string; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              background: activeTab === t.key ? 'rgba(230,0,0,0.1)' : 'transparent',
              color: activeTab === t.key ? '#e60000' : '#666',
              border: 'none', padding: '12px 20px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: activeTab === t.key ? '2px solid #e60000' : '2px solid transparent',
              marginBottom: '-1px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap',
              borderRadius: '8px 8px 0 0'
            }}>
              <i className={`fa-solid ${t.icon}`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          {/* ── ONay BEKLEYENLEr ── */}
          {activeTab === 'posts' && (
            posts.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '60px', textAlign: 'center', borderRadius: '16px', border: '1px dashed #333', color: '#555' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '50px', marginBottom: '20px', display: 'block', color: '#2ea44f33' }}></i>
                Onay bekleyen yazı bulunmuyor.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {posts.map(post => (
                  <div key={post.id} style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={post.thumbnail_url || '/no-image.png'} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', color: '#fff', backdropFilter: 'blur(4px)' }}>
                        {post.categories?.[0] || 'Genel'}
                      </div>
                    </div>
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: '#fff', lineHeight: 1.4 }}>{post.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <img src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.full_name}`} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        <span style={{ fontSize: '12px', color: '#888' }}>{post.profiles?.full_name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                        <button onClick={() => handleApprove(post.id)} disabled={actionLoading === post.id}
                          style={{ flex: 1, background: '#2ea44f', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-check"></i> Onayla
                        </button>
                        <button onClick={() => handleReject(post.id)} disabled={actionLoading === post.id}
                          style={{ flex: 1, background: '#1a1a1a', color: '#e60000', border: '1px solid #e6000033', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-xmark"></i> Reddet
                        </button>
                      </div>
                      <a href={`/post/${post.id}`} target="_blank" rel="noreferrer" style={{ textAlign: 'center', marginTop: '15px', color: '#444', fontSize: '11px', textDecoration: 'none' }}>
                        Önizlemeyi Gör <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '4px' }}></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── TÜM ONAYLI POSTLAr ── */}
          {activeTab === 'all_posts' && (
            <div>
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}></i>
                <input type="text" placeholder="Post başlığı veya yazar ara..." value={postSearch} onChange={e => setPostSearch(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e1e', padding: '12px 15px 12px 45px', color: '#fff', borderRadius: '10px', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {filteredApprovedPosts.map(post => (
                  <div key={post.id} style={{ background: 'rgba(20,20,20,0.6)', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img src={post.thumbnail_url || '/no-image.png'} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>{post.profiles?.full_name} • {new Date(post.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <button onClick={() => handleDeletePost(post.id, post.title, post.author_id, post.profiles?.full_name)}
                      style={{ background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', padding: '10px' }} onMouseOver={e => e.currentTarget.style.color = '#e60000'} onMouseOut={e => e.currentTarget.style.color = '#555'}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── KULLANICI YÖNETİMİ ── */}
          {activeTab === 'users' && (
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                  <i className="fa-solid fa-user-tag" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}></i>
                  <input type="text" placeholder="İsim veya ID ile kullanıcı ara..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', padding: '10px 15px 10px 40px', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '13px' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#555' }}>{filteredUsers.length} kullanıcı listeleniyor</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', color: '#444' }}>
                      <th style={{ padding: '15px 20px' }}>Kullanıcı</th>
                      <th style={{ padding: '15px' }}>Rütbe</th>
                      <th style={{ padding: '15px' }}>Kayıt Tarihi</th>
                      <th style={{ padding: '15px 20px', textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #111', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.full_name}`} alt=""
                              style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${ROLE_COLORS[u.role] || '#333'}` }} />
                            <div>
                              {editingUser === u.id ? (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} style={{ background: '#000', border: '1px solid #e60000', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }} />
                                  <button onClick={() => handleRenameUser(u.id, u.full_name)} style={{ background: '#2ea44f', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><i className="fa-solid fa-check"></i></button>
                                  <button onClick={() => setEditingUser(null)} style={{ background: '#333', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                                </div>
                              ) : (
                                <div style={{ fontWeight: 700, color: u.role === 'banned' ? '#444' : '#fff' }}>{u.full_name || 'İsimsiz'}</div>
                              )}
                              <div style={{ fontSize: '10px', color: '#333' }}>{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ background: ROLE_COLORS[u.role] + '15', color: ROLE_COLORS[u.role], fontSize: '10px', padding: '3px 10px', borderRadius: '50px', fontWeight: 800, border: `1px solid ${ROLE_COLORS[u.role]}33` }}>
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </td>
                        <td style={{ padding: '15px', color: '#555' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : '-'}
                        </td>
                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button onClick={() => { setEditingUser(u.id); setNewName(u.full_name || ''); }} style={{ background: 'transparent', border: '1px solid #333', color: '#666', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer' }} title="İsim Düzenle">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            {u.role !== 'admin' && (
                              <div style={{ position: 'relative' }}>
                                <select value={u.role} onChange={e => handleChangeRole(u.id, e.target.value, u.full_name)} disabled={actionLoading === u.id}
                                  style={{ background: '#111', color: '#888', border: '1px solid #333', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', appearance: 'none', paddingRight: '25px' }}>
                                  <option value="member">Üye</option>
                                  <option value="author">Yazar</option>
                                  <option value="mod">Moderatör</option>
                                  <option value="banned">Banlı</option>
                                </select>
                                <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '8px', color: '#444', pointerEvents: 'none' }}></i>
                              </div>
                            )}
                            {u.role !== 'admin' && (
                              <button onClick={() => handleBanUser(u.id, u.role, u.full_name)} disabled={actionLoading === u.id}
                                style={{ background: u.role === 'banned' ? '#2ea44f' : '#e60000', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer' }} title={u.role === 'banned' ? 'Ban Kaldır' : 'Banla'}>
                                <i className={`fa-solid ${u.role === 'banned' ? 'fa-unlock' : 'fa-ban'}`}></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── YORUM YÖNETİMİ ── */}
          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {allComments.length === 0 ? (
                <div style={{ color: '#555', textAlign: 'center', padding: '40px' }}>Yorum bulunamadı.</div>
              ) : allComments.map(c => (
                <div key={c.id} style={{ background: 'rgba(20,20,20,0.6)', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 800, color: '#fff' }}>{c.author_name}</span>
                      <span style={{ background: ROLE_COLORS[c.role] || '#333', color: '#fff', fontSize: '9px', padding: '2px 8px', borderRadius: '50px' }}>{c.role}</span>
                      <span style={{ color: '#444', fontSize: '11px' }}>{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 15px 0', lineHeight: 1.6 }}>{c.content}</p>
                    <a href={`/post/${c.post_id}`} target="_blank" rel="noreferrer" style={{ color: '#e60000', fontSize: '11px', textDecoration: 'none', fontWeight: 700 }}>
                      İlgili Yazıya Git <i className="fa-solid fa-arrow-right" style={{ marginLeft: '5px' }}></i>
                    </a>
                  </div>
                  <button onClick={() => handleDeleteComment(c.id, c.content, c.author_name)} disabled={actionLoading === c.id}
                    style={{ background: 'rgba(230,0,0,0.1)', color: '#e60000', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer' }}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── AKTİVİTE LOGLARI ── */}
          {activeTab === 'logs' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={logFilter} onChange={e => setLogFilter(e.target.value)}
                  style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', color: '#fff', padding: '10px 15px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
                  <option value="all">Tüm Loglar</option>
                  {Object.keys(LOG_LABELS).map(k => <option key={k} value={k}>{LOG_LABELS[k as LogAction].label}</option>)}
                </select>
                <button onClick={fetchLogs} style={{ background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid #1e1e1e', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-rotate"></i> Yenile
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredLogs.map(log => {
                  const meta = LOG_LABELS[log.action as LogAction] || { label: log.action, color: '#555', icon: 'fa-circle' };
                  return (
                    <div key={log.id} style={{ background: 'rgba(10,10,10,0.4)', border: '1px solid #1a1a1a', borderLeft: `4px solid ${meta.color}`, borderRadius: '8px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ background: meta.color + '20', color: meta.color, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`fa-solid ${meta.icon}`} style={{ fontSize: '16px' }}></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{meta.label}</span>
                          <span style={{ color: '#444', fontSize: '11px' }}>{new Date(log.created_at).toLocaleString('tr-TR')}</span>
                        </div>
                        <p style={{ color: '#666', fontSize: '13px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.target_name ? <strong>{log.target_name}: </strong> : ''}
                          {log.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        body {
          background-color: #050505;
        }
      `}</style>
    </div>
  );
}

