import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function deleteMyPosts() {
  const myUserId = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

  // Önce postları listele
  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('id, title, is_approved')
    .eq('author_id', myUserId);

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log(`\nToplam ${posts?.length || 0} post bulundu:\n`);
  posts?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title} (${p.is_approved ? 'Onaylı' : 'Beklemede'}) - ID: ${p.id}`);
  });

  // Onaylı postları sil
  const approvedPosts = posts?.filter(p => p.is_approved) || [];
  
  if (approvedPosts.length > 0) {
    console.log(`\n${approvedPosts.length} onaylı post siliniyor...`);
    
    for (const post of approvedPosts) {
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

deleteMyPosts();
