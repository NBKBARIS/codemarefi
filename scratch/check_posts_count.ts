import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function checkPosts() {
  const { data: allPosts, error } = await supabase
    .from('user_posts')
    .select('id, title, author_id, is_approved, created_at');

  if (error) {
    console.error('❌ Hata:', error);
    return;
  }

  console.log(`\n📊 Toplam ${allPosts?.length || 0} post bulundu\n`);
  
  if (allPosts && allPosts.length > 0) {
    allPosts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} (${p.is_approved ? '✅ Onaylı' : '⏳ Bekliyor'})`);
    });
  } else {
    console.log('❌ Supabase user_posts tablosu BOŞ!');
    console.log('Bu yüzden SEO butonu 0 post düzeltildi diyor.');
  }
}

checkPosts();
