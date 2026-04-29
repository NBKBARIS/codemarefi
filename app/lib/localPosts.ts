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
  authorId?: string; // UUID — profil linki için
  commentCount: number;
}

// NBK BARIŞ kullanıcısının UUID'si (Supabase Authentication'dan alındı)
const NBK_USER_ID = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

// İkas kullanıcısının UUID'si
const IKAS_USER_ID = 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca';

export const localPosts: LocalPost[] = [
  {
    id: "1",
    title: "Discord Bot Gelistirme Rehberi 2026: Sifirdan Ileri Seviyeye",
    slug: "discord-bot-gelistirme-rehberi-2026",
    thumbnail: "/images/discord_bot_2026_1777229959529.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-26T12:00:00Z",
    updated: "2026-04-26T12:00:00Z",
    categories: ["Discord-bot-kodlari", "JavaScript", "Python"],
    commentCount: 0,
    content: `
      <div style="background: rgba(88, 101, 242, 0.1); border-left: 4px solid #5865F2; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <img src="/images/robot.svg" alt="robot" style="width: 48px; height: 48px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
        <strong style="color: #5865F2; font-size: 18px; vertical-align: middle;">Hos Geldiniz!</strong>
        <p style="margin-top: 10px; color: #ccc;">2026 yili itibarıyla Discord bot gelistirmede kullanilan en son teknolojiler, yeni Node.js surumleri ve discord.js v15 yapisini adim adim inceliyoruz.</p>
      </div>
      <p>Discord sunucularini yonetmek ve kullanicilara mukemmel bir deneyim sunmak icin kendi botunuzu kodlamak harika bir adimdir.</p>
      <h3 style="color: #fff; margin-top: 25px;">1. Gerekli Kurulumlar</h3>
      <p>Ilk olarak bilgisayarimizda Node.js yuklu olmalidir. Ardindan bir proje klasoru acip terminalden su komutlari giriyoruz:</p>
      <pre><code>npm init -y
npm install discord.js dotenv</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">2. Botu Ayaga Kaldirmak</h3>
      <pre><code>const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.on('ready', () => { console.log('Bot hazir!'); });
client.login('SENIN_BOT_TOKEN_BURAYA');</code></pre>
      <div style="background: #2b1d1d; border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #e60000;">ONEMLI UYARI:</strong> Bot token'inizi kesinlikle kimseyle paylasmayin!
      </div>
      <style>
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      </style>
    `
  },
  {
    id: "2",
    title: "Modern Web Tasarim Trendleri: UI/UX Standartlari",
    slug: "modern-web-tasarim-trendleri",
    thumbnail: "/images/web_design_trends_1777230327387.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-25T10:30:00Z",
    updated: "2026-04-25T10:30:00Z",
    categories: ["Html", "CSS", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-solid fa-palette" style="font-size: 48px; display: inline-block; animation: spin 4s linear infinite; color: #e60000;"></i>
        <h2 style="color: #fff; margin-top: 10px;">Gelecegin Tasarim Dili</h2>
      </div>
      <p>Web tasarimi hizla gelisiyor ve kullanicilarin sitelerde gecirdigi sureyi artirmak icin modern UI/UX teknikleri olmazsa olmaz hale geldi.</p>
      <h3 style="color: #fff; margin-top: 25px;">Glassmorphism (Cam Efekti)</h3>
      <pre><code>.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <i class="fa-solid fa-lightbulb" style="font-size: 20px; color: #00ff80;"></i>
        <strong style="color: #00ff80;">Biliyor muydunuz?</strong> Dogru kontrast oranlari kullanmak, sitenizin erisebilirligini artirir ve Google SEO puaniniza dogrudan olumlu etki eder.
      </div>
      <p style="margin-top: 20px;">Karanlik mod (Dark Mode) artik bir secnek degil, standart bir zorunluluktur.</p>
      <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      </style>
    `
  },
  {
    id: "3",
    title: "JavaScript ile Programlamaya Giris: Adim Adim Rehber",
    slug: "javascript-ile-programlamaya-giris",
    thumbnail: "/images/javascript_beginner_1777230673341.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-24T09:15:00Z",
    updated: "2026-04-24T09:15:00Z",
    categories: ["JavaScript", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="background: rgba(247, 223, 30, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; border: 1px solid #f7df1e;">
        <i class="fa-solid fa-bolt" style="font-size: 50px; display: inline-block; animation: pulse 2s infinite; color: #f7df1e;"></i>
        <h3 style="color: #f7df1e; margin: 10px 0 0 0;">JavaScript Dunyasina Hos Geldin!</h3>
      </div>
      <p>JavaScript, dunyanin en populer programlama dilidir. Internet tarayicilarindan sunuculara, mobil uygulamalardan yapay zeka modellerine kadar her yerde kullanilir.</p>
      <h3 style="color: #fff; margin-top: 25px;">Degiskenler ve Veri Tipleri</h3>
      <pre><code>const siteAdi = "CodeMareFi";
let makaleSayisi = 5;
console.log(siteAdi + " sitemize hos geldiniz!");</code></pre>
      <div style="display: flex; gap: 15px; margin-top: 30px; align-items: center; background: #1a1a1a; padding: 15px; border-radius: 6px;">
        <img src="/images/rocket.svg" alt="rocket" style="width: 48px; height: 48px;" />
        <div>
          <strong style="color: #fff;">Hemen Basla!</strong>
          <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">Tarayicinizin F12 tusuna basip Console sekmesine gecerek JavaScript kodlarinizi aninda deneyebilirsiniz.</p>
        </div>
      </div>
      <style>
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
      </style>
    `
  },
  {
    id: "4",
    title: "Vercel ve Next.js Kullanimi: Sifir Hata ile Yayin Yapmak",
    slug: "vercel-ve-nextjs-kullanimi",
    thumbnail: "/images/vercel_nextjs_1777230862288.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-23T14:45:00Z",
    updated: "2026-04-23T14:45:00Z",
    categories: ["Tavsiyemiz", "Populer", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 25px;">
        <i class="fa-solid fa-gear" style="font-size: 48px; display: inline-block; animation: spin 5s linear infinite; color: #aaa;"></i>
      </div>
      <p>React tabanli en guclu framework olan <strong>Next.js</strong> ve onun yaraticisi olan <strong>Vercel</strong> ile projeleri canliya almak oldukca kolaydir.</p>
      <h3 style="color: #fff; margin-top: 25px;">Statik Sitelerin Gucu</h3>
      <pre><code>export async function generateStaticParams() {
  const posts = await getLocalPosts();
  return posts.map(post => ({ id: post.id }));
}</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Tavsiyesi:</strong>
        <p style="color: #ccc; margin-top: 10px;">Web siteniz ne kadar az dis bagimliliga sahip olursa o kadar stabil calisir. AdSense onayi icin Google, hatasiz calisan siteleri tercih eder.</p>
      </div>
      <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      </style>
    `
  },
  {
    id: "5",
    title: "Discord Bot Client: Arayuz ile Kolayca Yonetmek",
    slug: "discord-bot-client-arayuz",
    thumbnail: "/discord-bot-banner.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-22T15:00:00Z",
    updated: "2026-04-22T15:00:00Z",
    categories: ["Discord-Bot-Tanitimi", "Projeler"],
    commentCount: 0,
    content: `
      <div style="background: rgba(88, 101, 242, 0.1); border-left: 4px solid #5865F2; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #5865F2; font-size: 18px;">Botunuzu Gorsel Olarak Yonetin!</strong>
        <p style="margin-top: 10px; color: #ccc;">Surekli terminal ekranina bakmaktan sikilmadiniz mi? Artik Discord botlarinizi modern bir web arayuzu (Dashboard) uzerinden kontrol edebilirsiniz.</p>
      </div>
      <p>Bot komutlarini kapatip acmak, veritabani yedegi almak veya sunucularinizdaki loglari takip etmek icin Discord.js ile React/Next.js teknolojilerini birlestirerek harika admin panelleri gelistirebilirsiniz.</p>
      <h3 style="color: #fff; margin-top: 25px;">API Tasarimi</h3>
      <pre><code>const express = require('express');
const app = express();
app.get('/api/stats', (req, res) => {
  res.json({ guilds: client.guilds.cache.size, ping: client.ws.ping });
});
app.listen(3000);</code></pre>
      <p style="margin-top: 20px;">Bu basit API sayesinde web sitemizden botumuzun guncel istatistiklerini cekebiliriz.</p>
    `
  },
  {
    id: "6",
    title: "Python ile Discord Bot Yapimi: Baslangiç Rehberi",
    slug: "python-discord-bot-yapimi",
    thumbnail: "/images/discord_bot_2026_1777229959529.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-21T14:00:00Z",
    updated: "2026-04-21T14:00:00Z",
    categories: ["Discord-bot-kodlari", "Python", "Tavsiyemiz"],
    commentCount: 0,
    content: `
      <div style="background: rgba(55, 178, 77, 0.1); border-left: 4px solid #37b24d; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #37b24d; font-size: 18px;">Python ile Bot Geliştirme</strong>
        <p style="margin-top: 10px; color: #ccc;">Python, Discord bot geliştirmek için en popüler dillerden biri! discord.py kütüphanesi ile kolayca başlayabilirsiniz.</p>
      </div>
      <h3 style="color: #fff; margin-top: 25px;">Kurulum</h3>
      <pre><code>pip install discord.py
pip install python-dotenv</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Basit Bot Kodu</h3>
      <pre><code>import discord
from discord.ext import commands

bot = commands.Bot(command_prefix='!', intents=discord.Intents.all())

@bot.event
async def on_ready():
    print(f'{bot.user} olarak giriş yapıldı!')

@bot.command()
async def merhaba(ctx):
    await ctx.send('Merhaba! Ben bir Discord botuyum!')

bot.run('TOKEN_BURAYA')</code></pre>
      <div style="background: #2b1d1d; border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #e60000;">ÖNEMLİ:</strong> Token'ınızı asla paylaşmayın ve .env dosyasında saklayın!
      </div>
    `
  },
  {
    id: "7",
    title: "CSS Grid ve Flexbox: Modern Layout Teknikleri",
    slug: "css-grid-flexbox-modern-layout",
    thumbnail: "/images/web_design_trends_1777230327387.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-20T11:30:00Z",
    updated: "2026-04-20T11:30:00Z",
    categories: ["CSS", "Html", "Tavsiyemiz"],
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-solid fa-layer-group" style="font-size: 48px; display: inline-block; color: #e60000;"></i>
        <h2 style="color: #fff; margin-top: 10px;">Modern CSS Layout Sistemleri</h2>
      </div>
      <p>CSS Grid ve Flexbox, modern web tasarımının temel taşlarıdır. Bu iki teknolojiyi öğrenerek responsive ve profesyonel web siteleri oluşturabilirsiniz.</p>
      <h3 style="color: #fff; margin-top: 25px;">Flexbox - Tek Boyutlu Layout</h3>
      <pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">CSS Grid - İki Boyutlu Layout</h3>
      <pre><code>.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">İPUCU:</strong> Flexbox tek satır/sütun için, Grid ise karmaşık düzenler için idealdir!
      </div>
    `
  },
  {
    id: "8",
    title: "Node.js ile RESTful API Geliştirme",
    slug: "nodejs-restful-api-gelistirme",
    thumbnail: "/images/javascript_beginner_1777230673341.png",
    author: "NBK BARIŞ",
    authorId: NBK_USER_ID,
    published: "2026-04-19T09:00:00Z",
    updated: "2026-04-19T09:00:00Z",
    categories: ["JavaScript", "Tavsiyemiz", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="background: rgba(104, 211, 145, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; border: 1px solid #68d391;">
        <i class="fa-solid fa-server" style="font-size: 50px; display: inline-block; color: #68d391;"></i>
        <h3 style="color: #68d391; margin: 10px 0 0 0;">Backend Geliştirme ile Tanışın!</h3>
      </div>
      <p>Node.js ve Express.js kullanarak profesyonel RESTful API'ler oluşturabilirsiniz. Bu rehberde temel CRUD işlemlerini öğreneceksiniz.</p>
      <h3 style="color: #fff; margin-top: 25px;">Express.js Kurulumu</h3>
      <pre><code>npm init -y
npm install express cors dotenv</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Basit API Örneği</h3>
      <pre><code>const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: ['Ali', 'Veli', 'Ayşe'] });
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  res.json({ message: \`\${name} eklendi!\` });
});

app.listen(3000, () => {
  console.log('API 3000 portunda çalışıyor!');
});</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Tavsiyesi:</strong>
        <p style="color: #ccc; margin-top: 10px;">API güvenliği için mutlaka JWT authentication ve rate limiting kullanın!</p>
      </div>
    `
  },
  {
    id: '10',
    title: 'React Server Components Nedir? Next.js 14 ile Kullanımı',
    slug: 'react-server-components-nextjs-14',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T10:00:00.000Z',
    updated: '2026-04-29T10:00:00.000Z',
    categories: ['Web-Tasarım', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Next.js 14 ile birlikte React ekosisteminde köklü bir değişiklik yaşandı. Artık bileşenlerimiz varsayılan olarak sunucuda çalışıyor. Peki bu ne anlama geliyor ve projelerimizde nasıl kullanabiliriz?</p>
      <h3 style="color: #fff; margin-top: 25px;">React Server Components (RSC) Nedir?</h3>
      <p>Server Components, adından da anlaşılacağı gibi sadece sunucuda render edilen React bileşenleridir. Bu bileşenlerin kodları ve içerdikleri kütüphaneler istemciye (tarayıcıya) gönderilmez. Bu sayede JavaScript bundle boyutu ciddi oranda düşer.</p>
      <ul>
        <li>Daha hızlı sayfa yüklenmesi (Zero Bundle Size)</li>
        <li>Doğrudan veritabanına erişim</li>
        <li>Daha iyi SEO performansı</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">Nasıl Kullanılır?</h3>
      <pre><code>import { db } from '@/lib/db';

// Bu bileşen sadece sunucuda çalışır
export default async function PostList() {
  const posts = await db.query('SELECT * FROM posts');
  
  return (
    &lt;ul&gt;
      {posts.map(post =&gt; (
        &lt;li key={post.id}&gt;{post.title}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
      <p>Gördüğünüz gibi, doğrudan SQL sorgusu yazabiliyoruz. Herhangi bir API endpoint'i oluşturmamıza gerek kalmıyor.</p>
    `
  },
  {
    id: '11',
    title: 'Supabase ile Backend Yazmadan Proje Geliştirmek',
    slug: 'supabase-backend-yazmadan-proje',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-28T15:30:00.000Z',
    updated: '2026-04-28T15:30:00.000Z',
    categories: ['Yazılım-Haberleri', 'Siber-Güvenlik'],
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Günümüzde hızlı proje geliştirmek ve hemen canlıya almak (time-to-market) çok önemli. Supabase, açık kaynaklı bir Firebase alternatifi olarak tam da bu noktada hayat kurtarıyor.</p>
      <h3 style="color: #fff; margin-top: 25px;">Neden Supabase?</h3>
      <p>Supabase arka planda standart bir PostgreSQL veritabanı kullanır. Bu demek oluyor ki verileriniz asla özel bir sisteme kilitli kalmaz (vendor lock-in yok). İstediğiniz zaman veritabanını dışa aktarıp kendi sunucunuza geçebilirsiniz.</p>
      <h3 style="color: #fff; margin-top: 25px;">Güvenlik (Row Level Security)</h3>
      <p>Frontend üzerinden doğrudan veritabanına sorgu atıyorsak güvenlik nasıl sağlanıyor? Cevap: Row Level Security (RLS).</p>
      <pre><code>// Sadece kendi gönderilerini silebilir kuralı (SQL)
CREATE POLICY "Kullanıcılar kendi gönderilerini silebilir"
ON user_posts
FOR DELETE
USING (auth.uid() = author_id);</code></pre>
      <p>Bu politika sayesinde, frontend tarafından gönderilen silme istekleri Supabase tarafından otomatik olarak denetlenir. Eğer oturum açmış kullanıcının ID'si (auth.uid), gönderinin yazar ID'sine eşit değilse işlem reddedilir.</p>
    `
  },
  {
    id: '12',
    title: 'Modern CSS Frameworkleri: Tailwind vs Bootstrap 2026',
    slug: 'tailwind-vs-bootstrap-2026',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-27T14:15:00.000Z',
    updated: '2026-04-27T14:15:00.000Z',
    categories: ['Web-Tasarım', 'CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Web tasarım dünyasında yıllardır süren bir tartışma var: Utility-first (Tailwind) mi yoksa Component-based (Bootstrap) frameworkler mi daha iyi? 2026 yılında bu durum nereye geldi?</p>
      <h3 style="color: #fff; margin-top: 25px;">Tailwind CSS'in Yükselişi</h3>
      <p>Tailwind, size hazır bileşenler vermek yerine CSS özelliklerini sınıflar aracılığıyla kullanmanızı sağlar. Başlarda HTML'i kirlettiği düşünülse de, React ve Vue gibi komponent tabanlı kütüphanelerle mükemmel bir uyum yakaladı.</p>
      <pre><code>&lt;button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"&gt;
  Tıkla
&lt;/button&gt;</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Bootstrap Hala Yaşıyor mu?</h3>
      <p>Evet, özellikle kurumsal projelerde ve hızlı admin paneli geliştirmelerinde Bootstrap hala vazgeçilmez. Ancak modern ve özgün tasarımlar arayan startup'lar çoktan Tailwind'e geçiş yaptı bile.</p>
    `
  },
  {
    id: '13',
    title: 'Yapay Zeka Destekli Kodlama: Geleceğin Yazılımcısı Olmak',
    slug: 'yapay-zeka-destekli-kodlama',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-26T09:45:00.000Z',
    updated: '2026-04-26T09:45:00.000Z',
    categories: ['Yapay-Zeka', 'Genel Konular'],
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Yapay zeka araçları artık kod yazma sürecimizin ayrılmaz bir parçası oldu. ChatGPT, Copilot ve diğer yapay zeka asistanları işimizi elimizden mi alacak, yoksa bizi birer süper kahramana mı dönüştürecek?</p>
      <h3 style="color: #fff; margin-top: 25px;">Kod Yazmaktan Sorun Çözmeye Geçiş</h3>
      <p>Gelecekte yazılımcıların ana görevi sadece kod yazmak değil, sistemleri tasarlamak ve yapay zekaya doğru komutları (prompt) vermek olacak. Syntaks hatalarıyla uğraşmak yerine mimari kararlara odaklanacağız.</p>
      <blockquote style="border-left: 4px solid #e60000; padding-left: 15px; margin: 20px 0; font-style: italic; color: #aaa;">
        "Yapay zeka yazılımcıların yerini almayacak, yapay zeka kullanan yazılımcılar kullanmayanların yerini alacak."
      </blockquote>
      <h3 style="color: #fff; margin-top: 25px;">Kendimizi Nasıl Geliştirmeliyiz?</h3>
      <ul>
        <li>Temel algoritma ve veri yapılarını iyi öğrenin.</li>
        <li>Sistem tasarımı (System Design) konularına ağırlık verin.</li>
        <li>AI asistanlarını birer yardımcı olarak günlük iş akışınıza entegre edin.</li>
      </ul>
    `
  },
  {
    id: '14',
    title: 'Next.js ile Server Actions Kullanımı (Detaylı Rehber)',
    slug: 'nextjs-server-actions-kullanimi',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T12:00:00.000Z',
    updated: '2026-04-29T12:00:00.000Z',
    categories: ['Web-Tasarım', 'JavaScript', 'Tavsiyemiz'],
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Next.js'in en güçlü özelliklerinden biri olan <strong>Server Actions</strong>, frontend üzerinden doğrudan veritabanı işlemlerini güvenli bir şekilde yapmamızı sağlıyor. Geleneksel API endpoint'leri yazma devrini kapatan bu teknolojiyi projelerinize nasıl entegre edersiniz?</p>
      
      <h3 style="color: #fff; margin-top: 25px;">Server Action Nedir?</h3>
      <p>Kısaca özetlemek gerekirse; React bileşenleri içinden çağrılabilen ancak sadece ve sadece <strong>sunucu tarafında (Server-side)</strong> çalışan asenkron fonksiyonlardır. Bu sayede API route oluşturmanıza, fetch() kullanmanıza veya state yönetimiyle form verisi taşımanıza gerek kalmaz.</p>
      
      <h3 style="color: #fff; margin-top: 25px;">Basit Bir Form Örneği</h3>
      <p>Geleneksel yöntemde bir iletişim formu yapmak için önce bir API yazıp sonra <code>onSubmit</code> ile o API'ye istek atardık. Server Actions ile olay şu kadar basit:</p>
      <pre><code>// app/actions.ts
'use server'

export async function sendMessage(formData: FormData) {
  const message = formData.get('message');
  
  // Doğrudan veritabanına bağlan ve kaydet
  await db.messages.insert({ text: message });
}</code></pre>
      
      <pre><code>// app/components/Form.tsx
import { sendMessage } from '../actions'

export default function ContactForm() {
  return (
    &lt;form action={sendMessage}&gt;
      &lt;input type="text" name="message" required /&gt;
      &lt;button type="submit"&gt;Gönder&lt;/button&gt;
    &lt;/form&gt;
  )
}</code></pre>

      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Tavsiyesi:</strong>
        <p style="color: #ccc; margin-top: 10px;">Server Actions kullanırken, fonksiyonlarınızın içine mutlaka <strong>yetkilendirme (authorization)</strong> ve <strong>veri doğrulama (validation)</strong> mantığını eklemeyi unutmayın. Zira bu fonksiyonlar dışarıdan doğrudan çağrılabilir endpoint'lere dönüşürler.</p>
      </div>
    `
  },
  {
    id: '15',
    title: 'Discord.js v14 ile Müzik Botu Altyapısı Oluşturma',
    slug: 'discord-js-v14-muzik-botu-altyapisi',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T11:00:00.000Z',
    updated: '2026-04-29T11:00:00.000Z',
    categories: ['Discord-bot-kodları', 'Discord-Hazır-Bot-Altyapılar', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Selamlar sevgili CodeMareFi üyeleri! Bugün, Discord'un vazgeçilmezi olan Müzik botlarının perde arkasına bakıyoruz. Discord.js v14 ile güncel, stabil ve kesintisiz müzik çalan bir bot altyapısını nasıl kuracağınızı adım adım anlatacağım.</p>
      
      <h3 style="color: #fff; margin-top: 25px;">Neden @discordjs/voice Kullanmalıyız?</h3>
      <p>Eskiden ytdl-core gibi kütüphaneleri doğrudan ses kanalına bağlardık. Artık Discord'un resmi ses kütüphanesi olan <code>@discordjs/voice</code> ile bağlantı kurmak çok daha sağlıklı ve performanslı. Üstelik bağlantı kopmalarına karşı kendi içinde muazzam bir yönetim sistemi barındırıyor.</p>
      
      <h3 style="color: #fff; margin-top: 25px;">Gerekli Kütüphaneler</h3>
      <p>Projenizi oluşturduktan sonra şu modülleri kurun:</p>
      <pre><code>npm install discord.js @discordjs/voice ffmpeg-static libsodium-wrappers play-dl</code></pre>
      <p>Burada <strong>play-dl</strong> kütüphanesi oldukça kritik, zira YouTube üzerinden veri çekerken limitlere takılmamanızı ve yüksek kalitede ses elde etmenizi sağlıyor.</p>
      
      <h3 style="color: #fff; margin-top: 25px;">Ses Kanalına Bağlanma</h3>
      <pre><code>const { joinVoiceChannel } = require('@discordjs/voice');

function baglan(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
}</code></pre>

      <p>Müzik botu geliştirmek sabır ister. Kuyruk (Queue) sistemi yazmak, sıradaki şarkıya geçiş (skip) ve durdurma (stop) gibi özellikleri eklemek kodunuzun karmaşıklığını artıracaktır. Eğer sıfırdan yazmak istemiyorsanız sitemizdeki Hazır Bot Altyapıları bölümünden tam teşekküllü projelere göz atabilirsiniz.</p>
    `
  },
  {
    id: '16',
    title: 'Blogger\'dan Next.js\'e Geçiş Serüvenimiz: Neden Bu Kararı Aldık?',
    slug: 'bloggerdan-nextjse-gecis-seruvenimiz',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T10:00:00.000Z',
    updated: '2026-04-29T10:00:00.000Z',
    categories: ['Genel Konular', 'Blogger-Konuları', 'Popüler'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Yıllarca Blogger altyapısında "CodeMareFi" adıyla sizlere hizmet verdik. Blogger bizim için harika bir okul oldu, yüzlerce özel eklenti yazdık, temalar tasarladık. Ancak büyüyen kitlemiz ve artan ihtiyaçlarımız bizi yeni bir arayışa itti.</p>
      
      <h3 style="color: #fff; margin-top: 25px;">Neden Next.js? Neden Supabase?</h3>
      <p>Blogger'ın kısıtlamaları yüzünden üyelerin kendi aralarında etkileşime girebileceği, yazı paylaşabileceği ve anlık sohbet edebileceği sistemleri kurmak neredeyse imkansızdı. Biz de ipleri tamamen kendi elimize almak istedik.</p>
      <ul>
        <li><strong>Performans:</strong> Next.js'in App Router mimarisi sayesinde sitemiz artık ışık hızında çalışıyor.</li>
        <li><strong>Özgürlük:</strong> Üye sistemi, rütbeler, liderlik tablosu gibi modülleri Supabase veritabanımız ile sıfırdan sorunsuzca kodladık.</li>
        <li><strong>Görünüm:</strong> Eski Blogger tasarımımızın DNA'sını koruyarak (kırmızı-siyah renk paleti), onu 2026 yılı standartlarına yakışır modern ve şık bir arayüze kavuşturduk.</li>
      </ul>
      
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">Gelecek Planlarımız:</strong> 
        Yakın zamanda kullanıcılar arası özel mesajlaşma ve kod snippet'lerini interaktif olarak test edebileceğiniz canlı bir editörü sitemize entegre edeceğiz. Bizimle kalın!
      </div>
    `
  },
  {
    id: '17',
    title: 'Ücretsiz VDS Hakkında Detaylar',
    slug: 'ucretsiz-vds-hakkinda-detaylar',
    author: 'ikas',
    authorId: IKAS_USER_ID,
    published: '2026-04-28T14:00:00.000Z',
    updated: '2026-04-28T14:00:00.000Z',
    categories: ['Tavsiyemiz', 'Genel Konular'],
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="background: rgba(88, 101, 242, 0.1); border-left: 4px solid #5865F2; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #5865F2; font-size: 18px;">Ücretsiz VDS Konusunda Hazırladığımız Bu Rehberde</strong>
        <p style="margin-top: 10px; color: #ccc;">Bu konu hakkında daha fazla bilgi almak için yorum bölümünden sorularınızı iletebilirsiniz. Topluluğumuz size yardımcı olmaktan memnuniyet duyar.</p>
      </div>
      <p>Ücretsiz VDS konusunda hazırladığımız bu rehberde, size en iyi ücretsiz VDS sağlayıcılarını ve bunları nasıl kullanabileceğinizi anlatacağız.</p>
      <h3 style="color: #fff; margin-top: 25px;">VDS Nedir?</h3>
      <p>VDS (Virtual Dedicated Server), sanal özel sunucu anlamına gelir. Kendi sunucunuzu kurmak ve yönetmek için ideal bir çözümdür.</p>
      <h3 style="color: #fff; margin-top: 25px;">Ücretsiz VDS Sağlayıcıları</h3>
      <ul>
        <li>Oracle Cloud - Always Free Tier</li>
        <li>Google Cloud Platform - 300$ Kredi</li>
        <li>AWS Free Tier - 12 Ay Ücretsiz</li>
      </ul>
      <div style="background: #2b1d1d; border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #e60000;">UYARI:</strong> Ücretsiz servislerde kaynak limitleri vardır. Projenizin ihtiyaçlarına göre seçim yapın!
      </div>
    `
  },
  {
    id: '18',
    title: 'En Ucuz Şekilde Domain Satın Alma Rehberi',
    slug: 'en-ucuz-sekilde-domain-satin-alma',
    author: 'ikas',
    authorId: IKAS_USER_ID,
    published: '2026-04-27T16:30:00.000Z',
    updated: '2026-04-27T16:30:00.000Z',
    categories: ['Tavsiyemiz', 'Web-Tasarım'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-solid fa-globe" style="font-size: 48px; display: inline-block; color: #e60000;"></i>
        <h2 style="color: #fff; margin-top: 10px;">Domain Alırken Dikkat Edilmesi Gerekenler</h2>
      </div>
      <p>Web siteniz için domain almak istiyorsanız, en uygun fiyatlı seçenekleri bu rehberde bulabilirsiniz.</p>
      <h3 style="color: #fff; margin-top: 25px;">Popüler Domain Sağlayıcıları</h3>
      <ul>
        <li><strong>Namecheap:</strong> İlk yıl için çok uygun fiyatlar</li>
        <li><strong>Porkbun:</strong> Gizlilik koruması ücretsiz</li>
        <li><strong>Cloudflare Registrar:</strong> Maliyet fiyatına domain</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">Domain Uzantısı Seçimi</h3>
      <p>.com uzantısı en popüler olsa da, .dev, .io, .tech gibi alternatifler de projeleriniz için harika seçenekler olabilir.</p>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">İPUCU:</strong> Domain alırken otomatik yenileme ayarlarını kontrol edin. Bazı sağlayıcılar ilk yıl ucuz, sonraki yıllarda pahalı olabiliyor!
      </div>
    `
  },
  {
    id: '19',
    title: 'TypeScript ile Tip Güvenli Kod Yazmak: Başlangıç Rehberi',
    slug: 'typescript-tip-guvenli-kod-yazmak',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-30T10:00:00.000Z',
    updated: '2026-04-30T10:00:00.000Z',
    categories: ['JavaScript', 'Genel Konular', 'Tavsiyemiz'],
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="background: rgba(49, 120, 198, 0.1); border-left: 4px solid #3178c6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #3178c6; font-size: 18px;">TypeScript ile Tanışın!</strong>
        <p style="margin-top: 10px; color: #ccc;">JavaScript'in süper güçlü versiyonu olan TypeScript, kodunuzu daha güvenli ve bakımı kolay hale getirir.</p>
      </div>
      <p>JavaScript harika bir dil ama büyük projelerde tip hatalarıyla uğraşmak can sıkıcı olabiliyor. TypeScript tam da bu noktada devreye giriyor!</p>
      <h3 style="color: #fff; margin-top: 25px;">TypeScript Neden Kullanmalıyız?</h3>
      <ul>
        <li><strong>Tip Güvenliği:</strong> Hataları kod yazarken yakala, runtime'da değil</li>
        <li><strong>IntelliSense:</strong> VS Code'da muhteşem otomatik tamamlama</li>
        <li><strong>Refactoring:</strong> Büyük kod tabanlarında güvenle değişiklik yap</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">İlk TypeScript Kodunuz</h3>
      <pre><code>// Basit bir fonksiyon
function selamla(isim: string): string {
  return \`Merhaba, \${isim}!\`;
}

// Tip hatası verir!
selamla(123); // ❌ Hata: number, string değil

// Doğru kullanım
selamla("CodeMareFi"); // ✅ Çalışır</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Tavsiyesi:</strong>
        <p style="color: #ccc; margin-top: 10px;">Yeni projelerinizde direkt TypeScript kullanın. Başta biraz zor gelse de, uzun vadede çok zaman kazandırır!</p>
      </div>
    `
  },
  {
    id: '20',
    title: 'Git ve GitHub Kullanımı: Versiyon Kontrolünde Ustalaşmak',
    slug: 'git-github-kullanimi-versiyon-kontrolu',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-30T09:00:00.000Z',
    updated: '2026-04-30T09:00:00.000Z',
    categories: ['Genel Konular', 'Tavsiyemiz'],
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-brands fa-github" style="font-size: 48px; display: inline-block; color: #fff;"></i>
        <h2 style="color: #fff; margin-top: 10px;">Git ile Kod Yönetimi</h2>
      </div>
      <p>Profesyonel yazılım geliştirmede Git kullanmak artık bir zorunluluk. Peki Git nedir ve nasıl kullanılır?</p>
      <h3 style="color: #fff; margin-top: 25px;">Git Nedir?</h3>
      <p>Git, kodunuzun her değişikliğini kaydeden ve gerektiğinde eski versiyonlara dönmenizi sağlayan bir versiyon kontrol sistemidir.</p>
      <h3 style="color: #fff; margin-top: 25px;">Temel Git Komutları</h3>
      <pre><code># Yeni bir repo başlat
git init

# Değişiklikleri kaydet
git add .
git commit -m "İlk commit"

# GitHub'a yükle
git remote add origin https://github.com/kullanici/repo.git
git push -u origin main</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Branch (Dal) Kullanımı</h3>
      <pre><code># Yeni bir dal oluştur
git checkout -b yeni-ozellik

# Değişiklikleri yap ve commit et
git add .
git commit -m "Yeni özellik eklendi"

# Ana dala birleştir
git checkout main
git merge yeni-ozellik</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">İPUCU:</strong> Her özellik için ayrı branch açın. Bu sayede main branch'iniz her zaman stabil kalır!
      </div>
    `
  },
  {
    id: '21',
    title: 'MongoDB vs PostgreSQL: Hangi Veritabanını Seçmeliyim?',
    slug: 'mongodb-vs-postgresql-veritabani-secimi',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-30T08:00:00.000Z',
    updated: '2026-04-30T08:00:00.000Z',
    categories: ['Genel Konular', 'Yazılım-Haberleri'],
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <p>Yeni bir proje başlatırken en önemli kararlardan biri veritabanı seçimi. MongoDB mu, PostgreSQL mi? İşte detaylı karşılaştırma!</p>
      <h3 style="color: #fff; margin-top: 25px;">MongoDB - NoSQL Veritabanı</h3>
      <p>MongoDB, döküman tabanlı (document-based) bir NoSQL veritabanıdır. Verilerinizi JSON benzeri formatta saklar.</p>
      <h4 style="color: #2ea44f;">Avantajları:</h4>
      <ul>
        <li>Esnek şema yapısı - istediğiniz zaman alan ekleyebilirsiniz</li>
        <li>Hızlı prototipleme için ideal</li>
        <li>Yatay ölçeklendirme (horizontal scaling) kolay</li>
      </ul>
      <h4 style="color: #e60000;">Dezavantajları:</h4>
      <ul>
        <li>Karmaşık ilişkisel sorgular zor</li>
        <li>ACID garantisi sınırlı (transaction desteği var ama)</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">PostgreSQL - İlişkisel Veritabanı</h3>
      <p>PostgreSQL, güçlü ve açık kaynaklı bir SQL veritabanıdır. Veri bütünlüğü konusunda çok katı.</p>
      <h4 style="color: #2ea44f;">Avantajları:</h4>
      <ul>
        <li>Güçlü ACID garantisi</li>
        <li>Karmaşık JOIN sorguları mükemmel çalışır</li>
        <li>JSON desteği ile NoSQL gibi de kullanılabilir</li>
      </ul>
      <h4 style="color: #e60000;">Dezavantajları:</h4>
      <ul>
        <li>Şema değişiklikleri daha zahmetli</li>
        <li>Yatay ölçeklendirme MongoDB'ye göre daha zor</li>
      </ul>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Tavsiyesi:</strong>
        <p style="color: #ccc; margin-top: 10px;">E-ticaret, finans gibi veri bütünlüğünün kritik olduğu projelerde PostgreSQL, sosyal medya, blog gibi esnek yapılar için MongoDB tercih edin!</p>
      </div>
    `
  },
  {
    id: '22',
    title: 'Docker ile Konteyner Teknolojisine Giriş',
    slug: 'docker-konteyner-teknolojisine-giris',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T16:00:00.000Z',
    updated: '2026-04-29T16:00:00.000Z',
    categories: ['Genel Konular', 'Tavsiyemiz'],
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196f3; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #2196f3; font-size: 18px;">Docker ile Tanışın!</strong>
        <p style="margin-top: 10px; color: #ccc;">"Benim bilgisayarımda çalışıyor" sorununa son veren teknoloji: Docker!</p>
      </div>
      <p>Docker, uygulamalarınızı konteynerler içinde çalıştırmanızı sağlayan bir platformdur. Peki bu ne demek?</p>
      <h3 style="color: #fff; margin-top: 25px;">Docker Nedir?</h3>
      <p>Basitçe söylemek gerekirse, Docker uygulamanızı ve tüm bağımlılıklarını (dependencies) bir paket içine koyar. Bu paket her yerde aynı şekilde çalışır.</p>
      <h3 style="color: #fff; margin-top: 25px;">İlk Docker Container'ınız</h3>
      <pre><code># Node.js uygulaması için Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]</code></pre>
      <pre><code># Image oluştur
docker build -t my-app .

# Container çalıştır
docker run -p 3000:3000 my-app</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Docker Compose ile Çoklu Servis</h3>
      <pre><code>version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">İPUCU:</strong> Docker öğrenmek başta zor gelebilir ama production'da hayat kurtarır. Mutlaka öğrenin!
      </div>
    `
  },
  {
    id: '23',
    title: 'Web Güvenliği: XSS ve SQL Injection Saldırılarından Korunma',
    slug: 'web-guvenligi-xss-sql-injection-korunma',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T15:00:00.000Z',
    updated: '2026-04-29T15:00:00.000Z',
    categories: ['Siber-Güvenlik', 'Genel Konular', 'Tavsiyemiz'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="background: rgba(230, 0, 0, 0.1); border-left: 4px solid #e60000; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #e60000; font-size: 18px;">⚠️ GÜVENLİK ÖNEMLİDİR!</strong>
        <p style="margin-top: 10px; color: #ccc;">Web uygulamanız ne kadar güvenli? Bu rehberde en yaygın saldırı türlerinden nasıl korunacağınızı öğreneceksiniz.</p>
      </div>
      <p>Web güvenliği, her geliştiricinin bilmesi gereken kritik bir konu. İşte en yaygın saldırı türleri ve korunma yöntemleri!</p>
      <h3 style="color: #fff; margin-top: 25px;">1. XSS (Cross-Site Scripting) Saldırıları</h3>
      <p>Saldırgan, sitenize kötü amaçlı JavaScript kodu enjekte eder.</p>
      <h4 style="color: #e60000;">Kötü Örnek:</h4>
      <pre><code>// Kullanıcı inputunu direkt HTML'e yazmak
document.getElementById('output').innerHTML = userInput; // ❌ TEHLİKELİ!</code></pre>
      <h4 style="color: #2ea44f;">Güvenli Örnek:</h4>
      <pre><code>// Input'u escape et
document.getElementById('output').textContent = userInput; // ✅ GÜVENLİ

// React kullanıyorsan zaten korumalı
&lt;div&gt;{userInput}&lt;/div&gt; // ✅ GÜVENLİ</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">2. SQL Injection Saldırıları</h3>
      <p>Saldırgan, SQL sorgularınıza kötü amaçlı kod enjekte eder.</p>
      <h4 style="color: #e60000;">Kötü Örnek:</h4>
      <pre><code>// String concatenation ile sorgu
const query = \`SELECT * FROM users WHERE email = '\${email}'\`; // ❌ TEHLİKELİ!</code></pre>
      <h4 style="color: #2ea44f;">Güvenli Örnek:</h4>
      <pre><code>// Parameterized query kullan
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [email]); // ✅ GÜVENLİ</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">3. CSRF (Cross-Site Request Forgery)</h3>
      <p>Kullanıcının oturumunu kullanarak istemediği işlemler yaptırılır.</p>
      <h4 style="color: #2ea44f;">Korunma:</h4>
      <ul>
        <li>CSRF token kullan</li>
        <li>SameSite cookie attribute'ü kullan</li>
        <li>Kritik işlemlerde şifre doğrulaması iste</li>
      </ul>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Tavsiyesi:</strong>
        <p style="color: #ccc; margin-top: 10px;">Güvenlik bir özellik değil, zorunluluktur! Her zaman kullanıcı inputlarına güvenmeyin ve validate edin.</p>
      </div>
    `
  },
  {
    id: '24',
    title: 'Responsive Web Tasarım: Mobil Uyumlu Siteler Yapmak',
    slug: 'responsive-web-tasarim-mobil-uyumlu',
    author: 'NBK BARIŞ',
    authorId: NBK_USER_ID,
    published: '2026-04-29T14:00:00.000Z',
    updated: '2026-04-29T14:00:00.000Z',
    categories: ['Web-Tasarım', 'CSS', 'Html', 'Tavsiyemiz'],
    thumbnail: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop',
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-solid fa-mobile-screen-button" style="font-size: 48px; display: inline-block; color: #e60000;"></i>
        <h2 style="color: #fff; margin-top: 10px;">Mobil Öncelikli Tasarım</h2>
      </div>
      <p>Günümüzde internet trafiğinin %60'ından fazlası mobil cihazlardan geliyor. Siteniz mobil uyumlu değilse, kullanıcılarınızın yarısını kaybediyorsunuz!</p>
      <h3 style="color: #fff; margin-top: 25px;">Media Queries ile Responsive Tasarım</h3>
      <pre><code>/* Mobil öncelikli yaklaşım */
.container {
  width: 100%;
  padding: 15px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1200px) {
  .container {
    width: 1140px;
  }
}</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Flexbox ile Esnek Layout</h3>
      <pre><code>.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px; /* Minimum 300px, esnek büyüme */
}</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Viewport Meta Tag</h3>
      <pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">İPUCU:</strong> Tasarımınızı yaparken önce mobil için tasarlayın, sonra büyük ekranlara uyarlayın (Mobile-First yaklaşımı)!
      </div>
    `
  }
];
