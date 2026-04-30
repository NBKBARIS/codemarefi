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
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxOTg2NCwiZXhwIjoyMDkyNzk1ODY0fQ.59pCsyC4YojjYMWhheYljyT1cEjTAxhy2KyOmt0yqnI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const NBK_USER_ID = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

const newPosts = [
  {
    title: 'TypeScript ile Tip Güvenliği: JavaScript\'ten Neden Vazgeçmelisiniz?',
    content: `
      <p>JavaScript harika bir dildir, ancak büyük projelerde tip güvenliği olmadan çalışmak gerçek bir kabusa dönüşebilir. TypeScript tam da bu noktada devreye giriyor.</p>
      <h3 style="color: #fff; margin-top: 25px;">Tip Güvenliği Nedir ve Neden Önemlidir?</h3>
      <p>Bir fonksiyona string göndermesi gereken yere number gönderdiğinizde, JavaScript bunu runtime'da (çalışma zamanında) fark eder. TypeScript ise kodu yazdığınız anda size hata verir.</p>
      <pre><code>// JavaScript - Hata runtime'da ortaya çıkar
function greet(name) {
  return "Merhaba " + name.toUpperCase();
}
greet(123); // Runtime hatası!

// TypeScript - Hata yazarken görülür
function greet(name: string): string {
  return "Merhaba " + name.toUpperCase();
}
greet(123); // ❌ Compile hatası!</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Interface ve Type Kullanımı</h3>
      <p>TypeScript'in en güçlü özelliklerinden biri, karmaşık veri yapılarını tanımlayabilmenizdir. Bu sayede kodunuz hem daha okunabilir hem de daha güvenli hale gelir.</p>
      <pre><code>interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
}

function createUser(user: User): void {
  // Artık user objesinin yapısı garanti altında
  console.log(\`Kullanıcı oluşturuldu: \${user.username}\`);
}</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">CodeMareFi İpucu:</strong>
        <p style="color: #ccc; margin-top: 10px;">Yeni bir proje başlatıyorsanız, direkt TypeScript ile başlayın. Sonradan JavaScript'ten TypeScript'e geçiş yapmak oldukça zahmetli olabilir.</p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['JavaScript', 'Tavsiyemiz', 'Popüler'],
    is_approved: true
  },
  {
    title: 'Next.js 15 ile Server Components: React\'ın Geleceği',
    content: `
      <p>Next.js 15 ile birlikte Server Components artık varsayılan hale geldi. Peki bu ne anlama geliyor ve neden bu kadar önemli?</p>
      <h3 style="color: #fff; margin-top: 25px;">Client vs Server Components</h3>
      <p>Geleneksel React uygulamalarında tüm componentler client-side (tarayıcıda) render edilir. Bu da büyük JavaScript bundle'ları ve yavaş ilk yükleme süreleri demektir.</p>
      <p>Server Components ise sunucuda render edilir ve sadece HTML olarak tarayıcıya gönderilir. Bu sayede:</p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>✅ Daha hızlı sayfa yükleme</li>
        <li>✅ Daha küçük JavaScript bundle</li>
        <li>✅ Daha iyi SEO performansı</li>
        <li>✅ Veritabanına direkt erişim (API'ye gerek yok)</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">Pratik Örnek</h3>
      <pre><code>// app/posts/page.tsx (Server Component)
import { supabase } from '@/lib/supabase';

export default async function PostsPage() {
  // Direkt veritabanından veri çekiyoruz!
  const { data: posts } = await supabase
    .from('posts')
    .select('*');

  return (
    &lt;div&gt;
      {posts.map(post => (
        &lt;PostCard key={post.id} post={post} /&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">Önemli Not:</strong> 
        Eğer useState, useEffect gibi hook'lar kullanmanız gerekiyorsa, dosyanın en üstüne <code>'use client'</code> eklemelisiniz.
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['JavaScript', 'Web-Tasarım', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'Git ve GitHub Kullanımı: Profesyonel Geliştiricilerin Sırları',
    content: `
      <p>Git bilmeden yazılım geliştirmek, harita olmadan yolculuğa çıkmak gibidir. Peki profesyonel geliştiriciler Git'i nasıl kullanıyor?</p>
      <h3 style="color: #fff; margin-top: 25px;">Branch Stratejisi</h3>
      <p>Asla, ama asla direkt <code>main</code> branch'ine commit atmayın! Her yeni özellik için ayrı bir branch oluşturun:</p>
      <pre><code>git checkout -b feature/yeni-ozellik
# Değişikliklerinizi yapın
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin feature/yeni-ozellik</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Commit Mesajları Sanatı</h3>
      <p>Commit mesajlarınız projenizin tarihçesidir. Anlamlı ve standart commit mesajları yazın:</p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li><code>feat:</code> Yeni özellik eklendiğinde</li>
        <li><code>fix:</code> Bug düzeltildiğinde</li>
        <li><code>docs:</code> Dokümantasyon değişikliği</li>
        <li><code>style:</code> Kod formatı değişikliği</li>
        <li><code>refactor:</code> Kod yeniden yapılandırması</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">Git Stash: Gizli Kahraman</h3>
      <p>Yarım kalmış bir işiniz varken acil başka bir branch'e geçmeniz mi gerekiyor? <code>git stash</code> tam size göre:</p>
      <pre><code>git stash save "yarım kalan özellik"
git checkout main
# İşinizi yapın
git checkout feature/yeni-ozellik
git stash pop</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">Dikkat:</strong>
        <p style="color: #ccc; margin-top: 10px;"><code>git push --force</code> kullanmadan önce iki kere düşünün! Ekip çalışmasında bu komut felaketlere yol açabilir.</p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Genel Konular', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'API Tasarımında RESTful Prensipler: Doğru ve Yanlışlar',
    content: `
      <p>Bir API yazmak kolaydır, ancak iyi bir API yazmak sanattır. RESTful prensiplere uygun bir API, hem kullanımı kolay hem de sürdürülebilir olur.</p>
      <h3 style="color: #fff; margin-top: 25px;">HTTP Metodlarını Doğru Kullanın</h3>
      <p>Her HTTP metodunun bir anlamı vardır ve bu anlamlara uygun kullanılmalıdır:</p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li><strong>GET:</strong> Veri okuma (yan etkisi yok)</li>
        <li><strong>POST:</strong> Yeni kayıt oluşturma</li>
        <li><strong>PUT:</strong> Mevcut kaydı tamamen güncelleme</li>
        <li><strong>PATCH:</strong> Mevcut kaydın bir kısmını güncelleme</li>
        <li><strong>DELETE:</strong> Kayıt silme</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">Endpoint İsimlendirme</h3>
      <pre><code>// ❌ Yanlış
GET /getUsers
POST /createUser
GET /user/delete/123

// ✅ Doğru
GET /users
POST /users
DELETE /users/123</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">HTTP Status Kodları</h3>
      <p>Doğru status kodları kullanmak, API'nizi kullanan geliştiricilerin hayatını kolaylaştırır:</p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li><code>200 OK:</code> İşlem başarılı</li>
        <li><code>201 Created:</code> Yeni kayıt oluşturuldu</li>
        <li><code>400 Bad Request:</code> Geçersiz istek</li>
        <li><code>401 Unauthorized:</code> Kimlik doğrulama gerekli</li>
        <li><code>404 Not Found:</code> Kayıt bulunamadı</li>
        <li><code>500 Internal Server Error:</code> Sunucu hatası</li>
      </ul>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">Pro Tip:</strong> 
        API'nize mutlaka versiyonlama ekleyin: <code>/api/v1/users</code>. Gelecekte değişiklik yapmanız gerektiğinde eski kullanıcıları bozmadan yeni versiyon çıkarabilirsiniz.
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Genel Konular', 'Popüler'],
    is_approved: true
  },
  {
    title: 'Docker ile Geliştirme Ortamı Kurulumu: "Bende Çalışıyor" Sorununa Son!',
    content: `
      <p>"Bende çalışıyor ama sende neden çalışmıyor?" cümlesini kaç kere duydunuz? Docker tam da bu sorunu çözmek için var.</p>
      <h3 style="color: #fff; margin-top: 25px;">Docker Nedir?</h3>
      <p>Docker, uygulamanızı ve tüm bağımlılıklarını bir "container" içine paketler. Bu sayede uygulamanız her yerde aynı şekilde çalışır: geliştirme ortamında, test sunucusunda, production'da...</p>
      <h3 style="color: #fff; margin-top: 25px;">Basit Bir Dockerfile Örneği</h3>
      <pre><code># Node.js uygulaması için Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Docker Compose ile Çoklu Servis</h3>
      <p>Uygulamanız veritabanı, Redis, ve backend'den oluşuyorsa, hepsini tek komutla başlatabilirsiniz:</p>
      <pre><code># docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:</code></pre>
      <p>Artık tek komutla her şeyi başlatabilirsiniz:</p>
      <pre><code>docker-compose up -d</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">Önemli:</strong>
        <p style="color: #ccc; margin-top: 10px;">Docker container'ları geçicidir. Önemli verileri mutlaka volume'lerde saklayın, yoksa container silindiğinde verileriniz de gider!</p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Genel Konular', 'Tavsiyemiz'],
    is_approved: true
  }
];

async function addPosts() {
  console.log('🚀 Adding 5 new quality posts to database...');
  const { data, error } = await supabase
    .from('user_posts')
    .insert(newPosts)
    .select();

  if (error) {
    console.error('❌ Error inserting posts:', error);
  } else {
    console.log(`✅ Successfully added ${data.length} new posts!`);
    console.log('📝 Posts:');
    data.forEach((post, i) => {
      console.log(`   ${i + 1}. ${post.title}`);
    });
  }
}

addPosts();
