import Sidebar from '../components/Sidebar';

export default function HakkimizdaPage() {
  return (
    <div className="main-layout">
      <div>
        <div className="post-content-area">
          <div className="post-header">
            <h1 className="post-title-big">Hakkımızda</h1>
          </div>
          <div className="post-body">
            <p>
              Merhaba! Ben <strong>MareFi</strong>, CodeMareFi&apos;nin kurucusuyum.
              Bu site, Discord bot geliştiricilerine ve web tasarımcılarına yardımcı olmak amacıyla
              <strong> 19 Ağustos 2019</strong>&apos;da kuruldu.
            </p>

            <h2>Ne Paylaşıyoruz?</h2>
            <ul>
              <li>🤖 <strong>Discord Bot Kodları</strong> — 300+ farklı Discord bot komutu</li>
              <li>⚡ <strong>Hazır Bot Altyapıları</strong> — Kullanıma hazır Discord bot altyapıları</li>
              <li>✏️ <strong>Blogger Eklentileri</strong> — Blogger sitenizi güzelleştirin</li>
              <li>🌐 <strong>Web Tasarım</strong> — HTML, CSS ve JavaScript ipuçları</li>
              <li>📚 <strong>Genel Konular</strong> — Teknoloji ve yazılım haberleri</li>
            </ul>

            <h2>Misyonumuz</h2>
            <p>
              Türkiye&apos;deki Discord bot geliştiricilerine ücretsiz, kaliteli ve Türkçe kaynak sağlamak.
              Kodlama topluluğunu büyütmek ve geliştiriciler arası paylaşımı artırmak.
            </p>

            <h2>İletişim</h2>
            <p>
              Herhangi bir sorunuz veya öneriniz varsa{' '}
              <a href="https://discord.gg/dRMY8zW" target="_blank" rel="noopener nofollow">Discord sunucumuza</a>{' '}
              katılabilir ya da <a href="/iletisim">iletişim sayfamızdan</a> bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
