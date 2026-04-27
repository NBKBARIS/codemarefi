'use client';
import { useState, useEffect } from 'react';
import { supabase, CommentType, CommentRole } from '../lib/supabase';

function formatCommentDate(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString('tr-TR', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} ${year} ${time}`;
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
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

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

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
      is_approved: true
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

  const CommentNode = ({ comment, isReply = false }: { comment: CommentType, isReply?: boolean }) => {
    const isAdmin = comment.role === 'admin';
    const isMember = comment.role === 'member';

    return (
      <div style={{ marginBottom: '15px', marginLeft: isReply ? '45px' : '0' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flexShrink: 0 }}>
             {comment.avatar_url ? (
                <img src={comment.avatar_url} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', border: isAdmin ? '2px solid #e60000' : '1px solid #333', objectFit: 'cover' }} />
             ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '24px', border: isMember ? '1px solid #00d2ff' : 'none' }}>
                   <i className="fa-solid fa-user"></i>
                </div>
             )}
          </div>

          <div style={{ flexGrow: 1 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span 
                  title={isAdmin ? 'Sistem Yöneticisi' : (isMember ? 'Onaylı Üye' : 'Ziyaretçi')}
                  style={{ fontWeight: 'bold', fontSize: '14px', color: isAdmin ? '#e60000' : (isMember ? '#00d2ff' : '#ddd'), cursor: 'default' }}
                >
                  {comment.author_name}
                </span>

                {isAdmin && (
                  <span title="Yönetici" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }}>
                    <span style={{ background: '#e60000', color: 'white', fontSize: '10px', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold' }}>Yönetici</span>
                    <i className="fa-solid fa-crown" style={{ color: '#ffd700', fontSize: '12px' }}></i>
                  </span>
                )}
                {isMember && (
                  <span title="Üye" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }}>
                    <img 
                      src="https://cdn3.emoji.gg/emojis/9440-verified.png" 
                      alt="Üye" 
                      style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const next = e.currentTarget.nextElementSibling as HTMLElement;
                        if (next) next.style.display = 'inline-block';
                      }}
                    />
                    <i className="fa-solid fa-circle-check" style={{ color: '#00d2ff', fontSize: '12px', display: 'none' }}></i>
                  </span>
                )}

                <span style={{ color: '#666', fontSize: '12px' }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i> {formatCommentDate(comment.created_at)}
                </span>
             </div>

             <div style={{ color: '#bbb', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px', wordBreak: 'break-word' }}>
                {comment.content}
             </div>

             <button onClick={() => setReplyingTo(comment.id)} style={{ background: 'transparent', border: 'none', color: '#e60000', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
               Yanıtla <i className="fa-solid fa-reply"></i>
             </button>

             {comment.replies && comment.replies.length > 0 && (
               <div style={{ marginTop: '15px', borderLeft: '2px solid #333', paddingTop: '10px' }}>
                 {comment.replies.map(reply => (
                    <CommentNode key={reply.id} comment={reply} isReply={true} />
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    );
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
            <CommentNode key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
