import Sidebar from '../components/Sidebar';

export default function IletisimPage() {
  return (
    <div className="main-layout">
      <div>
        <div className="post-content-area" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <div className="post-header" style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', 
            padding: '60px 40px', 
            borderRadius: '12px', 
            border: '1px solid #222', 
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(230,0,0,0.1)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              border: '2px solid #e60000',
              fontSize: '32px',
              color: '#e60000',
              boxShadow: '0 0 30px rgba(230,0,0,0.2)'
            }}>
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>İletişim</h1>
            <p style={{ color: '#888', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              Sorularınız, iş birliği teklifleriniz veya geri bildirimleriniz için bize ulaşmaktan çekinmeyin. Ekibimiz size en kısa sürede dönüş yapacaktır.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {/* E-Posta Kartı */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '30px', textAlign: 'center', transition: 'all 0.3s' }}>
              <i className="fa-solid fa-headset" style={{ fontSize: '40px', color: '#e60000', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '10px' }}>Resmi Destek</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Genel konular ve teknik destek için e-posta adresimiz:</p>
              <a href="mailto:support@codemarefi.com" style={{ 
                display: 'inline-block', 
                background: '#e60000', 
                color: '#fff', 
                padding: '10px 25px', 
                borderRadius: '50px', 
                textDecoration: 'none', 
                fontWeight: 700,
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >support@codemarefi.com</a>
            </div>

            {/* Discord Kartı */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '30px', textAlign: 'center', transition: 'all 0.3s' }}>
              <i className="fa-brands fa-discord" style={{ fontSize: '40px', color: '#5865F2', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '10px' }}>Topluluk & Chat</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Geliştiricilerle tanışmak ve anlık yardım almak için:</p>
              <a href="https://discord.gg/dRMY8zW" target="_blank" rel="noreferrer" style={{ 
                display: 'inline-block', 
                background: '#5865F2', 
                color: '#fff', 
                padding: '10px 25px', 
                borderRadius: '50px', 
                textDecoration: 'none', 
                fontWeight: 700,
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >Discord'a Katıl</a>
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '40px', display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ fontSize: '40px', color: '#333' }}>
              <i className="fa-solid fa-bug"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Hata Bildirimi mi yapacaksınız?</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Sitemizdeki içeriklerde veya sistemde bir hata ile karşılaşırsanız, lütfen ilgili yazının altına yorum bırakarak bizi bilgilendirin. 
                Topluluğumuz için en doğru bilgiyi sunmaya çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
