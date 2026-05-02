'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { hasBadWords, hasUsernameViolation } from '../lib/badWords';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'form' | 'verify' | 'forgot' | 'forgot-sent'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(120);
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
      setTimer(120);
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
              sitekey: '0x4AAAAAADH11kJWsUlNZkDX',
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
      setTimer(120);
      setCanResend(false);
      setMessage({ type: 'success', text: 'Yeni kod gönderildi!' });
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'discord') => {
    const origin = typeof window !== 'undefined'
      ? window.location.origin.replace('http://', 'https://')
      : 'https://www.codemarefi.com.tr';

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
        scopes: provider === 'discord' ? 'identify email' : undefined,
      }
    });
    if (error) {
      setMessage({ type: 'error', text: `Hata: ${error.message}` });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Lütfen e-posta adresinizi girin!' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const origin = typeof window !== 'undefined'
        ? window.location.origin.replace('http://', 'https://')
        : 'https://www.codemarefi.com.tr';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback`,
      });

      if (error) throw error;

      setStep('forgot-sent');
      setMessage({ type: 'success', text: 'Şifre sıfırlama linki e-postanıza gönderildi!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Bir hata oluştu!' });
    } finally {
      setLoading(false);
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
      // Geçerli email formatı kontrolü (herhangi bir domain kabul et)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage({ type: 'error', text: 'Geçerli bir e-posta adresi girin!' });
        setLoading(false);
        return;
      }

      // Şifre kontrolü - daha esnek regex
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSymbol = /[@$!%*?&._\-#^(){}[\]:;"'<>,/\\|`~+=]/.test(password);
      const isLongEnough = password.length >= 8;

      if (!isLongEnough || !hasLowerCase || !hasUpperCase || !hasNumber || !hasSymbol) {
        setMessage({ type: 'error', text: 'Şifre en az 8 karakter, büyük-küçük harf, rakam ve sembol içermelidir!' });
        setLoading(false);
        return;
      }

      // E-posta ve kullanıcı adı benzerlik kontrolü
      const emailUsername = email.split('@')[0].toLowerCase();
      const username = fullName.toLowerCase();
      
      // Tam eşleşme kontrolü
      if (emailUsername === username) {
        setMessage({ type: 'error', text: 'Kullanıcı adı e-posta adresinizle aynı olamaz!' });
        setLoading(false);
        return;
      }
      
      // 4+ karakter ardışık benzerlik kontrolü (daha esnek)
      let hasSimilarity = false;
      for (let i = 0; i < emailUsername.length - 3; i++) {
        const substring = emailUsername.substring(i, i + 4);
        if (username.includes(substring)) {
          hasSimilarity = true;
          break;
        }
      }
      
      if (hasSimilarity) {
        setMessage({ type: 'error', text: 'Kullanıcı adı e-posta adresinizle çok benzer! Farklı bir kullanıcı adı seçin.' });
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
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('full_name', fullName)
            .single();

          if (existingUser) {
            setMessage({ type: 'error', text: 'Bu kullanıcı adı zaten alınmış! Lütfen başka bir isim seçin.' });
            setLoading(false);
            return;
          }

          // Kullanıcı adı kötü kelime / yasaklı isim kontrolü
          if (hasUsernameViolation(fullName)) {
            setMessage({ type: 'error', text: 'Bu kullanıcı adı uygunsuz veya yasaklı kelimeler içeriyor. Lütfen başka bir isim seçin.' });
            setLoading(false);
            return;
          }

          // IP rate limit kontrolü
          const ipCheckRes = await fetch('/api/check-ip-limit', { method: 'POST' });
          const ipCheckData = await ipCheckRes.json();
          if (!ipCheckData.allowed) {
            setMessage({ type: 'error', text: ipCheckData.error || 'Günlük kayıt limitine ulaştınız!' });
            setLoading(false);
            return;
          }

          // Server-side Turnstile doğrulaması
          const verifyRes = await fetch('/api/verify-turnstile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: turnstileToken }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyData.success) {
            setMessage({ type: 'error', text: 'Bot doğrulaması başarısız! Lütfen tekrar deneyin.' });
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
            setTimer(120);
            setCanResend(false);
            setMessage({ type: 'success', text: 'E-posta adresine doğrulama kodu gönderildi!' });
            
            // Discord webhook'a bildirim gönder
            try {
              await fetch('https://discord.com/api/webhooks/1499138592864338010/TEAeJ2HQh-YXx1M1ZvTvj6gsIAo_GlTQjLrczj266YeFIhnRv3rCdHOj1zHo6aKe4Wth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  embeds: [{
                    color: 0x2ea44f,
                    title: '📝 Yeni Kayıt!',
                    description: `Yeni bir kullanıcı siteye kayıt oldu!`,
                    fields: [
                      { name: 'Kullanıcı Adı', value: fullName, inline: true },
                      { name: 'E-posta', value: email, inline: true },
                      { name: 'Durum', value: '⏳ E-posta doğrulama bekliyor', inline: false }
                    ],
                    footer: { text: 'CodeMareFi' },
                    timestamp: new Date().toISOString()
                  }]
                })
              });
            } catch (webhookError) {
              console.error('Discord webhook hatası:', webhookError);
            }
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
        
        // Discord webhook'a doğrulama bildirimi gönder
        try {
          await fetch('https://discord.com/api/webhooks/1499138592864338010/TEAeJ2HQh-YXx1M1ZvTvj6gsIAo_GlTQjLrczj266YeFIhnRv3rCdHOj1zHo6aKe4Wth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                color: 0x2ea44f,
                title: '✅ E-posta Doğrulandı!',
                description: `Yeni kullanıcı e-postasını doğruladı ve kayıt tamamlandı!`,
                fields: [
                  { name: 'Kullanıcı Adı', value: fullName, inline: true },
                  { name: 'E-posta', value: email, inline: true },
                  { name: 'Durum', value: '✅ Kayıt tamamlandı', inline: false }
                ],
                footer: { text: 'CodeMareFi' },
                timestamp: new Date().toISOString()
              }]
            })
          });
        } catch (webhookError) {
          console.error('Discord webhook hatası:', webhookError);
        }
        
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
          <Image src="/images/robot.svg" alt="Robot" width={60} height={60} />
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
          {step === 'verify' ? 'DOĞRULAMA' : step === 'forgot' ? 'ŞİFRE SIFIRLA' : step === 'forgot-sent' ? 'KONTROL ET' : (isLogin ? 'ERİŞİM ONAYLANDI' : 'KİMLİK OLUŞTUR')}
        </h2>

        {/* ── ŞİFRE SIFIRLA FORMU ── */}
        {step === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <i className="fa-solid fa-key" style={{ fontSize: '40px', color: '#e60000', marginBottom: '10px', display: 'block' }}></i>
              <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6 }}>
                Kayıtlı e-posta adresinizi girin. Şifre sıfırlama linki göndereceğiz.
              </p>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>[ E-POSTA ]</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="kayitli@email.com"
                style={{ width: '100%', padding: '12px 15px', background: '#111', border: '1px solid #333', borderLeft: '4px solid #e60000', color: '#fff', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>
            {message.text && (
              <div style={{ padding: '12px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', backgroundColor: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)', color: message.type === 'error' ? '#e60000' : '#2ea44f', border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`, fontFamily: 'monospace' }}>
                {message.text}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#e60000', color: '#fff', border: 'none', fontWeight: 900, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {loading ? 'GÖNDERİLİYOR...' : 'SIFIRLAMA LİNKİ GÖNDER'}
            </button>
            <button type="button" onClick={() => { setStep('form'); setMessage({ type: '', text: '' }); }} style={{ width: '100%', marginTop: '12px', background: 'transparent', border: 'none', color: '#666', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
              Giriş ekranına dön
            </button>
          </form>
        )}

        {/* ── SIFIRLAMA LİNKİ GÖNDERİLDİ ── */}
        {step === 'forgot-sent' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(46,164,79,0.1)', border: '2px solid #2ea44f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', color: '#2ea44f' }}>
              <i className="fa-solid fa-envelope-circle-check"></i>
            </div>
            <h3 style={{ color: '#2ea44f', marginBottom: '12px', fontSize: '16px', fontWeight: 900, letterSpacing: '1px' }}>LİNK GÖNDERİLDİ</h3>
            <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.7, marginBottom: '25px' }}>
              <strong style={{ color: '#fff' }}>{email}</strong> adresine şifre sıfırlama linki gönderildi.<br />
              E-postanızı kontrol edin ve linke tıklayın.
            </p>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '12px', marginBottom: '20px', fontSize: '12px', color: '#666' }}>
              <i className="fa-solid fa-circle-info" style={{ color: '#e60000', marginRight: '6px' }}></i>
              Spam/Gereksiz klasörünü de kontrol etmeyi unutmayın.
            </div>
            <button onClick={() => { setStep('form'); setMessage({ type: '', text: '' }); }} style={{ background: '#e60000', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Giriş Ekranına Dön
            </button>
          </div>
        )}

        {/* ── NORMAL FORM ── */}
        {(step === 'form' || step === 'verify') && (
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
                placeholder="Doğrulama Kodu"
                maxLength={8}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#111',
                  border: '1px solid #e60000',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '20px',
                  textAlign: 'center',
                  letterSpacing: '6px'
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

              {/* Şifremi Unuttum */}
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button
                  type="button"
                  onClick={() => { setStep('forgot'); setMessage({ type: '', text: '' }); }}
                  style={{ background: 'none', border: 'none', color: '#555', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >
                  <i className="fa-solid fa-key" style={{ marginRight: '5px' }}></i>
                  Şifremi Unuttum
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
        )} {/* step === 'form' || step === 'verify' kapanışı */}

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
