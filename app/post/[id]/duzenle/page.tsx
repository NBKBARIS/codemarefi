'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { updatePost } from '../../../lib/userPosts';
import { hasBadWords } from '../../../lib/badWords';
import CommentEditor from '../../../components/CommentEditor';

const CATEGORIES = [
  { group: 'Discord', options: ['Discord-bot-kodları','Discord-bot-konuları','Discord-Konuları','Discord-Hazır-Bot-Altyapılar'] },
  { group: 'Programlama', options: ['JavaScript','Python','CSS','Html','Blogger-Konuları'] },
  { group: 'Tasarım & Web', options: ['Web-Tasarım','UI-UX'] },
  { group: 'Diğer', options: ['Genel Konular','Tavsiyemiz','Popüler','Yazılım-Haberleri','Siber-Güvenlik','Yapay-Zeka'] },
];

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function load() {
      const postId = Array.isArray(id) ? id[0] : id;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }

      const { data: postData } = await supabase
        .from('user_posts')
        .select('*, profiles(full_name)')
        .eq('id', postId)
        .single();

      if (!postData) { router.push('/'); return; }

      // Sadece yazar veya admin/mod düzenleyebilir
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      const isOwner = postData.author_id === session.user.id;
      const isAdmin = prof?.role === 'admin' || prof?.role === 'mod';

      if (!isOwner && !isAdmin) { router.push('/'); return; }

      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
      setCategory(postData.categories?.[0] || 'Genel Konular');
      setAuthorized(true);
      setLoading(false);
    }
    load();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    if (hasBadWords(title) || hasBadWords(content)) {
      setMessage({ type: 'error', text: 'İçeriğinizde uygunsuz kelimeler tespit edildi.' });
      return;
    }

    const plainContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainContent.split(/\s+/).filter(Boolean).length;

    if (title.trim().length < 20) {
      setMessage({ type: 'error', text: 'Başlık en az 20 karakter olmalıdır.' });
      return;
    }
    if (wordCount < 100) {
      setMessage({ type: 'error', text: `İçerik çok kısa! En az 100 kelime gerekli. Şu an: ${wordCount} kelime.` });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updatePost(post.id, { title: title.trim(), content, categories: [category] });
      setMessage({ type: 'success', text: 'Gönderi güncellendi! Yönetici onayından sonra tekrar yayına girecektir.' });
      setTimeout(() => router.push('/'), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Hata: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fa-solid fa-spinner fa-spin fa-3x" style={{ color: '#e60000' }}></i>
    </div>
  );

  if (!authorized) return null;

  const wordCount = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '30px', borderRadius: '8px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <i className="fa-solid fa-pen-to-square" style={{ color: '#e60000' }}></i>
              Gönderiyi Düzenle
            </h1>
            <div style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid #ff8c00', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', color: '#ff8c00', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              Düzenleme sonrası tekrar onay gerekir
            </div>
          </div>

          {message.text && (
            <div style={{ padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', background: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)', border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`, color: message.type === 'error' ? '#e60000' : '#2ea44f' }}>
              <i className={`fa-solid ${message.type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}`} style={{ marginRight: '8px' }}></i>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Başlık */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
                Yazı Başlığı
                <span style={{ float: 'right', fontSize: '11px', color: title.length >= 20 && title.length <= 70 ? '#2ea44f' : '#e60000' }}>
                  {title.length}/70 {title.length < 20 ? '(min 20)' : title.length > 70 ? '(max 70)' : '✓'}
                </span>
              </label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${title.length >= 20 && title.length <= 70 ? '#2ea44f' : title.length > 0 ? '#e60000' : '#333'}`, padding: '12px', color: '#fff', borderRadius: '4px', outline: 'none' }} />
            </div>

            {/* Kategori */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '4px', outline: 'none' }}>
                {CATEGORIES.map(g => (
                  <optgroup key={g.group} label={g.group}>
                    {g.options.map(o => <option key={o} value={o}>{o.replace(/-/g, ' ')}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* İçerik */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
                İçerik
                <span style={{ float: 'right', fontSize: '11px', color: wordCount >= 100 ? '#2ea44f' : '#e60000' }}>
                  {wordCount} kelime {wordCount < 100 ? `(min 100)` : '✓'}
                </span>
              </label>
              <CommentEditor
                value={content}
                onChange={setContent}
                placeholder="İçeriğinizi buraya yazın... Araç çubuğuyla biçimlendirebilirsiniz."
                disabled={saving}
                rows={12}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => router.back()}
                style={{ flex: 1, background: '#1a1a1a', color: '#666', border: '1px solid #333', padding: '14px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>
                Vazgeç
              </button>
              <button type="submit" disabled={saving}
                style={{ flex: 2, background: '#e60000', color: '#fff', border: 'none', padding: '14px', borderRadius: '4px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
