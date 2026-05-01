'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '../lib/blogger';
import Leaderboard from './Leaderboard';

export default function Sidebar({ hideSearch = false }: { hideSearch?: boolean }) {
  const [time, setTime] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    const s = d.getSeconds().toString().padStart(2, '0');
    
    return {
      dateStr: `${dayName}, ${day} ${monthName}, ${year}`,
      timeStr: `${h} : ${m} : ${s}`
    };
  };

  return (
    <aside className="sidebar">
      {/* SİTE İÇİ ÖZEL ARAMA ve YENİ WIDGETLAR */}
      {!hideSearch && (
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ fontSize: '13px', color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          SİTE İÇİ ÖZEL ARAMA
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e60000', display: 'inline-block' }}></span>
        </h3>
        
        {/* Beyaz Arama Kutusu (Bulletproof Native Form) */}
        <form action="/arama" method="GET" style={{ background: '#fff', padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '2px', marginBottom: '0' }}>
          <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', outline: 'none' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#888', fontSize: '16px' }}></i>
          </button>
          <input 
            name="q"
            type="text" 
            placeholder="Ara..." 
            defaultValue={searchQuery}
            style={{ border: 'none', outline: 'none', background: 'transparent', color: '#333', width: '100%', fontSize: '14px', fontWeight: 'bold' }} 
          />
        </form>

        {/* SKOR TABLOSU — arama kutusunun hemen altında */}
        <div style={{ marginBottom: '20px' }}>
          <Leaderboard />
        </div>

        {/* Saat Widget */}
        <div style={{ background: '#111', padding: '20px 15px', textAlign: 'center', marginBottom: '0' }}>
          <div style={{ border: '1px solid #e60000', padding: '15px', borderRadius: '2px' }}>
            <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
              {time ? formatTime(time).dateStr : 'Yükleniyor...'}
            </div>
            {time && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fff', fontSize: '32px', letterSpacing: '2px', fontWeight: 'bold' }}>
                  {formatTime(time).timeStr}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* GÜNÜN SÖZÜ WIDGET */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            GÜNÜN SÖZÜ
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e60000', display: 'inline-block' }}></span>
          </h3>
          <div style={{ background: '#1a1a1a', padding: '30px 20px', borderRadius: '4px', textAlign: 'center', border: '1px solid #222' }}>
            <p style={{ color: '#eee', fontSize: '16px', fontWeight: '700', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic' }}>
              "Kod yazmak bir sanattır, paylaşmak ise bir sorumluluktur."
            </p>
            <p style={{ color: '#888', fontSize: '12px', fontWeight: '500' }}>
              CodeMareFi - İyi Kodlamalar Diler
            </p>
          </div>
        </div>

        {/* Destek Metni Widget */}
        <div style={{ background: '#111', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.5 }}>
            CodeMareFi'yi desteklemek ister misin?<br/>
            Discord sunucumuza katılarak, içeriklerimizi sosyal medyada paylaşarak ve arkadaşlarına önererek bize destek olabilirsin.<br/><br/>
            Desteğin sayesinde daha kaliteli içerikler üretmeye devam ediyoruz!
          </p>
        </div>
      </div>
      )}

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
              { icon: 'fa-facebook-f',  label: 'Facebook',            color: '#3b5998', url: null },
              { icon: 'fa-twitter',     label: 'Twitter',             color: '#1da1f2', url: null },
              { icon: 'fa-youtube',     label: 'YouTube',             color: '#ff0000', url: null },
              { icon: 'fa-discord',     label: 'Discord',             color: '#7289da', url: null },
              { icon: 'fa-instagram',   label: 'Instagram',           color: '#e1306c', url: null },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                background: '#1a1a1a',
                color: '#555',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '1px dashed #2a2a2a',
                borderRadius: '2px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-brands ${s.icon}`} style={{ color: '#444' }}></i>
                  {s.label}
                </div>
                <span style={{ fontSize: '10px', color: '#444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fa-solid fa-clock" style={{ fontSize: '9px' }}></i>
                  Çok Yakında
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
