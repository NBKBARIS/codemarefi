'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase, CommentType, CommentRole } from '../lib/supabase';

// Helper to format date like "22 Ağustos 2021 18:21"
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
  
  // Form states
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, payload => {
        fetchComments(); // Re-fetch on any change for simplicity, or update state optimistically
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
    // Simple logic to detect if user wants to post as Admin/Member based on a secret name/code 
    // In a real app, this is done via Auth. We'll simulate it for the UI.
    let role: CommentRole = 'guest';
    if (authorName.trim().toLowerCase() === 'nbk barış' || authorName.trim().toLowerCase() === 'admin') {
      role = 'admin';
    } else if (authorName.trim().toLowerCase() === 'üye' || authorName.trim().toLowerCase() === 'member') {
      role = 'member';
    }

    const newComment = {
      post_id: postId,
      parent_id: replyingTo,
      author_name: role === 'admin' ? 'NBK BARIŞ' : authorName.trim(),
      content: content.trim(),
      role: role,
      // Fake URLs for demonstration until real ones are provided
      avatar_url: role === 'admin' ? '/admin-avatar.png' : null, 
      is_approved: true // Auto-approve for now
    };

    const { error } = await supabase.from('comments').insert(newComment);
    
    if (error) {
      console.error('Error posting comment:', error);
      alert('Yorum gönderilirken bir hata oluştu.');
    } else {
      setContent('');
      if(role !== 'admin') setAuthorName(''); // Keep admin name if they are testing
      setReplyingTo(null);
    }
    setIsSubmitting(false);
  }

  // --- Render Single Comment ---
  const CommentNode = ({ comment, isReply = false }: { comment: CommentType, isReply?: boolean }) => {
    const isAdmin = comment.role === 'admin';
    const isMember = comment.role === 'member';

    return (
      <div style={{ marginBottom: '15px', marginLeft: isReply ? '45px' : '0' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          
          {/* Avatar Area */}
          <div style={{ flexShrink: 0 }}>
             {isAdmin ? (
               <div style={{ position: 'relative' }}>
                  <img src="/admin-avatar.png" alt="Admin Avatar" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=NBK&background=5865F2&color=fff&size=48' }} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #e60000', objectFit: 'cover' }} />
                  {/* Decorative triangle/badge behind could be added here via CSS */}
               </div>
             ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '24px' }}>
                   <i className="fa-solid fa-user"></i>
                </div>
             )}
          </div>

          {/* Comment Body Area */}
          <div style={{ flexGrow: 1 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: isAdmin ? '#e60000' : '#ddd' }}>
                  {comment.author_name}
                </span>

                {/* Badges */}
                {isAdmin && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', position: 'relative' }} title="Yönetici">
                    <span style={{ background: '#e60000', color: 'white', fontSize: '10px', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Yönetici</span>
                    <i className="fa-solid fa-star" style={{ color: '#ffd700', fontSize: '12px' }}></i>
                    <i className="fa-solid fa-crown" style={{ color: '#ffd700', fontSize: '12px' }}></i>
                  </span>
                )}
                {isMember && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} title="Üye">
                    <i className="fa-solid fa-gem" style={{ color: '#00d2ff', fontSize: '12px' }}></i>
                    <i className="fa-solid fa-check" style={{ color: '#2ea44f', fontSize: '12px' }}></i>
                  </span>
                )}

                <span style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fa-regular fa-clock"></i> {formatCommentDate(comment.created_at)}
                </span>
             </div>

             <div style={{ color: '#bbb', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px', wordBreak: 'break-word' }}>
                {comment.content}
             </div>

             <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setReplyingTo(comment.id)} style={{ background: 'transparent', border: 'none', color: '#e60000', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                  Yanıtla <i className="fa-solid fa-reply"></i>
                </button>
             </div>

             {/* Nested Replies */}
             {comment.replies && comment.replies.length > 0 && (
               <div style={{ marginTop: '15px', borderLeft: '2px solid #333', paddingTop: '10px' }}>
                 {/* Optional: 'Yanıtlar' collapse/expand button could go here */}
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
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', background: '#1a1a1a', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
        <h4 style={{ color: '#ddd', marginTop: 0, marginBottom: '15px', fontSize: '14px' }}>
          {replyingTo ? 'Yanıtlama İptal Et' : 'Yorum Bırakın'}
          {replyingTo && (
             <button type="button" onClick={() => setReplyingTo(null)} style={{ marginLeft: '10px', background: 'transparent', border: 'none', color: '#e60000', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>
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
            style={{ flex: 1, padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '3px' }}
          />
        </div>
        <textarea 
          placeholder="Yorumunuzu buraya yazın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '3px', marginBottom: '10px', resize: 'vertical' }}
        />
        <button type="submit" disabled={isSubmitting} style={{ background: '#e60000', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '3px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>

      {/* Comments List */}
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
