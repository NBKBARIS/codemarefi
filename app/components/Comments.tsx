'use client';
import { useState, useEffect } from 'react';
import { supabase, CommentType, CommentRole } from '../lib/supabase';
import { hasBadWords } from '../lib/badWords';
import Link from 'next/link';

// Top 3 yorum yapan kullanıcıları çek (global cache)
let cachedTopCommenters: string[] = [];
let cacheTime = 0;

async function getTopCommenters(): Promise<string[]> {
  if (Date.now() - cacheTime < 5 * 60 * 1000) return cachedTopCommenters;
  const { data } = await supabase
    .from('comments')
    .select('user_id')
    .not('user_id', 'is', null);
  if (!data) return [];
  const counts: Record<string, number> = {};
  data.forEach((r: any) => { if (r.user_id) counts[r.user_id] = (counts[r.user_id] || 0) + 1; });
  cachedTopCommenters = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
  cacheTime = Date.now();
  return cachedTopCommenters;
}

const TOP3_BADGES = [
  { icon: 'fa-medal', label: '1. SIRA', color: '#FFD700', bg: 'rgba(255,215,0,0.12)', glow: '0 0 8px rgba(255,215,0,0.5)' },
  { icon: 'fa-medal', label: '2. SIRA', color: '#C0C0C0', bg: 'rgba(192,192,192,0.10)', glow: '0 0 8px rgba(192,192,192,0.4)' },
  { icon: 'fa-medal', label: '3. SIRA', color: '#CD7F32', bg: 'rgba(205,127,50,0.10)', glow: '0 0 8px rgba(205,127,50,0.4)' },
];

function formatCommentDate(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString('tr-TR', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} ${year} ${time}`;
}

function buildTree(flatComments: CommentType[]) {
  const map = new Map<string, CommentType>();
  const roots: CommentType[] = [];
  flatComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
  flatComments.forEach(c => {
    if (c.parent_id) {
      const parent = map.get(c.parent_id);
      if (parent) parent.replies!.push(map.get(c.id)!);
    } else {
      roots.push(map.get(c.id)!);
    }
  });
  return roots;
}

const CommentNode = ({ 
  comment, 
  isReply = false, 
  authorName, 
  editingId, 
  setEditingId, 
  editContent, 
  setEditContent, 
  handleUpdate, 
  handleDelete, 
  setReplyingTo,
  profile,
  topCommenters,
}: { 
  comment: CommentType, 
  isReply?: boolean,
  authorName: string,
  editingId: string | null,
  setEditingId: (id: string | null) => void,
  editContent: string,
  setEditContent: (val: string) => void,
  handleUpdate: (id: string) => void,
  handleDelete: (id: string) => void,
  setReplyingTo: (id: string | null) => void,
  profile: any,
  topCommenters: string[],
}) => {
  const isAdminAuthor = comment.role === 'admin';
  const isModAuthor = comment.role === 'mod';
  const isAuthorRank = comment.role === 'author';
  const isMemberAuthor = comment.role === 'member' || (!isAdminAuthor && !isModAuthor && !isAuthorRank && comment.role !== 'guest');
  const isEditing = editingId === comment.id;
  const isGlobalAdmin = profile?.role === 'admin';

  // Leaderboard sırası
  const topRank = comment.user_id ? topCommenters.indexOf(comment.user_id) : -1;
  const topBadge = topRank >= 0 ? TOP3_BADGES[topRank] : null;

  return (
    <div style={{ marginBottom: '15px', marginLeft: isReply ? '45px' : '0' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flexShrink: 0 }}>
        <Link 
          href={comment.user_id ? `/user/${comment.user_id}` : '#'} 
          style={{ 
            cursor: comment.user_id ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            display: 'flex',
            alignItems: 'flex-start'
          }}
          onMouseEnter={(e) => comment.user_id && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => comment.user_id && (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img 
            src={comment.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
            alt={comment.author_name} 
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isAdminAuthor ? '#e60000' : (isModAuthor ? '#2ea44f' : (isAuthorRank ? '#ff8c00' : (isMemberAuthor ? '#666' : '#333')))}` }} 
          />
        </Link>
        </div>

        <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <Link 
                href={comment.user_id ? `/user/${comment.user_id}` : '#'}
                style={{ 
                  fontWeight: 'bold', 
                  fontSize: '14px', 
                  color: isAdminAuthor ? '#e60000' : (isModAuthor ? '#2ea44f' : (isAuthorRank ? '#ff8c00' : (isMemberAuthor ? '#f1f1f1' : '#aaa'))), 
                  cursor: comment.user_id ? 'pointer' : 'default',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => comment.user_id && (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => comment.user_id && (e.currentTarget.style.color = isAdminAuthor ? '#e60000' : (isModAuthor ? '#2ea44f' : (isAuthorRank ? '#ff8c00' : (isMemberAuthor ? '#f1f1f1' : '#aaa'))))}
              >
                {comment.author_name}
              </Link>

              {isAdminAuthor && (
                <span style={{ background: '#e60000', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '2px' }}>
                  Yönetici
                </span>
              )}
              {isModAuthor && (
                <span style={{ background: '#2ea44f', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '2px' }}>
                  Moderatör
                </span>
              )}
              {isAuthorRank && (
                <span style={{ background: '#ff8c00', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '2px' }}>
                  Yazar
                </span>
              )}
              {isMemberAuthor && (
                <span style={{ background: '#007bff', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '2px' }}>
                  Üye
                </span>
              )}
              {/* Leaderboard rozeti */}
              {topBadge && (
                <span style={{
                  background: topBadge.bg,
                  color: topBadge.color,
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontWeight: 900,
                  border: `1px solid ${topBadge.color}`,
                  marginLeft: '2px',
                  letterSpacing: '0.3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: topBadge.glow,
                }}>
                  <i className={`fa-solid ${topBadge.icon}`} style={{ fontSize: '11px', filter: `drop-shadow(${topBadge.glow})` }}></i>
                  {topBadge.label}
                </span>
              )}

              <span style={{ color: '#666', fontSize: '12px' }}>
                <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i> {formatCommentDate(comment.created_at)}
              </span>
           </div>

           <div style={{ color: '#bbb', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px', wordBreak: 'break-word' }}>
              {isEditing ? (
                <div style={{ marginTop: '10px' }}>
                  <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleUpdate(comment.id)}
                      style={{ background: '#2ea44f', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Kaydet
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              ) : (
                comment.content
              )}
           </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px', padding: '5px 0' }}>
              {!isEditing && (
                <>
                  <button 
                    onClick={() => setReplyingTo(comment.id)} 
                    style={{ background: 'transparent', border: 'none', color: '#ff4d4d', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: '5px 0' }}
                  >
                    <i className="fa-solid fa-reply"></i> Yanıtla
                  </button>

                  {/* DÜZENLE - İsim tutuyorsa göster */}
                  {(comment.author_name === authorName) && (
                    <button 
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Düzenle
                    </button>
                  )}

                  {/* SİL - İsim tutuyorsa veya Adminse göster */}
                  {(isGlobalAdmin || comment.author_name === authorName) && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      style={{ background: 'none', border: 'none', color: '#aaaaaa', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fa-solid fa-trash-can"></i> Sil
                    </button>
                  )}
                </>
              )}
            </div>

           {comment.replies && comment.replies.length > 0 && (
             <div style={{ marginTop: '15px', borderLeft: '2px solid #333', paddingTop: '10px' }}>
               {comment.replies.map(reply => (
                  <CommentNode 
                    key={reply.id} 
                    comment={reply} 
                    isReply={true} 
                    authorName={authorName}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    setReplyingTo={setReplyingTo}
                    profile={profile}
                    topCommenters={topCommenters}
                  />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [topCommenters, setTopCommenters] = useState<string[]>([]);
  
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Top commenters yükle
    getTopCommenters().then(setTopCommenters);

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        console.log('Current User Profile Loaded:', data);
        setProfile(data);
        if (data?.full_name) setAuthorName(data.full_name);
      });
    }
  }, [user]);

  useEffect(() => {
    fetchComments();
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, payload => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else if (data) {
      setComments(buildTree(data as CommentType[]));
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;
    
    if (hasBadWords(content)) {
      alert('Yorumunuz topluluk kurallarına aykırı kelimeler (argo/küfür) içeriyor olabilir. Lütfen daha uygun bir dil kullanın.');
      return;
    }

    setIsSubmitting(true);
    let role: CommentRole = 'guest';
    let finalAvatar = null;

    if (user) {
      role = profile?.role || 'member';
      finalAvatar = profile?.avatar_url;
    } else if (authorName.trim().toLowerCase() === 'nbk barış' || authorName.trim().toLowerCase() === 'admin') {
      role = 'admin';
      finalAvatar = 'https://ui-avatars.com/api/?name=NBK&background=5865F2&color=fff&size=48';
    }

    const newComment = {
      post_id: postId,
      parent_id: replyingTo,
      author_name: authorName.trim(),
      content: content.trim(),
      role: role,
      avatar_url: finalAvatar,
      is_approved: true,
      user_id: user?.id || null // Giriş yapmışsa kimliğini kaydet
    };

    const { error } = await supabase.from('comments').insert(newComment);
    
    if (error) {
      console.error('Error posting comment:', error);
      alert('Yorum gönderilirken bir hata oluştu.');
    } else {
      setContent('');
      if (!user) setAuthorName('');
      setReplyingTo(null);
      fetchComments(); // Canlı yayın gelene kadar biz önden güncelleyelim
    }
    setIsSubmitting(false);
  }

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleDelete = async (commentId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      alert('Yorum silinirken bir hata oluştu.');
    } else {
      fetchComments();
    }
  };

  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) return;

    if (hasBadWords(editContent)) {
      alert('Yorumunuz topluluk kurallarına aykırı kelimeler içeriyor.');
      return;
    }

    const { error } = await supabase
      .from('comments')
      .update({ content: editContent.trim() })
      .eq('id', commentId);

    if (error) {
      console.error('Error updating comment:', error);
      alert('Yorum güncellenirken bir hata oluştu.');
    } else {
      setEditingId(null);
      fetchComments();
    }
  };



  return (
    <div style={{ marginTop: '40px', borderTop: '2px solid #e60000', paddingTop: '20px' }}>
      <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        {comments.length} Yorum
      </h3>

      {/* Comment Form */}
      {user ? (
        profile?.full_name ? (
          <form onSubmit={handleSubmit} style={{ marginBottom: '30px', background: '#1a1a1a', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
            <h4 style={{ color: '#ddd', marginTop: 0, marginBottom: '15px', fontSize: '14px' }}>
              {replyingTo ? 'Yanıtlama İptal Et' : 'Yorum Bırakın'}
              {replyingTo && (
                <button type="button" onClick={() => setReplyingTo(null)} style={{ marginLeft: '10px', background: 'transparent', border: 'none', color: '#e60000', cursor: 'pointer', fontSize: '12px' }}>
                    İptal
                </button>
              )}
            </h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input 
                type="text" 
                placeholder="İsminiz..." 
                value={authorName} 
                onChange={(e) => setAuthorName(e.target.value)}
                required
                disabled={true}
                style={{ flex: 1, padding: '10px', background: '#111', border: '1px solid #444', color: '#888', borderRadius: '3px' }}
              />
            </div>
            <textarea 
              placeholder="Yorumunuzu buraya yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '3px', marginBottom: '10px' }}
            />
            <button type="submit" disabled={isSubmitting} style={{ background: '#e60000', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '3px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        ) : (
          <div style={{ 
            marginBottom: '30px', 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '4px', 
            border: '1px solid #e60000',
            textAlign: 'center'
          }}>
            <p style={{ color: '#fff', marginBottom: '15px' }}>Yorum yapabilmek için önce bir kullanıcı adı belirlemelisiniz.</p>
            <a 
              href="/profil" 
              style={{ 
                display: 'inline-block',
                background: '#e60000', 
                color: '#fff', 
                padding: '8px 20px', 
                borderRadius: '4px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Profil Ayarlarına Git
            </a>
          </div>
        )
      ) : (
        <div style={{ 
          marginBottom: '30px', 
          background: '#1a1a1a', 
          padding: '30px', 
          borderRadius: '4px', 
          border: '1px solid #333',
          textAlign: 'center',
          boxShadow: 'inset 0 0 10px rgba(230, 0, 0, 0.1)'
        }}>
          <i className="fa-solid fa-lock" style={{ color: '#e60000', fontSize: '28px', marginBottom: '15px' }}></i>
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>YORUM YAPMAK İÇİN SİSTEME SIZMANIZ GEREKİYOR</p>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Lütfen yukarıdaki butonu kullanarak giriş yapın veya kimlik oluşturun.</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
            style={{ 
              background: '#e60000', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 25px', 
              borderRadius: '4px', 
              fontWeight: '900',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center' }}>Yorumlar yükleniyor...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center' }}>Henüz yorum yapılmamış. İlk yorumu siz yapın!</div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentNode 
              key={comment.id} 
              comment={comment} 
              authorName={authorName}
              editingId={editingId}
              setEditingId={setEditingId}
              editContent={editContent}
              setEditContent={setEditContent}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              setReplyingTo={setReplyingTo}
              profile={profile}
              topCommenters={topCommenters}
            />
          ))}
        </div>
      )}
    </div>
  );
}
