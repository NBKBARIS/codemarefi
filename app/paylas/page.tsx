'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { submitUserPost } from '../lib/userPosts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

export default function PaylasPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Genel');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/');
        window.dispatchEvent(new CustomEvent('open-auth-modal'));
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Resim boyut kontrolü (opsiyonel ama tasarım için iyi)
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 800 || img.height < 450) {
          setMessage({ type: 'error', text: 'Resim boyutu çok küçük! En az 800x450 piksel olmalı.' });
          setImage(null);
          setImagePreview(null);
        } else {
          setImage(file);
          setImagePreview(URL.createObjectURL(file));
          setMessage({ type: '', text: '' });
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!image) {
      setMessage({ type: 'error', text: 'Lütfen bir öne çıkan görsel yükleyin!' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Yazınız gönderiliyor, lütfen bekleyin...' });

    try {
      // 1. Resmi Storage'a Yükle
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-thumbnails')
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-thumbnails')
        .getPublicUrl(filePath);

      // 2. Yazıyı Veritabanına Kaydet
      await submitUserPost({
        title,
        content,
        thumbnail_url: publicUrl,
        author_id: user.id,
        categories: [category]
      });

      setMessage({ type: 'success', text: 'Yazınız başarıyla gönderildi! Yönetici onayından sonra yayına girecektir.' });
      
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error: any) {
      setMessage({ type: 'error', text: 'Bir hata oluştu: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main style={{ background: '#050505', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '30px', borderRadius: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-pen-to-square" style={{ color: '#e60000' }}></i>
            Yeni Yazı Paylaş
          </h1>

          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              marginBottom: '20px',
              fontSize: '14px',
              background: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)',
              border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`,
              color: message.type === 'error' ? '#e60000' : '#2ea44f'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Resim Yükleme */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>Öne Çıkan Görsel (Zorunlu - Min 800x450)</label>
              <div 
                onClick={() => document.getElementById('file-input')?.click()}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  border: '2px dashed #333', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: '#0a0a0a',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e60000')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#555' }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '30px', marginBottom: '10px' }}></i>
                    <p style={{ fontSize: '12px' }}>Tıkla ve Görsel Seç</p>
                  </div>
                )}
              </div>
              <input id="file-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>

            {/* Başlık */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>Yazı Başlığı</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Örn: Discord Bot Yapımı 2026"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            {/* Kategori */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>Kategori</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '4px', outline: 'none' }}
              >
                <option value="Discord-bot-kodları">Discord Bot Kodları</option>
                <option value="Web-Tasarım">Web Tasarım</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Genel">Genel</option>
              </select>
            </div>

            {/* İçerik */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>İçerik (HTML Kullanabilirsiniz)</label>
              <textarea 
                required
                rows={10}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Yazınızı buraya yazın..."
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '4px', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: '#e60000',
                color: '#fff',
                border: 'none',
                padding: '15px',
                borderRadius: '4px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                marginTop: '10px'
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#cc0000')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#e60000')}
            >
              {loading ? 'Gönderiliyor...' : 'Yazıyı Onaya Gönder'}
            </button>
          </form>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        input:focus, textarea:focus, select:focus {
          border-color: #e60000 !important;
        }
      `}</style>
    </main>
  );
}
