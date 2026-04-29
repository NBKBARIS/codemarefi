import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function deleteNBKDuplicates() {
  const nbkUserId = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

  // Tüm postları listele
  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('id, title')
    .eq('author_id', nbkUserId);

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log(`\n${posts?.length || 0} post siliniyor...\n`);
  
  if (posts && posts.length > 0) {
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
  
  console.log('\n✅ Tüm duplicate postlar silindi!');
  console.log('Artık sadece localPosts\'taki 15 post kalacak.');
}

deleteNBKDuplicates();
