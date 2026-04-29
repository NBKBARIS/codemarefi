import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function deleteIkasPosts() {
  const ikasUserId = 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca';

  // İkas'ın postlarını listele
  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('id, title, is_approved')
    .eq('author_id', ikasUserId);

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log(`\nİkas'ın toplam ${posts?.length || 0} postu bulundu:\n`);
  posts?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title} (${p.is_approved ? 'Onaylı' : 'Beklemede'}) - ID: ${p.id}`);
  });

  if (posts && posts.length > 0) {
    console.log(`\n${posts.length} post siliniyor...`);
    
    for (const post of posts) {
      const { error: deleteError } = await supabase
        .from('user_posts')
        .delete()
        .eq('id', post.id);
      
      if (deleteError) {
        console.error(`❌ ${post.title} silinemedi:`, deleteError);
      } else {
        console.log(`✅ ${post.title} silindi`);
      }
    }
  }
}

deleteIkasPosts();
