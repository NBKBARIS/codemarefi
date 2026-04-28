'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        onClose();
      }
    });
    return () => subscription.unsubscribe();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
      setTimer(60);
      setCanResend(false);
      setMessage({ type: '', text: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };

    // Modal açıldığında Turnstile'ı zorla render et
    if (isOpen && !isLogin && step === 'form') {
      const timer = setTimeout(() => {
        if ((window as any).turnstile) {
          try {
            (window as any).turnstile.render('#turnstile-container', {
              sitekey: '0x4AAAAAADEeXvHTwYJ1TIX9',
              callback: (token: string) => {
                setTurnstileToken(token);
              },
              theme: 'dark'
            });
          } catch (e) {
            console.log('Turnstile already rendered');
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isLogin, step]);

  if (!isOpen) return null;

  const resendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: 'Kod gönderilemedi!' });
    } else {
      setTimer(60);
      setCanResend(false);
      setMessage({ type: 'success', text: 'Yeni kod gönderildi!' });
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'discord') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://www.codemarefi.com'
      }
    });
    if (error) {
      console.error('OAuth Error:', error);
      setMessage({ type: 'error', text: `Hata: ${error.message}` });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && step === 'form' && !turnstileToken) {
      setMessage({ type: 'error', text: 'Lütfen insan olduğunuzu doğrulayın!' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (step === 'form' && !isLogin) {
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        setMessage({ type: 'error', text: 'Yalnızca @gmail.com adresleri kabul edilmektedir!' });
        setLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
      if (!passwordRegex.test(password)) {
        setMessage({ type: 'error', text: 'Şifre en az 8 karakter, büyük-küçük harf, rakam ve sembol içermelidir!' });
        setLoading(false);
        return;
      }
    }

    try {
      if (step === 'form') {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          setMessage({ type: 'success', text: 'Sisteme Sızıldı! Giriş Yapılıyor...' });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1200);
        } else {
          // Kullanıcı adı benzersizlik kontrolü
          const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('full_name', fullName)
            .single();

          if (existingUser) {
            setMessage({ type: 'error', text: 'Bu kullanıcı adı zaten alınmış! Lütfen başka bir isim seçin.' });
            setLoading(false);
            return;
          }

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });
          if (error) throw error;
          
          if (data.user && data.session === null) {
            // Verification required
            setStep('verify');
            setTimer(60);
            setCanResend(false);
            setMessage({ type: 'success', text: 'Gmail adresine 6 haneli doğrulama kodu gönderildi!' });
          } else {
            setMessage({ type: 'success', text: 'Kayıt Başarılı! Protokoller Hazır.' });
            setTimeout(() => setIsLogin(true), 1500);
          }
        }
      } else {
        // Verification step
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: 'signup',
        });
        if (error) throw error;
        
        setMessage({ type: 'success', text: 'Kimlik Doğrulandı! Giriş yapabilirsiniz.' });
        setTimeout(() => {
          setIsLogin(true);
          setStep('form');
        }, 1500);
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg === 'Invalid login credentials') msg = 'E-posta veya şifre hatalı! Erişim reddedildi.';
      if (msg === 'User already registered') msg = 'Bu e-posta adresi zaten kayıtlı!';
      if (msg === 'Signup confirmed' || msg === 'Email not confirmed') msg = 'Lütfen önce e-postanızı doğrulayın!';
      if (msg === 'Token has expired') msg = 'Doğrulama kodunun süresi dolmuş!';
      if (msg === 'Invalid hex byte for token') msg = 'Geçersiz doğrulama kodu!';
      
      setMessage({ type: 'error', text: msg || 'Erişim Engellendi!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(10px)',
      padding: '20px'
    }}>
      
      {/* Background Animation (Scanlines) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        pointerEvents: 'none',
        zIndex: -1
      }}></div>

      <div 
        className="cyber-modal"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0a0a0a',
          border: '2px solid #e60000',
          borderRadius: '4px',
          padding: '40px 30px',
          position: 'relative',
          boxShadow: '0 0 20px rgba(230, 0, 0, 0.3), inset 0 0 10px rgba(230, 0, 0, 0.1)',
          overflow: 'hidden'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Animated Corner Decorations */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '4px solid #e60000', borderLeft: '4px solid #e60000' }}></div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '4px solid #e60000', borderRight: '4px solid #e60000' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '4px solid #e60000', borderLeft: '4px solid #e60000' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '4px solid #e60000', borderRight: '4px solid #e60000' }}></div>

        {/* Robot Animation Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/images/robot.svg" alt="Robot" style={{ width: '60px', height: '60px' }} />
        </div>

        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px', right: '15px',
            background: 'none', border: 'none',
            color: '#e60000', cursor: 'pointer',
            fontSize: '24px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(90deg)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(0deg)')}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 style={{ 
          color: '#fff', 
          marginBottom: '30px', 
          textAlign: 'center', 
          fontSize: '26px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          textShadow: '2px 2px #e60000'
        }}>
          {step === 'verify' ? 'DOĞRULAMA' : (isLogin ? 'ERİŞİM ONAYLANDI' : 'KİMLİK OLUŞTUR')}
        </h2>

        <form onSubmit={handleAuth}>
          {step === 'form' ? (
            <>
              {!isLogin && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ KULLANICI ADI ]</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="Hacker Adı / Nick"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#111',
                      border: '1px solid #333',
                      borderLeft: '4px solid #e60000',
                      color: '#fff',
                      outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ E-POSTA ]</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="user@codemarefi.com"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#111',
                    border: '1px solid #333',
                    borderLeft: '4px solid #e60000',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ ŞİFRE ]</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#111',
                    border: '1px solid #333',
                    borderLeft: '4px solid #e60000',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {!isLogin && (
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', minHeight: '65px' }}>
                  <div id="turnstile-container"></div>
                </div>
              )}
            </>
          ) : (
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ DOĞRULAMA KODU ]</label>
              <input 
                type="text" 
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                required
                placeholder="6 Haneli Kod"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#111',
                  border: '1px solid #e60000',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '8px'
                }}
              />
              <p style={{ color: '#888', fontSize: '11px', marginTop: '10px', textAlign: 'center' }}>
                {email} adresine gelen kodu buraya girin.
              </p>
              
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                {canResend ? (
                  <button 
                    type="button" 
                    onClick={resendOtp}
                    style={{ background: 'none', border: 'none', color: '#e60000', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    Kodu Tekrar Gönder
                  </button>
                ) : (
                  <p style={{ color: '#e60000', fontSize: '12px', fontFamily: 'monospace' }}>
                    YENİ KOD İÇİN: {timer}s
                  </p>
                )}
              </div>
            </div>
          )}

          {message.text && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              textAlign: 'center',
              backgroundColor: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)',
              color: message.type === 'error' ? '#e60000' : '#2ea44f',
              border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`,
              fontFamily: 'monospace',
              textTransform: 'uppercase'
            }}>
              {message.type === 'error' && <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>}
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="cyber-button"
            style={{
              width: '100%',
              padding: '16px',
              background: '#e60000',
              color: '#fff',
              border: 'none',
              fontWeight: '900',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 4px 15px rgba(230, 0, 0, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'YÜKLENİYOR...' : (step === 'verify' ? 'DOĞRULA' : (isLogin ? 'BAĞLAN' : 'KAYIT OL'))}
          </button>

          {step === 'form' && isLogin && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
                <span style={{ padding: '0 10px' }}>veya</span>
                <div style={{ flex: 1, height: '1px', background: '#222' }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  style={{
                    padding: '12px',
                    background: '#111',
                    border: '1px solid #4285F4',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#4285F4')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#111')}
                >
                  <i className="fa-brands fa-google"></i> Google
                </button>
                <button 
                  type="button"
                  onClick={() => handleOAuthLogin('discord')}
                  style={{
                    padding: '12px',
                    background: '#111',
                    border: '1px solid #5865F2',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#5865F2')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#111')}
                >
                  <i className="fa-brands fa-discord"></i> Discord
                </button>
              </div>
            </>
          )}
          
          {step === 'verify' && (
            <button 
              type="button"
              onClick={() => setStep('form')}
              style={{
                width: '100%',
                marginTop: '10px',
                background: 'transparent',
                border: 'none',
                color: '#888',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Geri Dön
            </button>
          )}
        </form>

        {step === 'form' && (
          <p style={{ textAlign: 'center', marginTop: '25px', color: '#888', fontSize: '13px', fontFamily: 'monospace' }}>
            {isLogin ? '// HESABIN YOK MU?' : '// ZATEN KAYITLI MISIN?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none', border: 'none',
                color: '#fff', cursor: 'pointer',
                marginLeft: '8px', fontWeight: 'bold',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'HESAP_OLUŞTUR' : 'GİRİŞ_YAP'}
            </button>
          </p>
        )}
      </div>

      <style>{`
        .cyber-modal {
          animation: glitch-border 2s infinite;
        }
        @keyframes glitch-border {
          0%, 100% { border-color: #e60000; box-shadow: 0 0 20px rgba(230, 0, 0, 0.3); }
          50% { border-color: #ff4d4d; box-shadow: 0 0 30px rgba(255, 77, 77, 0.5); }
        }
        .cyber-button:hover {
          background: #fff !important;
          color: #e60000 !important;
          box-shadow: 0 0 30px #fff !important;
        }
      `}</style>
    </div>
  );
}
