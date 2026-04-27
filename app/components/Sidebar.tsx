'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../lib/blogger';

export default function Sidebar() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const s = d.getSeconds().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'ÖS' : 'ÖÖ';
    
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    const hStr = h.toString().padStart(2, '0');
    
    return {
      dateStr: `${dayName}, ${day} ${monthName}, ${year}`,
      timeStr: `${hStr} : ${m} : ${s}`,
      ampm
    };
  };

  return (
    <aside className="sidebar">
      {/* SİTE İÇİ ÖZEL ARAMA ve YENİ WIDGETLAR */}
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ fontSize: '13px', color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          SİTE İÇİ ÖZEL ARAMA
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e60000', display: 'inline-block' }}></span>
        </h3>
        
        {/* Beyaz Arama Kutusu */}
        <div style={{ background: '#fff', padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '2px', marginBottom: '20px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#888', fontSize: '16px' }}></i>
          <input 
            type="text" 
            placeholder="Ara..." 
            style={{ border: 'none', outline: 'none', background: 'transparent', color: '#333', width: '100%', fontSize: '14px', fontWeight: 'bold' }} 
          />
        </div>

        {/* Saat Widget */}
        <div style={{ background: '#111', padding: '20px 15px', textAlign: 'center', marginBottom: '0' }}>
          <div style={{ border: '1px solid #e60000', padding: '15px', borderRadius: '2px' }}>
            <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
              {time ? formatTime(time).dateStr : 'Yükleniyor...'}
            </div>
            {time && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fff', fontSize: '26px', letterSpacing: '2px' }}>
                  {formatTime(time).timeStr}
                </span>
                <span style={{ background: '#e60000', color: '#fff', padding: '4px 6px', fontSize: '14px', fontWeight: 'bold', borderRadius: '2px' }}>
                  {formatTime(time).ampm}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Destek Metni Widget */}
        <div style={{ background: '#111', padding: '0 20px 20px', textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: '15px', marginBottom: '15px' }}>
            <p style={{ color: '#ddd', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              08.19.2019 BU YANA YAYINDAYIZ
            </p>
          </div>
          <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.5 }}>
            CodeMareFi'ye Destek olmak istiyorum ama nasıl bilmiyorum diyorsan eğer;<br/>
            Sitemizdeki reklamlara tıklayarak, Bizi sosyal mecralarda arkadaşlarınıza önererek destek olabilirsiniz.<br/><br/>
            Bu sayede daha çok kod ve gelişmiş sistemleri paylaşmamıza teşvik etmiş olursunuz.
          </p>
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
