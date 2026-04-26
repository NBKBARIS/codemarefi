'use client';
import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Duyurular', href: '#' },
    { label: 'Site Haritası', href: '#' },
    { label: 'NBK BARIŞ Chat', href: '#' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <div className="footer-widget-title">Hızlı Bağlantılar</div>
          <ul className="footer-links">
            {footerLinks.map(l => (
              <li key={l.href + l.label}>
                <Link href={l.href}>
                  <i className="fa-solid fa-angle-right"></i>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-widget-title">Kategoriler</div>
          <ul className="footer-links">
            {['Discord Bot Kodları', 'Discord Bot Konuları', 'Blogger Konuları', 'Web Tasarım', 'JavaScript', 'Python'].map(c => (
              <li key={c}>
                <Link href={`/kategori/${c.replace(/ /g, '-')}`}>
                  <i className="fa-solid fa-angle-right"></i>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-widget-title">Hakkımızda</div>
          <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.7 }}>
            NBK BARIŞ, Türkiye'nin en büyük Discord bot kod paylaşım platformudur. Kaliteli içerikler üretiyoruz.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
            {[
              { icon: 'fa-facebook-f', url: 'https://www.facebook.com/CodeMareFi' },
              { icon: 'fa-twitter', url: 'https://twitter.com/mare_fi' },
              { icon: 'fa-youtube', url: '#' },
              { icon: 'fa-discord', url: '#' },
              { icon: 'fa-instagram', url: '#' },
            ].map(s => (
              <a key={s.icon} href={s.url} target="_blank" rel="noreferrer" style={{
                width: '32px', height: '32px',
                background: '#222', border: '1px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#888', fontSize: '12px', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e60000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
              >
                <i className={`fa-brands ${s.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2019 - {new Date().getFullYear()} <span>NBK BARIŞ</span> Tüm Hakları Saklıdır. İzinsiz Kopyalanamaz.
        </p>
        <p style={{ marginTop: '6px', fontSize: '11px', color: '#444' }}>
          Dizayn |_/| Tasarım - by{' '}
          <span style={{ color: '#e60000' }}><i className="fa-solid fa-heart"></i> NBK BARIŞ <i className="fa-solid fa-heart"></i></span>
        </p>
      </div>
    </footer>
  );
}
