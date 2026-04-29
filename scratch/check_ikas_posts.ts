import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function checkIkasPosts() {
  const ikasUserId = 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca';

  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('id, title, is_approved, created_at')
    .eq('author_id', ikasUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log(`\nİkas'ın Supabase'deki postları (${posts?.length || 0} adet):\n`);
  posts?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Durum: ${p.is_approved ? '✅ Onaylı' : '⏳ Beklemede'}`);
    console.log(`   Tarih: ${new Date(p.created_at).toLocaleDateString('tr-TR')}`);
    console.log(`   ID: ${p.id}\n`);
  });

  console.log('localPosts.ts\'de IKAS_USER_ID ile 2 post var.');
  console.log(`\nToplam: ${(posts?.length || 0)} (Supabase) + 2 (localPosts) = ${(posts?.length || 0) + 2} post`);
}

checkIkasPosts();
