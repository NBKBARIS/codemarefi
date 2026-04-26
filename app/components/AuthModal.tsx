'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Giriş başarılı! Yönlendiriliyorsunuz...' });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Kayıt başarılı! Giriş yapabilirsiniz.' });
        setIsLogin(true);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(5px)'
    }} onClick={onClose}>
      <div 
        style={{
          width: '90%',
          maxWidth: '400px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '12px',
          padding: '30px',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px', right: '15px',
            background: 'none', border: 'none',
            color: '#8b949e', cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 style={{ color: '#fff', marginBottom: '25px', textAlign: 'center', fontSize: '24px' }}>
          {isLogin ? 'Hoş Geldin' : 'Aramıza Katıl'}
        </h2>

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#8b949e', marginBottom: '5px', fontSize: '14px' }}>Ad Soyad</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#8b949e', marginBottom: '5px', fontSize: '14px' }}>E-posta</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                background: '#0d1117',
                border: '1px solid #30363d',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#8b949e', marginBottom: '5px', fontSize: '14px' }}>Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                background: '#0d1117',
                border: '1px solid #30363d',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {message.text && (
            <div style={{
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center',
              backgroundColor: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)',
              color: message.type === 'error' ? '#e60000' : '#2ea44f',
              border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`
            }}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '6px',
              background: '#238636',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'İşlem yapılıyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#8b949e', fontSize: '14px' }}>
          {isLogin ? 'Hesabın yok mu?' : 'Zaten üye misin?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none', border: 'none',
              color: '#58a6ff', cursor: 'pointer',
              marginLeft: '5px', fontWeight: 'bold'
            }}
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
}
