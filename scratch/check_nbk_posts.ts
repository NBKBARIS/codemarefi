import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function checkNBKPosts() {
  const nbkUserId = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

  // Tüm postları listele (onaylı + onaysız)
  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('id, title, is_approved, created_at')
    .eq('author_id', nbkUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log(`\nNBK BARIŞ'ın Supabase'deki postları (${posts?.length || 0} adet):\n`);
  posts?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Durum: ${p.is_approved ? '✅ Onaylı' : '⏳ Beklemede'}`);
    console.log(`   Tarih: ${new Date(p.created_at).toLocaleDateString('tr-TR')}`);
    console.log(`   ID: ${p.id}\n`);
  });

  // localPosts sayısı
  console.log('localPosts.ts\'de NBK_USER_ID ile 15 post var.');
  console.log(`\nToplam: ${(posts?.length || 0)} (Supabase) + 15 (localPosts) = ${(posts?.length || 0) + 15} post`);
}

checkNBKPosts();
