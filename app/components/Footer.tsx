'use client';
import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Yönetim', href: '#' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Duyurular', href: '#' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Site Haritası', href: '#' },
    { label: 'CodeMareFi Chat', href: '#' },
  ];

  return (
    <footer style={{ 
      background: '#000', 
      padding: '60px 20px 40px', 
      borderTop: '2px solid #e60000',
      textAlign: 'center',
      color: '#fff'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Stylized Logo Image */}
        <div style={{ marginBottom: '30px' }}>
          <img 
            src="/logo.png" 
            alt="CodeMareFi" 
            style={{ 
              maxWidth: '300px', 
              height: 'auto',
              filter: 'drop-shadow(0 0 10px rgba(230,0,0,0.3))'
            }} 
          />
        </div>

        {/* Links Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          {footerLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                fontSize: '13px', 
                fontWeight: 'bold',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e60000'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright & Info Text */}
        <div style={{ 
          fontSize: '12px', 
          color: '#fff', 
          lineHeight: '1.8',
          maxWidth: '1000px',
          margin: '0 auto 20px'
        }}>
          <span style={{ color: '#e60000', fontWeight: 'bold' }}>Copyright © 2017-2024.</span> CodeMareFi | Blogger Eklentileri ve Discord Bot Kod Paylaşım Kodlara Dair Herşey | Tüm Haklarını Sakladık Bulamasın Boşuna Yorma Kendini.
        </div>

        {/* Keywords Line */}
        <div style={{ 
          fontSize: '11px', 
          textTransform: 'lowercase',
          marginBottom: '20px'
        }}>
          <span style={{ color: '#e60000' }}>discord bot kodları</span>, <span style={{ color: '#fff' }}>discord bot kod paylaşım</span>, <span style={{ color: '#e60000' }}>blogger eklentileri</span>, <span style={{ color: '#fff' }}>discord bot komutları</span>, <span style={{ color: '#e60000' }}>kod paylaşım</span>
        </div>

        {/* Designer Line */}
        <div style={{ 
          fontSize: '12px', 
          color: '#fff',
          fontWeight: 'bold'
        }}>
          Dizayn |\_/| Tasarım - by “ <i className="fa-solid fa-heart" style={{ color: '#e60000' }}></i> `` <span style={{ color: '#e60000', fontSize: '15px', letterSpacing: '1px' }}>NBK BARIŞ</span> `` <i className="fa-solid fa-heart" style={{ color: '#e60000' }}></i> ”
        </div>

      </div>
    </footer>
  );
}
