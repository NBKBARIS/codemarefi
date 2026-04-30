const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mvhlvnnocklutgljueid.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxOTg2NCwiZXhwIjoyMDkyNzk1ODY0fQ.59pCsyC4YojjYMWhheYljyT1cEjTAxhy2KyOmt0yqnI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const NBK_USER_ID = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

const newPosts = [
  {
    title: 'React Hooks Derinlemesine: useState ve useEffect\'ten Öteye',
    content: `
      <p>React Hooks, fonksiyonel componentlerde state ve lifecycle yönetimini mümkün kıldı. Ancak sadece useState ve useEffect ile sınırlı değilsiniz.</p>
      <h3 style="color: #fff; margin-top: 25px;">useReducer: Karmaşık State Yönetimi</h3>
      <p>Birden fazla state değişkeni ve karmaşık güncelleme mantığınız varsa, useReducer tam size göre:</p>
      <pre><code>const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">useMemo ve useCallback: Performance Optimization</h3>
      <p>Gereksiz re-render'ları önlemek için bu hook'ları kullanın:</p>
      <pre><code>// Pahalı hesaplamaları cache'le
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// Fonksiyonları cache'le
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">Dikkat:</strong>
        <p style="color: #ccc; margin-top: 10px;">useMemo ve useCallback'i her yerde kullanmayın! Sadece gerçekten performans sorunu olduğunda kullanın.</p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['JavaScript', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'CSS Grid vs Flexbox: Hangisini Ne Zaman Kullanmalısınız?',
    content: `
      <p>CSS Grid ve Flexbox, modern web tasarımının iki temel taşıdır. Ancak hangisini ne zaman kullanacağınızı biliyor musunuz?</p>
      <h3 style="color: #fff; margin-top: 25px;">Flexbox: Tek Boyutlu Düzenler</h3>
      <p>Flexbox, elementleri tek bir eksende (yatay veya dikey) düzenlemek için idealdir:</p>
      <pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}</code></pre>
      <p><strong>Kullanım Alanları:</strong></p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>Navbar ve menüler</li>
        <li>Buton grupları</li>
        <li>Card içerikleri</li>
        <li>Form elementleri</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">CSS Grid: İki Boyutlu Düzenler</h3>
      <p>Grid, hem satır hem sütun kontrolü gerektiren karmaşık düzenler için mükemmeldir:</p>
      <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}</code></pre>
      <p><strong>Kullanım Alanları:</strong></p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>Sayfa layoutları</li>
        <li>Galeri ve portfolio</li>
        <li>Dashboard'lar</li>
        <li>Karmaşık form düzenleri</li>
      </ul>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">Pro Tip:</strong> 
        Flexbox ve Grid'i birlikte kullanabilirsiniz! Grid ile genel layout'u oluşturun, Flexbox ile içerikleri hizalayın.
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Web-Tasarım', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'MongoDB vs PostgreSQL: Hangi Veritabanını Seçmelisiniz?',
    content: `
      <p>Veritabanı seçimi, projenizin geleceğini etkileyen en önemli kararlardan biridir. MongoDB mu PostgreSQL mi? İşte detaylı karşılaştırma.</p>
      <h3 style="color: #fff; margin-top: 25px;">MongoDB: NoSQL Esnekliği</h3>
      <p><strong>Avantajları:</strong></p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>✅ Esnek şema yapısı (schema-less)</li>
        <li>✅ Hızlı prototipleme</li>
        <li>✅ JSON benzeri döküman yapısı</li>
        <li>✅ Yatay ölçeklendirme (sharding)</li>
      </ul>
      <p><strong>Dezavantajları:</strong></p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>❌ ACID garantisi zayıf</li>
        <li>❌ Karmaşık JOIN işlemleri yok</li>
        <li>❌ Veri tutarlılığı riski</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">PostgreSQL: SQL Gücü</h3>
      <p><strong>Avantajları:</strong></p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>✅ Güçlü ACID garantisi</li>
        <li>✅ Karmaşık sorgular ve JOIN'ler</li>
        <li>✅ Veri tutarlılığı</li>
        <li>✅ JSON desteği (JSONB)</li>
      </ul>
      <p><strong>Dezavantajları:</strong></p>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>❌ Katı şema yapısı</li>
        <li>❌ Yatay ölçeklendirme zor</li>
        <li>❌ Şema değişiklikleri zahmetli</li>
      </ul>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">Karar Verme Rehberi:</strong>
        <p style="color: #ccc; margin-top: 10px;">
          <strong>MongoDB seçin:</strong> Hızlı değişen şema, prototipleme, log/analytics<br>
          <strong>PostgreSQL seçin:</strong> Finansal uygulamalar, e-ticaret, veri tutarlılığı kritik
        </p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Genel Konular', 'Popüler'],
    is_approved: true
  },
  {
    title: 'Tailwind CSS: Utility-First CSS Framework\'ün Avantajları',
    content: `
      <p>Tailwind CSS, geleneksel CSS yazma şeklini tamamen değiştirdi. Peki neden bu kadar popüler?</p>
      <h3 style="color: #fff; margin-top: 25px;">Utility-First Yaklaşımı</h3>
      <p>Tailwind, her CSS özelliği için hazır class'lar sunar:</p>
      <pre><code>&lt;div class="flex items-center justify-between p-4 bg-gray-900 rounded-lg"&gt;
  &lt;h2 class="text-2xl font-bold text-white"&gt;Başlık&lt;/h2&gt;
  &lt;button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"&gt;
    Tıkla
  &lt;/button&gt;
&lt;/div&gt;</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Avantajları</h3>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>✅ Hızlı geliştirme</li>
        <li>✅ Tutarlı tasarım sistemi</li>
        <li>✅ Küçük bundle boyutu (PurgeCSS ile)</li>
        <li>✅ Responsive tasarım kolaylığı</li>
        <li>✅ Dark mode desteği</li>
      </ul>
      <h3 style="color: #fff; margin-top: 25px;">Responsive ve Dark Mode</h3>
      <pre><code>&lt;div class="bg-white dark:bg-gray-900 
            p-4 md:p-8 lg:p-12
            text-black dark:text-white"&gt;
  İçerik
&lt;/div&gt;</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">İpucu:</strong> 
        Tailwind'i öğrenirken resmi dokümantasyonu kullanın. Arama özelliği inanılmaz hızlı ve kullanışlı!
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Web-Tasarım', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'WebSocket ile Gerçek Zamanlı Uygulamalar: Chat, Bildirimler ve Daha Fazlası',
    content: `
      <p>HTTP request-response modeli her zaman yeterli değildir. Gerçek zamanlı iletişim için WebSocket kullanmalısınız.</p>
      <h3 style="color: #fff; margin-top: 25px;">WebSocket Nedir?</h3>
      <p>WebSocket, client ve server arasında çift yönlü, sürekli bir bağlantı sağlar. HTTP'den farklı olarak, server istediği zaman client'a veri gönderebilir.</p>
      <h3 style="color: #fff; margin-top: 25px;">Node.js ile WebSocket Server</h3>
      <pre><code>const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Yeni bağlantı!');
  
  ws.on('message', (message) => {
    console.log('Mesaj alındı:', message);
    // Tüm client'lara gönder
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Client Tarafı</h3>
      <pre><code>const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Bağlantı kuruldu!');
  ws.send('Merhaba Server!');
};

ws.onmessage = (event) => {
  console.log('Mesaj alındı:', event.data);
};</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Kullanım Alanları</h3>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>💬 Chat uygulamaları</li>
        <li>🔔 Gerçek zamanlı bildirimler</li>
        <li>📊 Canlı dashboard'lar</li>
        <li>🎮 Multiplayer oyunlar</li>
        <li>📈 Borsa ve kripto takibi</li>
      </ul>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">Önemli:</strong>
        <p style="color: #ccc; margin-top: 10px;">WebSocket bağlantıları sürekli açık kalır. Çok sayıda client için sunucu kaynaklarını iyi yönetmelisiniz!</p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['JavaScript', 'Genel Konular'],
    is_approved: true
  },
  {
    title: 'JWT Authentication: Token Tabanlı Kimlik Doğrulama Sistemi',
    content: `
      <p>Modern web uygulamalarında session yerine token tabanlı kimlik doğrulama kullanılır. JWT (JSON Web Token) bu alanda en popüler çözümdür.</p>
      <h3 style="color: #fff; margin-top: 25px;">JWT Nasıl Çalışır?</h3>
      <p>1. Kullanıcı giriş yapar<br>
      2. Server bir JWT token oluşturur<br>
      3. Client bu token'ı her istekte gönderir<br>
      4. Server token'ı doğrular ve işlemi gerçekleştirir</p>
      <h3 style="color: #fff; margin-top: 25px;">JWT Oluşturma (Node.js)</h3>
      <pre><code>const jwt = require('jsonwebtoken');

// Token oluştur
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Token doğrula
const decoded = jwt.verify(token, process.env.JWT_SECRET);</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Client Tarafı (React)</h3>
      <pre><code>// Token'ı localStorage'a kaydet
localStorage.setItem('token', token);

// Her istekte token'ı gönder
fetch('/api/protected', {
  headers: {
    'Authorization': \`Bearer \${localStorage.getItem('token')}\`
  }
});</code></pre>
      <div style="background: rgba(230, 0, 0, 0.1); border: 1px solid #e60000; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <strong style="color: #e60000;">Güvenlik Uyarısı:</strong>
        <p style="color: #ccc; margin-top: 10px;">
          • JWT_SECRET'ı asla GitHub'a pushlama!<br>
          • Token'ları XSS saldırılarından korumak için httpOnly cookie kullanabilirsiniz<br>
          • Hassas bilgileri token içine koymayın (şifre vb.)
        </p>
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Genel Konular', 'Tavsiyemiz'],
    is_approved: true
  },
  {
    title: 'Responsive Web Tasarım: Mobile-First Yaklaşımı',
    content: `
      <p>Günümüzde web trafiğinin %60'ından fazlası mobil cihazlardan geliyor. Mobile-first tasarım artık bir lüks değil, zorunluluk!</p>
      <h3 style="color: #fff; margin-top: 25px;">Mobile-First Nedir?</h3>
      <p>Önce mobil için tasarlayın, sonra büyük ekranlar için genişletin. Desktop-first'in tam tersi!</p>
      <pre><code>/* ❌ Eski Yöntem (Desktop-First) */
.container {
  width: 1200px;
}
@media (max-width: 768px) {
  .container { width: 100%; }
}

/* ✅ Yeni Yöntem (Mobile-First) */
.container {
  width: 100%;
}
@media (min-width: 768px) {
  .container { width: 1200px; }
}</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Breakpoint Stratejisi</h3>
      <pre><code>/* Mobil (varsayılan) */
.grid { display: block; }

/* Tablet */
@media (min-width: 768px) {
  .grid { 
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { 
    grid-template-columns: repeat(3, 1fr);
  }
}</code></pre>
      <h3 style="color: #fff; margin-top: 25px;">Mobil Optimizasyon İpuçları</h3>
      <ul style="color: #ccc; line-height: 1.8;">
        <li>✅ Dokunma hedefleri en az 44x44px olmalı</li>
        <li>✅ Font boyutu minimum 16px (zoom'u önlemek için)</li>
        <li>✅ Görsel boyutlarını optimize edin</li>
        <li>✅ Hamburger menü kullanın</li>
        <li>✅ Viewport meta tag'i ekleyin</li>
      </ul>
      <pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code></pre>
      <div style="background: rgba(0, 255, 128, 0.1); border-left: 4px solid #00ff80; padding: 15px; border-radius: 4px; margin-top: 20px;">
        <strong style="color: #00ff80;">Test Etmeyi Unutmayın:</strong> 
        Chrome DevTools'da farklı cihaz boyutlarını test edin. Gerçek cihazlarda da mutlaka kontrol edin!
      </div>
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    author_id: NBK_USER_ID,
    categories: ['Web-Tasarım', 'Popüler'],
    is_approved: true
  }
];

async function addPosts() {
  console.log('🚀 Adding 7 more quality posts to database...');
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
