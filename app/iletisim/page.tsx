import Sidebar from '../components/Sidebar';

export default function IletisimPage() {
  return (
    <div className="main-layout">
      <div>
        <div className="post-content-area">
          <div className="post-header">
            <h1 className="post-title-big">İletişim</h1>
          </div>
          <div className="post-body">
            <p>Bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
              <a href="https://discord.gg/dRMY8zW" target="_blank" rel="noopener nofollow" style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(88,101,242,0.1)', border: '1px solid rgba(88,101,242,0.3)',
                borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: 'inherit'
              }}>
                <span style={{ fontSize: '2rem' }}>💬</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Discord Sunucusu</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>discord.gg/dRMY8zW</div>
                </div>
              </a>

              <a href="https://www.facebook.com/CodeMareFi" target="_blank" rel="noopener nofollow" style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(24,119,242,0.1)', border: '1px solid rgba(24,119,242,0.3)',
                borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: 'inherit'
              }}>
                <span style={{ fontSize: '2rem' }}>👍</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Facebook</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@CodeMareFi</div>
                </div>
              </a>

              <a href="https://twitter.com/mare_fi" target="_blank" rel="noopener nofollow" style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(29,155,240,0.1)', border: '1px solid rgba(29,155,240,0.3)',
                borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: 'inherit'
              }}>
                <span style={{ fontSize: '2rem' }}>🐦</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Twitter / X</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@mare_fi</div>
                </div>
              </a>
            </div>

            <h2>Hata Bildirimi</h2>
            <p>
              Sitemizdeki herhangi bir yazıda hata ile karşılaşırsanız, o yazının yorum bölümünden bize bildiriniz.
              En kısa sürede yardımcı olmaya çalışacağız.
            </p>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
