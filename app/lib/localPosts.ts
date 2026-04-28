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
    title: "Discord Bot Gelistirme Rehberi 2026: Sifirdan Ileri Seviyeye",
    slug: "discord-bot-gelistirme-rehberi-2026",
    thumbnail: "/images/discord_bot_2026_1777229959529.png",
    author: "NBK BARIS",
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
    author: "NBK BARIS",
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
    author: "NBK BARIS",
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
    author: "NBK BARIS",
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
    author: "NBK BARIS",
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
  }
];
