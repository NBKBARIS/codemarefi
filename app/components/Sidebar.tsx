'use client';
import Link from 'next/link';
import { CATEGORIES } from '../lib/blogger';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* SİTE İÇİ ÖZEL ARAMA */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <i className="fa-solid fa-magnifying-glass"></i>
          Arama
        </div>
        <div className="widget-body">
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              type="text"
              placeholder="Ara..."
              style={{
                flex: 1,
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRight: 'none',
                color: '#fff',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button style={{
              background: '#e60000',
              border: 'none',
              color: '#fff',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: '13px',
            }}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      {/* KATEGORİLER */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <i className="fa-solid fa-layer-group"></i>
          Kategoriler
        </div>
        <div className="widget-body" style={{ padding: '5px 0' }}>
          <ul className="cat-list">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <Link href={`/kategori/${encodeURIComponent(cat)}`}>
                  <i className="fa-solid fa-angle-right"></i>
                  {cat.replace(/-/g, ' ')}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ETİKETLER */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <i className="fa-solid fa-tags"></i>
          Etiketler
        </div>
        <div className="widget-body">
          <div className="tag-cloud">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/kategori/${encodeURIComponent(cat)}`} className="tag-pill">
                {cat.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* HAKKIMIZDA */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <i className="fa-solid fa-circle-info"></i>
          Hakkımızda
        </div>
        <div className="widget-body" style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#888', fontSize: '12px', lineHeight: 1.6 }}>
            08.19.2019 BU YANA YAYINDAYIZ
          </p>
          <p style={{ color: '#aaa', fontSize: '12px', marginTop: '10px', lineHeight: 1.6 }}>
            NBK BARIŞ, Türkiye'nin en büyük Discord bot kod paylaşım platformu. Blogger eklentileri ve web tasarım içerikleri.
          </p>
          <Link href="/hakkimizda" style={{
            display: 'inline-block',
            marginTop: '12px',
            background: '#e60000',
            color: '#fff',
            padding: '6px 16px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}>
            Devamını Oku
          </Link>
        </div>
      </div>

      {/* SOSYAL MEDYA */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <i className="fa-solid fa-share-nodes"></i>
          Sosyal Medya
        </div>
        <div className="widget-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: 'fa-facebook-f', label: 'Facebook', color: '#3b5998', url: 'https://www.facebook.com/CodeMareFi' },
              { icon: 'fa-twitter', label: 'Twitter', color: '#1da1f2', url: 'https://twitter.com/mare_fi' },
              { icon: 'fa-youtube', label: 'YouTube', color: '#ff0000', url: '#' },
              { icon: 'fa-discord', label: 'Discord', color: '#7289da', url: '#' },
              { icon: 'fa-instagram', label: 'Instagram', color: '#e1306c', url: '#' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: s.color,
                color: '#fff',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <i className={`fa-brands ${s.icon}`}></i>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
