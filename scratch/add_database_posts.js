const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const NBK_USER_ID = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

const newPosts = [
  {
    title: 'Modern Web Geliştirmede Animasyonların Gücü: Framer Motion',
    content: `
      <p>Web sitelerinde kullanıcı deneyimini (UX) artırmanın en etkili yollarından biri, doğru ve akıcı animasyonlar kullanmaktır. Sadece estetik değil, aynı zamanda kullanıcıyı yönlendiren bir araçtır.</p>
      <h3 style="color: #fff; margin-top: 25px;">Neden Framer Motion?</h3>
      <p>React ekosisteminde animasyon dendiğinde akla ilk gelen kütüphane şüphesiz Framer Motion'dır. Kullanımı inanılmaz derecede basit olmasına rağmen, karmaşık sayfa geçişleri ve fizik tabanlı animasyonları kusursuz şekilde yönetir.</p>
      <pre><code>import { motion } from "framer-motion"

export const MyComponent = () => (
  &lt;motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  /&gt;
)</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi Notu:</strong>
        <p style="color: #ccc; margin-top: 10px;">Animasyonları çok fazla abartmamak önemlidir. Sitenizin performansını düşürmemesi için sadece odak noktalarına ve geçişlere eklemeye özen gösterin.</p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Web-Tasarım', 'JavaScript', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'Kendi Discord Bot Altyapını Nasıl Kurarsın? (Sıfırdan İleri Seviye)',
    content: `
      <p>Hazır altyapılar kullanmak harikadır, zamandan tasarruf sağlar. Ancak bir botun tam olarak nasıl çalıştığını anlamak istiyorsanız, kendi altyapınızı (Handler) yazmanız gerekir.</p>
      <h3 style="color: #fff; margin-top: 25px;">Command ve Event Handler Mantığı</h3>
      <p>Tüm kodları tek bir <code>index.js</code> dosyasına yığmak yerine, komutları ve eventleri ayrı klasörlerde modüler bir şekilde yönetmek projenizi büyütürken size inanılmaz kolaylık sağlar.</p>
      <pre><code>const fs = require('fs');

// Komutları yükleme döngüsü
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(\`./commands/\${file}\`);
    client.commands.set(command.data.name, command);
}</code></pre>
      <p>Eğer "Bununla kim uğraşacak reis" diyorsanız, sitemizdeki <strong>Discord Hazır Bot Altyapılar</strong> kategorisinde sizler için hazırladığım en güncel, hatasız v14 handler'larını bulabilirsiniz.</p>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Discord-bot-kodları', 'Discord-Hazır-Bot-Altyapılar'],
    is_approved: true
  },
  {
    title: 'Siber Güvenlik 101: Web Sitenizi Nasıl Korursunuz?',
    content: `
      <p>Bir web sitesi yapmak işin sadece yarısıdır; onu hayatta tutmak ve kötü niyetli kişilerden korumak ise diğer yarısıdır. Peki temel düzeyde sitemizi nasıl koruma altına alırız?</p>
      <h3 style="color: #fff; margin-top: 25px;">SQL Injection ve XSS Açıkları</h3>
      <p>Eğer kullanıcıdan gelen veriyi doğrudan veritabanına veya ekrana basıyorsanız, büyük bir tehlike altındasınız demektir. Modern framework'ler (React, Next.js) XSS açıklarını büyük ölçüde engellese de, veritabanı sorgularında mutlaka ORM (Prisma vb.) veya Prepared Statements kullanılmalıdır.</p>
      <h3 style="color: #fff; margin-top: 25px;">Rate Limiting Hayat Kurtarır</h3>
      <p>Aynı IP üzerinden saniyede yüzlerce istek geliyorsa bu bir DDoS saldırısı veya Bruteforce denemesi olabilir. API endpointlerinize mutlaka "Rate Limiting" (istek sınırlandırması) ekleyin.</p>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">Cloudflare Tavsiyesi:</strong> 
        Domaininizi Cloudflare üzerinden bağlamak, bu tür saldırıların %90'ını sitenize daha ulaşmadan engelleyecektir.
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Genel Konular', 'Popüler', 'Tavsiyemiz'],
    is_approved: true
  }
];

async function addPosts() {
  console.log('Adding posts to database...');
  const { data, error } = await supabase
    .from('user_posts')
    .insert(newPosts)
    .select();

  if (error) {
    console.error('Error inserting posts:', error);
  } else {
    console.log(`Successfully added ${data.length} new posts!`);
  }
}

addPosts();
