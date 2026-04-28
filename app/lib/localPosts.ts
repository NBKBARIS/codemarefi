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
    title: "Discord Bot GeliÅŸtirme Rehberi 2026: SÄ±fÄ±rdan Ä°leri Seviyeye",
    slug: "discord-bot-gelistirme-rehberi-2026",
    thumbnail: "/images/discord_bot_2026_1777229959529.png",
    author: "NBK BARIÅ",
    published: "2026-04-26T12:00:00Z",
    updated: "2026-04-26T12:00:00Z",
    categories: ["Discord-bot-kodlarÄ±", "JavaScript", "Python"],
    commentCount: 0,
    content: `
      <div style="background: rgba(88, 101, 242, 0.1); border-left: 4px solid #5865F2; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <img src="/images/robot.svg" alt="robot" style="width: 48px; height: 48px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
        <strong style="color: #5865F2; font-size: 18px; vertical-align: middle;">HoÅŸ Geldiniz!</strong> 
        <p style="margin-top: 10px; color: #ccc;">2026 yÄ±lÄ± itibarÄ±yla Discord bot geliÅŸtirmede kullanÄ±lan en son teknolojiler, yeni Node.js sÃ¼rÃ¼mleri ve discord.js v15 yapÄ±sÄ±nÄ± adÄ±m adÄ±m inceliyoruz.</p>
      </div>

      <p>Discord sunucularÄ±nÄ± yÃ¶netmek ve kullanÄ±cÄ±lara mÃ¼kemmel bir deneyim sunmak iÃ§in kendi botunuzu kodlamak harika bir adÄ±mdÄ±r. Kodlamaya yeni baÅŸlayanlar iÃ§in bile oldukÃ§a anlaÅŸÄ±lÄ±r olan JavaScript (Node.js) altyapÄ±sÄ± sayesinde kendi botunuzu Ã§ok kÄ±sa sÃ¼rede aktif edebilirsiniz.</p>

      <h3 style="color: #fff; margin-top: 25px;">1. Gerekli Kurulumlar</h3>
      <p>Ä°lk olarak bilgisayarÄ±mÄ±zda Node.js yÃ¼klÃ¼ olmalÄ±dÄ±r. ArdÄ±ndan bir proje klasÃ¶rÃ¼ aÃ§Ä±p terminalden ÅŸu komutlarÄ± giriyoruz:</p>
      <pre><code>npm init -y\nnpm install discord.js dotenv</code></pre>

      <p>Bu komutlar projeyi baÅŸlatÄ±r ve temel kÃ¼tÃ¼phaneleri indirir.</p>

      <h3 style="color: #fff; margin-top: 25px;">2. Botu AyaÄŸa KaldÄ±rmak</h3>
      <p>Ana dosyamÄ±z olan <code>index.js</code> dosyasÄ±nÄ± oluÅŸturup ÅŸu kodlarÄ± ekliyoruz:</p>
      <pre><code>const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
  console.log(\`âœ… Bot \${client.user.tag} olarak giriÅŸ yaptÄ±!\`);
});

client.login('SENIN_BOT_TOKEN_BURAYA');</code></pre>

      <div style="background: #2b1d1d; border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <img src="/images/warning.svg" alt="warning" style="width: 32px; height: 32px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
        <strong style="color: #e60000;">Ã–NEMLÄ° UYARI:</strong> Bot token'Ä±nÄ±zÄ± kesinlikle kimseyle paylaÅŸmayÄ±n ve GitHub gibi aÃ§Ä±k platformlara yÃ¼klemeyin.
      </div>
      
      <p style="margin-top: 20px;">Bu kodlar botunuzu Ã§evrimiÃ§i yapacaktÄ±r. Daha fazlasÄ± iÃ§in sitemizi takipte kalÄ±n!</p>

      <style>
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      </style>
    `
  },
  {
    id: "2",
    title: "Modern Web TasarÄ±m Trendleri: UI/UX StandartlarÄ±",
    slug: "modern-web-tasarim-trendleri",
    thumbnail: "/images/web_design_trends_1777230327387.png",
    author: "NBK BARIÅ",
    published: "2026-04-25T10:30:00Z",
    updated: "2026-04-25T10:30:00Z",
    categories: ["Html", "CSS", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <i class="fa-solid fa-palette" style="font-size: 48px; display: inline-block; animation: spin 4s linear infinite; color: #e60000;"></i>
        <h2 style="color: #fff; margin-top: 10px;">GeleceÄŸin TasarÄ±m Dili</h2>
      </div>

      <p>Web tasarÄ±mÄ± hÄ±zla geliÅŸiyor ve kullanÄ±cÄ±larÄ±n sitelerde geÃ§irdiÄŸi sÃ¼reyi artÄ±rmak iÃ§in modern UI/UX teknikleri olmazsa olmaz hale geldi. Bu makalemizde 2026 yÄ±lÄ±nda en Ã§ok konuÅŸulan web tasarÄ±m trendlerine gÃ¶z atacaÄŸÄ±z.</p>

      <h3 style="color: #fff; margin-top: 25px;">Glassmorphism (Cam Efekti)</h3>
      <p>Arka planÄ± bulanÄ±klaÅŸtÄ±ran ve yarÄ± saydam katmanlar oluÅŸturan bu tasarÄ±m stili hala zirvede. Modern iÅŸletim sistemlerinin de varsayÄ±lan olarak benimsediÄŸi bu stil, CSS ile oldukÃ§a kolay yapÄ±labiliyor:</p>
      <pre><code>.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}</code></pre>

      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <i class="fa-solid fa-lightbulb" style="font-size: 20px; display: inline-block; animation: bounce 2s infinite; color: #00ff80;"></i>
        <strong style="color: #00ff80;">Biliyor muydunuz?</strong> DoÄŸru kontrast oranlarÄ±nÄ± kullanmak, sitenizin eriÅŸilebilirliÄŸini artÄ±rÄ±r ve Google SEO puanÄ±nÄ±za doÄŸrudan olumlu etki eder.
      </div>
      
      <p style="margin-top: 20px;">KaranlÄ±k mod (Dark Mode) artÄ±k bir seÃ§enek deÄŸil, standart bir zorunluluktur. Web projelerinizde mutlaka karanlÄ±k mod desteÄŸi barÄ±ndÄ±rmalÄ±sÄ±nÄ±z.</p>
      
      <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      </style>
    `
  },
  {
    id: "3",
    title: "JavaScript ile Programlamaya GiriÅŸ: AdÄ±m AdÄ±m Rehber",
    slug: "javascript-ile-programlamaya-giris",
    thumbnail: "/images/javascript_beginner_1777230673341.png",
    author: "NBK BARIÅ",
    published: "2026-04-24T09:15:00Z",
    updated: "2026-04-24T09:15:00Z",
    categories: ["JavaScript", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="background: rgba(247, 223, 30, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; border: 1px solid #f7df1e;">
        <i class="fa-solid fa-bolt" style="font-size: 50px; display: inline-block; animation: pulse 2s infinite; color: #f7df1e;"></i>
        <h3 style="color: #f7df1e; margin: 10px 0 0 0;">JavaScript DÃ¼nyasÄ±na HoÅŸ Geldin!</h3>
      </div>

      <p>JavaScript, dÃ¼nyanÄ±n en popÃ¼ler programlama dilidir. Ä°nternet tarayÄ±cÄ±larÄ±ndan sunuculara, mobil uygulamalardan yapay zeka modellerine kadar her yerde kullanÄ±lÄ±r. Peki JavaScript Ã¶ÄŸrenmeye nereden baÅŸlamalÄ±sÄ±nÄ±z?</p>

      <h3 style="color: #fff; margin-top: 25px;">DeÄŸiÅŸkenler ve Veri Tipleri</h3>
      <p>Modern JavaScript'te veri depolamak iÃ§in <code>let</code> ve <code>const</code> kelimelerini kullanÄ±rÄ±z:</p>
      <pre><code>const siteAdi = "CodeMareFi";
let makaleSayisi = 5;

// Konsola yazdÄ±rma
console.log(siteAdi + " sitemize hoÅŸ geldiniz!");</code></pre>

      <p>ES6 (ECMAScript 2015) standartlarÄ±yla birlikte gelen Arrow Function yapÄ±larÄ±, kodlarÄ±mÄ±zÄ± Ã§ok daha sade ve okunabilir hale getirdi.</p>

      <div style="display: flex; gap: 15px; margin-top: 30px; align-items: center; background: #1a1a1a; padding: 15px; border-radius: 6px;">
        <img src="/images/rocket.svg" alt="rocket" style="width: 48px; height: 48px;" />
        <div>
          <strong style="color: #fff;">Hemen BaÅŸla!</strong>
          <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">TarayÄ±cÄ±nÄ±zÄ±n F12 tuÅŸuna basÄ±p "Console" sekmesine geÃ§erek kendi JavaScript kodlarÄ±nÄ±zÄ± anÄ±nda deneyebilirsiniz.</p>
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
    title: "Vercel ve Next.js KullanÄ±mÄ±: SÄ±fÄ±r Hata ile YayÄ±n Yapmak",
    slug: "vercel-ve-nextjs-kullanimi",
    thumbnail: "/images/vercel_nextjs_1777230862288.png",
    author: "NBK BARIÅ",
    published: "2026-04-23T14:45:00Z",
    updated: "2026-04-23T14:45:00Z",
    categories: ["Tavsiyemiz", "PopÃ¼ler", "Genel Konular"],
    commentCount: 0,
    content: `
      <div style="text-align: center; margin-bottom: 25px;">
        <i class="fa-solid fa-gear" style="font-size: 48px; display: inline-block; animation: spin 5s linear infinite; color: #aaa;"></i>
      </div>

      <p>React tabanlÄ± en gÃ¼Ã§lÃ¼ framework olan <strong>Next.js</strong> ve onun yaratÄ±cÄ±sÄ± olan <strong>Vercel</strong> ile projeleri canlÄ±ya almak oldukÃ§a kolaydÄ±r. Ancak Server-Side Rendering (SSR) kullanan dinamik projelerde bazen beklenmedik 500 hatalarÄ± ile karÅŸÄ±laÅŸabilirsiniz.</p>

      <h3 style="color: #fff; margin-top: 25px;">Statik Sitelerin GÃ¼cÃ¼</h3>
      <p>EÄŸer dÄ±ÅŸarÄ±dan sÃ¼rekli deÄŸiÅŸen bir API kullanmak yerine projenizin iÃ§indeki yerel verileri (.md veya .json) kullanÄ±rsanÄ±z, Vercel projenizi "Statik" olarak oluÅŸturur. Statik projeler Ã§Ã¶kelmez, 500 hatasÄ± vermez ve saniyenin onda biri sÃ¼resinde aÃ§Ä±lÄ±r.</p>

      <pre><code>// Static Site Generation (SSG) AvantajÄ±
export async function generateStaticParams() {
  const posts = await getLocalPosts();
  return posts.map(post => ({ id: post.id }));
}</code></pre>

      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-fire" style="animation: pulse 1s infinite; color: #e60000; margin-right: 5px;"></i> CodeMareFi Tavsiyesi
        </strong>
        <p style="color: #ccc; margin-top: 10px;">Web siteniz ne kadar az dÄ±ÅŸ baÄŸÄ±mlÄ±lÄ±ÄŸa sahip olursa o kadar stabil Ã§alÄ±ÅŸÄ±r. AdSense onayÄ± iÃ§in Google, hatasÄ±z Ã§alÄ±ÅŸan ve kullanÄ±cÄ±ya en hÄ±zlÄ± tepkiyi veren statik veya iyi yapÄ±landÄ±rÄ±lmÄ±ÅŸ sunucu taraflÄ± siteleri tercih eder.</p>
      </div>

      <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      </style>
    `
  },
  {
    id: "5",
    title: "Discord Bot Client: ArayÃ¼z ile Kolayca YÃ¶netmek",
    slug: "discord-bot-client-arayuz",
    thumbnail: "/discord-bot-banner.png",
    author: "NBK BARIÅ",
    published: "2026-04-22T15:00:00Z",
    updated: "2026-04-22T15:00:00Z",
    categories: ["Discord-Bot-TanÄ±tÄ±mÄ±", "Projeler"],
    commentCount: 0,
    content: `
      <div style="background: rgba(88, 101, 242, 0.1); border-left: 4px solid #5865F2; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <strong style="color: #5865F2; font-size: 18px; vertical-align: middle;">Botunuzu GÃ¶rsel Olarak YÃ¶netin!</strong> 
        <p style="margin-top: 10px; color: #ccc;">SÃ¼rekli terminal ekranÄ±na bakmaktan sÄ±kÄ±lmadÄ±nÄ±z mÄ±? ArtÄ±k Discord botlarÄ±nÄ±zÄ± modern bir web arayÃ¼zÃ¼ (Dashboard) Ã¼zerinden kontrol edebilirsiniz.</p>
      </div>

      <p>Bot komutlarÄ±nÄ± kapatÄ±p aÃ§mak, veritabanÄ± yedeÄŸi almak veya sunucularÄ±nÄ±zdaki loglarÄ± takip etmek iÃ§in Discord.js ile React/Next.js teknolojilerini birleÅŸtirerek harika admin panelleri geliÅŸtirebilirsiniz.</p>

      <h3 style="color: #fff; margin-top: 25px;">API TasarÄ±mÄ±</h3>
      <p>Ã–ncelikle bot projemizde kÃ¼Ã§Ã¼k bir Express sunucusu baÅŸlatÄ±yoruz:</p>
      <pre><code>const express = require('express');
const app = express();

app.get('/api/stats', (req, res) => {
  res.json({
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    ping: client.ws.ping
  });
});

app.listen(3000, () => console.log('Dashboard API aktif!'));</code></pre>

      <p style="margin-top: 20px;">Bu basit API sayesinde web sitemizden botumuzun gÃ¼ncel istatistiklerini Ã§ekebilir ve dilediÄŸimiz gibi arayÃ¼ze yansÄ±tabiliriz. DetaylÄ± rehberimiz yakÄ±nda sizlerle olacak.</p>
    `
  }
];

