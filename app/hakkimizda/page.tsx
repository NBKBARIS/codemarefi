import Sidebar from '../components/Sidebar';

export default function HakkimizdaPage() {
  return (
    <div className="main-layout">
      <div>
        <div className="post-content-area" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          {/* Hero Section */}
          <div style={{ 
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(\'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop\')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '80px 40px',
            borderRadius: '12px',
            border: '1px solid #222',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#fff', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '4px' }}>Hakkımızda</h1>
            <div style={{ width: '60px', height: '4px', background: '#e60000', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#eee', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
              2019'dan beri Türkiye'nin en büyük Discord bot ve web geliştirme topluluklarından birine ev sahipliği yapıyoruz.
            </p>
          </div>

          {/* İçerik Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '30px', borderRadius: '12px' }}>
              <i className="fa-solid fa-rocket" style={{ fontSize: '32px', color: '#e60000', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Hikayemiz</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>
                CodeMareFi, <strong>19 Ağustos 2019</strong> tarihinde kurucumuz <strong>NBK BARIŞ</strong> tarafından, yazılım dünyasına yeni adım atanlara rehberlik etmek amacıyla hayata geçirildi.
              </p>
            </div>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '30px', borderRadius: '12px' }}>
              <i className="fa-solid fa-bullseye" style={{ fontSize: '32px', color: '#e60000', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Misyonumuz</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>
                Karmaşık kod yapılarını en basit ve anlaşılır haliyle topluluğa sunmak, Türkçe kaynak eksikliğini gidermek ve kaliteli bir paylaşım ortamı oluşturmak.
              </p>
            </div>
          </div>

          {/* Neler Paylaşıyoruz? */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '40px', borderRadius: '12px', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '30px', textAlign: 'center' }}>Neler Paylaşıyoruz?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
              {[
                { icon: 'fa-robot', title: 'Discord Bot', desc: 'Komutlar & Altyapılar' },
                { icon: 'fa-code', title: 'Web Tasarım', desc: 'HTML / CSS / JS / React' },
                { icon: 'fa-server', title: 'Backend', desc: 'Node.js / Next.js / API' },
                { icon: 'fa-database', title: 'Veritabanı', desc: 'Supabase / PostgreSQL' }
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: '24px', color: '#e60000', marginBottom: '10px' }}></i>
                  <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 5px 0' }}>{item.title}</h4>
                  <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Contact Call */}
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(230,0,0,0.05)', border: '1px dashed #e60000', borderRadius: '12px' }}>
            <p style={{ color: '#888', marginBottom: '20px' }}>Bizimle bir projeniz mi var veya sadece merhaba mı demek istiyorsunuz?</p>
            <a href="/iletisim" style={{ 
              background: '#e60000', color: '#fff', padding: '12px 35px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px'
            }}>Bize Ulaşın</a>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
