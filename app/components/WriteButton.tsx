'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

const RULES = [
  { icon: 'fa-solid fa-image', text: 'Yazınla birlikte min. 800x450px kaliteli bir görsel yüklemen zorunludur.' },
  { icon: 'fa-solid fa-code', text: 'İçerik yazılım, Discord bot, web tasarım veya teknoloji konularında olmalıdır.' },
  { icon: 'fa-solid fa-ban', text: 'Hakaret, spam, reklam ve kötü içerik kesinlikle yasaktır.' },
  { icon: 'fa-solid fa-clock', text: 'Günde en fazla 3 yazı paylaşabilirsin.' },
  { icon: 'fa-solid fa-user-shield', text: 'Yazılar yönetici onayından sonra yayına girer, sabırlı ol.' },
  { icon: 'fa-solid fa-copyright', text: 'Başkasından kopyaladığın içerikleri kaynak belirtmeden paylaşma.' },
];

export default function WriteButton() {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <>
      {/* Floating Write Button */}
      <button
        onClick={() => setShowModal(true)}
        title="Yazı Paylaş"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '80px',
          zIndex: 9000,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e60000, #900)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 4px 20px rgba(230,0,0,0.5)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(230,0,0,0.7)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(230,0,0,0.5)';
        }}
      >
        <i className="fa-solid fa-pen-nib"></i>
      </button>

      {/* Rules Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0e0e0e',
              border: '2px solid #e60000',
              borderRadius: '8px',
              padding: '35px 30px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 0 40px rgba(230,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'rgba(230,0,0,0.15)', border: '2px solid #e60000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 15px', fontSize: '24px', color: '#e60000'
              }}>
                <i className="fa-solid fa-scroll"></i>
              </div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: 0 }}>Yayın Kuralları</h2>
              <p style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>
                Yazını paylaşmadan önce lütfen bu kuralları oku.
              </p>
            </div>

            {/* Rules List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
              {RULES.map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#161616', padding: '12px', borderRadius: '6px', border: '1px solid #1e1e1e' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(230,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={rule.icon} style={{ color: '#e60000', fontSize: '12px' }}></i>
                  </div>
                  <p style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>{rule.text}</p>
                </div>
              ))}
            </div>

            {/* Accept checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#e60000', cursor: 'pointer' }}
              />
              <span style={{ color: '#aaa', fontSize: '13px' }}>
                Tüm kuralları okudum ve kabul ediyorum.
              </span>
            </label>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#888', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  if (!accepted) return;
                  setShowModal(false);
                  router.push('/paylas');
                }}
                disabled={!accepted}
                style={{
                  flex: 2, padding: '12px',
                  background: accepted ? '#e60000' : '#333',
                  border: 'none', color: accepted ? '#fff' : '#666',
                  borderRadius: '6px',
                  cursor: accepted ? 'pointer' : 'not-allowed',
                  fontSize: '14px', fontWeight: 700,
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-pen-nib" style={{ marginRight: '8px' }}></i>
                Yazmaya Başla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
