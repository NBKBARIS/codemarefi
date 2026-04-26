export interface LocalPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: string;
  updated: string;
  categories: string[];
  thumbnail: string;
  author: string;
  commentCount: number;
}

export const localPosts: LocalPost[] = [
  {
    id: "1",
    title: "Discord Bot Geliştirme Rehberi 2026: Sıfırdan İleri Seviyeye",
    slug: "discord-bot-gelistirme-rehberi-2026",
    thumbnail: "/images/discord_bot_2026_1777229959529.png",
    author: "NBK BARIŞ",
    published: "2026-04-26T12:00:00Z",
    updated: "2026-04-26T12:00:00Z",
    categories: ["Discord-bot-kodları", "JavaScript", "Python"],
    commentCount: 15,
    content: `
      <div style="background: rgba(88, 101, 242, 0.1); border-left: 4px solid #5865F2; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <img src="/images/robot.svg" alt="robot" style="width: 48px; height: 48px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
        <strong style="color: #5865F2; font-size: 18px; vertical-align: middle;">Hoş Geldiniz!</strong> 
        <p style="margin-top: 10px; color: #ccc;">2026 yılı itibarıyla Discord bot geliştirmede kullanılan en son teknolojiler, yeni Node.js sürümleri ve discord.js v15 yapısını adım adım inceliyoruz.</p>
      </div>

      <p>Discord sunucularını yönetmek ve kullanıcılara mükemmel bir deneyim sunmak için kendi botunuzu kodlamak harika bir adımdır. Kodlamaya yeni başlayanlar için bile oldukça anlaşılır olan JavaScript (Node.js) altyapısı sayesinde kendi botunuzu çok kısa sürede aktif edebilirsiniz.</p>

      <h3 style="color: #fff; margin-top: 25px;">1. Gerekli Kurulumlar</h3>
      <p>İlk olarak bilgisayarımızda Node.js yüklü olmalıdır. Ardından bir proje klasörü açıp terminalden şu komutları giriyoruz:</p>
      <pre><code>npm init -y\nnpm install discord.js dotenv</code></pre>

      <p>Bu komutlar projeyi başlatır ve temel kütüphaneleri indirir.</p>

      <h3 style="color: #fff; margin-top: 25px;">2. Botu Ayağa Kaldırmak</h3>
      <p>Ana dosyamız olan <code>index.js</code> dosyasını oluşturup şu kodları ekliyoruz:</p>
      <pre><code>const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
  console.log(\`✅ Bot \${client.user.tag} olarak giriş yaptı!\`);
});

client.login('SENIN_BOT_TOKEN_BURAYA');</code></pre>

      <div style="background: #2b1d1d; border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <img src="/images/warning.svg" alt="warning" style="width: 32px; height: 32px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
        <strong style="color: #e60000;">ÖNEMLİ UYARI:</strong> Bot token'ınızı kesinlikle kimseyle paylaşmayın ve GitHub gibi açık platformlara yüklemeyin.
      </div>
      
      <p style="margin-top: 20px;">Bu kodlar botunuzu çevrimiçi yapacaktır. Daha fazlası için sitemizi takipte kalın!</p>

      <style>
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      </style>
    `
  },
  {
    id: "2",
    title: "Modern Web Tasarım Trendleri: UI/UX Standartları",
    slug: "modern-web-tasarim-trendleri",
    thumbnail: "/images/web_design_trends_1777230327387.png",
    author: "NBK BARIŞ",
    published: "2026-04-25T10:30:00Z",
    updated: "2026-04-25T10:30:00Z",
    categories: ["Html", "CSS", "Genel Konular"],
    commentCount: 8,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-solid fa-palette" style="font-size: 48px; display: inline-block; animation: spin 4s linear infinite; color: #e60000;"></i>
        <h2 style="color: #fff; margin-top: 10px;">Geleceğin Tasarım Dili</h2>
      </div>

      <p>Web tasarımı hızla gelişiyor ve kullanıcıların sitelerde geçirdiği süreyi artırmak için modern UI/UX teknikleri olmazsa olmaz hale geldi. Bu makalemizde 2026 yılında en çok konuşulan web tasarım trendlerine göz atacağız.</p>

      <h3 style="color: #fff; margin-top: 25px;">Glassmorphism (Cam Efekti)</h3>
      <p>Arka planı bulanıklaştıran ve yarı saydam katmanlar oluşturan bu tasarım stili hala zirvede. Modern işletim sistemlerinin de varsayılan olarak benimsediği bu stil, CSS ile oldukça kolay yapılabiliyor:</p>
      <pre><code>.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}</code></pre>

      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <i class="fa-solid fa-lightbulb" style="font-size: 20px; display: inline-block; animation: bounce 2s infinite; color: #00ff80;"></i>
        <strong style="color: #00ff80;">Biliyor muydunuz?</strong> Doğru kontrast oranlarını kullanmak, sitenizin erişilebilirliğini artırır ve Google SEO puanınıza doğrudan olumlu etki eder.
      </div>
      
      <p style="margin-top: 20px;">Karanlık mod (Dark Mode) artık bir seçenek değil, standart bir zorunluluktur. Web projelerinizde mutlaka karanlık mod desteği barındırmalısınız.</p>
      
      <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      </style>
    `
  },
  {
    id: "3",
    title: "JavaScript ile Programlamaya Giriş: Adım Adım Rehber",
    slug: "javascript-ile-programlamaya-giris",
    thumbnail: "/images/javascript_beginner_1777230673341.png",
    author: "NBK BARIŞ",
    published: "2026-04-24T09:15:00Z",
    updated: "2026-04-24T09:15:00Z",
    categories: ["JavaScript", "Genel Konular"],
    commentCount: 22,
    content: `
      <div style="background: rgba(247, 223, 30, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; border: 1px solid #f7df1e;">
        <i class="fa-solid fa-bolt" style="font-size: 50px; display: inline-block; animation: pulse 2s infinite; color: #f7df1e;"></i>
        <h3 style="color: #f7df1e; margin: 10px 0 0 0;">JavaScript Dünyasına Hoş Geldin!</h3>
      </div>

      <p>JavaScript, dünyanın en popüler programlama dilidir. İnternet tarayıcılarından sunuculara, mobil uygulamalardan yapay zeka modellerine kadar her yerde kullanılır. Peki JavaScript öğrenmeye nereden başlamalısınız?</p>

      <h3 style="color: #fff; margin-top: 25px;">Değişkenler ve Veri Tipleri</h3>
      <p>Modern JavaScript'te veri depolamak için <code>let</code> ve <code>const</code> kelimelerini kullanırız:</p>
      <pre><code>const siteAdi = "CodeMareFi";
let makaleSayisi = 5;

// Konsola yazdırma
console.log(siteAdi + " sitemize hoş geldiniz!");</code></pre>

      <p>ES6 (ECMAScript 2015) standartlarıyla birlikte gelen Arrow Function yapıları, kodlarımızı çok daha sade ve okunabilir hale getirdi.</p>

      <div style="display: flex; gap: 15px; margin-top: 30px; align-items: center; background: #1a1a1a; padding: 15px; border-radius: 6px;">
        <img src="/images/rocket.svg" alt="rocket" style="width: 48px; height: 48px;" />
        <div>
          <strong style="color: #fff;">Hemen Başla!</strong>
          <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">Tarayıcınızın F12 tuşuna basıp "Console" sekmesine geçerek kendi JavaScript kodlarınızı anında deneyebilirsiniz.</p>
        </div>
      </div>
      
      <style>
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      </style>
    `
  },
  {
    id: "4",
    title: "Vercel ve Next.js Kullanımı: Sıfır Hata ile Yayın Yapmak",
    slug: "vercel-ve-nextjs-kullanimi",
    thumbnail: "/images/vercel_nextjs_1777230862288.png",
    author: "NBK BARIŞ",
    published: "2026-04-23T14:45:00Z",
    updated: "2026-04-23T14:45:00Z",
    categories: ["Tavsiyemiz", "Popüler", "Genel Konular"],
    commentCount: 42,
    content: `
      <div style="text-align: center; margin-bottom: 25px;">
        <i class="fa-solid fa-gear" style="font-size: 48px; display: inline-block; animation: spin 5s linear infinite; color: #aaa;"></i>
      </div>

      <p>React tabanlı en güçlü framework olan <strong>Next.js</strong> ve onun yaratıcısı olan <strong>Vercel</strong> ile projeleri canlıya almak oldukça kolaydır. Ancak Server-Side Rendering (SSR) kullanan dinamik projelerde bazen beklenmedik 500 hataları ile karşılaşabilirsiniz.</p>

      <h3 style="color: #fff; margin-top: 25px;">Statik Sitelerin Gücü</h3>
      <p>Eğer dışarıdan sürekli değişen bir API kullanmak yerine projenizin içindeki yerel verileri (.md veya .json) kullanırsanız, Vercel projenizi "Statik" olarak oluşturur. Statik projeler çökelmez, 500 hatası vermez ve saniyenin onda biri süresinde açılır.</p>

      <pre><code>// Static Site Generation (SSG) Avantajı
export async function generateStaticParams() {
  const posts = await getLocalPosts();
  return posts.map(post => ({ id: post.id }));
}</code></pre>

      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-fire" style="animation: pulse 1s infinite; color: #e60000; margin-right: 5px;"></i> CodeMareFi Tavsiyesi
        </strong>
        <p style="color: #ccc; margin-top: 10px;">Web siteniz ne kadar az dış bağımlılığa sahip olursa o kadar stabil çalışır. AdSense onayı için Google, hatasız çalışan ve kullanıcıya en hızlı tepkiyi veren statik veya iyi yapılandırılmış sunucu taraflı siteleri tercih eder.</p>
      </div>

      <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      </style>
    `
  }
];
