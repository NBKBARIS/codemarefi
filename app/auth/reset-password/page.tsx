'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase session'ı hash'ten al
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      } else {
        setMessage({ type: 'error', text: 'Geçersiz veya süresi dolmuş link. Lütfen tekrar şifre sıfırlama isteği gönderin.' });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Şifre en az 8 karakter olmalıdır!' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage({ type: 'error', text: 'Şifre en az 8 karakter, büyük-küçük harf, rakam ve sembol içermelidir!' });
      return;
    }

    if (password !== confirm) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi! Ana sayfaya yönlendiriliyorsunuz...' });
      setTimeout(() => router.push('/'), 2500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Bir hata oluştu!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0a0a0a',
        border: '2px solid #e60000',
        borderRadius: '8px',
        padding: '40px 30px',
        position: 'relative',
        boxShadow: '0 0 30px rgba(230,0,0,0.2)',
      }}>
        {/* Köşe süslemeleri */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: '3px solid #e60000', borderLeft: '3px solid #e60000' }}></div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: '3px solid #e60000', borderRight: '3px solid #e60000' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: '3px solid #e60000', borderLeft: '3px solid #e60000' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: '3px solid #e60000', borderRight: '3px solid #e60000' }}></div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <i className="fa-solid fa-lock-open" style={{ fontSize: '40px', color: '#e60000', marginBottom: '12px', display: 'block' }}></i>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', textShadow: '1px 1px #e60000' }}>
            YENİ ŞİFRE BELİRLE
          </h1>
          <div style={{ width: '40px', height: '2px', background: '#e60000', margin: '10px auto 0' }}></div>
        </div>

        {!ready && message.text && (
          <div style={{ padding: '14px', borderRadius: '4px', background: 'rgba(230,0,0,0.1)', border: '1px solid #e60000', color: '#e60000', fontSize: '13px', textAlign: 'center', fontFamily: 'monospace' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
            {message.text}
          </div>
        )}

        {ready && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ YENİ ŞİFRE ]</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="En az 8 karakter..."
                style={{ width: '100%', padding: '12px 15px', background: '#111', border: '1px solid #333', borderLeft: '4px solid #e60000', color: '#fff', outline: 'none', fontFamily: 'monospace', borderRadius: '2px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ ŞİFRE TEKRAR ]</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Şifreyi tekrar girin..."
                style={{ width: '100%', padding: '12px 15px', background: '#111', border: '1px solid #333', borderLeft: '4px solid #e60000', color: '#fff', outline: 'none', fontFamily: 'monospace', borderRadius: '2px' }}
              />
            </div>

            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '10px 14px', fontSize: '11px', color: '#666' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#e60000', marginRight: '6px' }}></i>
              Büyük harf, küçük harf, rakam ve sembol içermeli (@$!%*?&._-)
            </div>

            {message.text && (
              <div style={{ padding: '12px', borderRadius: '4px', background: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)', border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`, color: message.type === 'error' ? '#e60000' : '#2ea44f', fontSize: '13px', textAlign: 'center', fontFamily: 'monospace' }}>
                <i className={`fa-solid ${message.type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}`} style={{ marginRight: '8px' }}></i>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#e60000', color: '#fff', border: 'none', fontWeight: 900, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '2px', textTransform: 'uppercase', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
