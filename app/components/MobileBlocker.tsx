'use client';

import { useState, useEffect } from 'react';

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Hem ekran genişliğini hem de kullanıcı aracısını kontrol edelim
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      
      // Eğer ekran 768px'den küçükse VEYA mobil cihazsa engelle
      if (width < 768 || isMobileDevice) {
        setIsMobile(true);
        document.body.style.overflow = 'hidden';
      } else {
        setIsMobile(false);
        document.body.style.overflow = 'unset';
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#050505',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      padding: '30px',
      textAlign: 'center',
      fontFamily: 'monospace'
    }}>
      {/* Glitch Effect Background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, rgba(230, 0, 0, 0.03) 0px, rgba(230, 0, 0, 0.03) 1px, transparent 1px, transparent 2px)',
        backgroundSize: '100% 3px',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        border: '2px solid #e60000',
        padding: '30px',
        maxWidth: '400px',
        boxShadow: '0 0 30px rgba(230, 0, 0, 0.2)',
        position: 'relative',
        background: '#0a0a0a'
      }}>
        <i className="fa-solid fa-mobile-screen-button" style={{ fontSize: '50px', color: '#e60000', marginBottom: '20px' }}></i>
        
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#e60000', textTransform: 'uppercase', letterSpacing: '2px' }}>
          [ ERİŞİM REDDEDİLDİ ]
        </h1>
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc', marginBottom: '25px' }}>
          CodeMareFi protokolleri mobil cihazlardan erişimi güvenlik gerekçesiyle sınırlandırmıştır. 
          Devam etmek için masaüstü bir terminal kullanın veya tarayıcı ayarlarından <b>"Masaüstü Sitesi"</b> modunu aktif edin.
        </p>

        <div style={{ textAlign: 'left', background: '#111', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
          <p style={{ fontSize: '13px', color: '#e60000', fontWeight: 'bold', marginBottom: '10px' }}>NASIL GİRİŞ YAPILIR?</p>
          <ul style={{ fontSize: '12px', color: '#aaa', paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Tarayıcınızın sağ üstündeki <b>üç noktaya (⋮)</b> veya <b>(AA)</b> ikonuna tıklayın.</li>
            <li style={{ marginBottom: '8px' }}>Açılan menüden <b>"Masaüstü Sitesi"</b> seçeneğini işaretleyin.</li>
            <li>Sayfa yenilendikten sonra sisteme sızabilirsiniz.</li>
          </ul>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '25px',
            background: '#e60000',
            color: '#fff',
            border: 'none',
            padding: '12px 25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          SİSTEMİ YENİDEN TARA
        </button>
      </div>

      <p style={{ marginTop: '30px', fontSize: '10px', color: '#444', textTransform: 'uppercase' }}>
        Terminal ID: {Math.random().toString(36).substring(7).toUpperCase()} | Secure Protocol v2.4
      </p>
    </div>
  );
}
