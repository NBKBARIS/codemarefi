import { createClient } from '@supabase/supabase-js';
import { localPosts } from '../app/lib/localPosts';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

const NBK_USER_ID = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

async function checkPosts() {
  console.log('🔍 NBK BARIŞ post sayısı kontrolü...\n');

  // localPosts'taki NBK BARIŞ postları
  const localNbkPosts = localPosts.filter(p => p.authorId === NBK_USER_ID);
  console.log(`📁 localPosts'ta NBK BARIŞ: ${localNbkPosts.length} post`);
  console.log('Başlıklar:');
  localNbkPosts.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));

  // Veritabanındaki NBK BARIŞ postları
  const { data: dbPosts, count } = await supabase
    .from('user_posts')
    .select('id, title, is_approved', { count: 'exact' })
    .eq('author_id', NBK_USER_ID);

  console.log(`\n💾 Veritabanında NBK BARIŞ: ${count} post`);
  if (dbPosts) {
    console.log('Başlıklar:');
    dbPosts.forEach((p, i) => console.log(`  ${i + 1}. ${p.title} ${p.is_approved ? '✅' : '⏳ (onay bekliyor)'}`));
  }

  // Başlık normalizasyonu
  const normTitle = (s: string) => s.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '').trim();
  const localTitlesNorm = localNbkPosts.map(p => normTitle(p.title));

  // Çakışan postları bul
  const duplicates = dbPosts?.filter(dbPost => {
    const tn = normTitle(dbPost.title || '');
    return localTitlesNorm.some(lt => lt === tn || lt.startsWith(tn) || tn.startsWith(lt));
  }) || [];

  console.log(`\n🔄 Çakışan postlar (localPosts ile DB): ${duplicates.length}`);
  if (duplicates.length > 0) {
    duplicates.forEach(p => console.log(`  - ${p.title}`));
  }

  // Unique DB postları
  const uniqueDbPosts = dbPosts?.filter(dbPost => {
    const tn = normTitle(dbPost.title || '');
    return !localTitlesNorm.some(lt => lt === tn || lt.startsWith(tn) || tn.startsWith(lt));
  }) || [];

  console.log(`\n✅ Unique DB postları: ${uniqueDbPosts.length}`);
  if (uniqueDbPosts.length > 0) {
    uniqueDbPosts.forEach(p => console.log(`  - ${p.title} ${p.is_approved ? '✅' : '⏳'}`));
  }

  // Toplam
  const total = localNbkPosts.length + uniqueDbPosts.length;
  console.log(`\n📊 TOPLAM POST SAYISI: ${total}`);
  console.log(`   = ${localNbkPosts.length} (localPosts) + ${uniqueDbPosts.length} (unique DB)`);
}

checkPosts();
