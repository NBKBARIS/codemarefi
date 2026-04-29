import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function cleanAllPosts() {
  const nbkUserId = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';
  const ikasUserId = 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca';

  // Tüm postları listele
  const { data: allPosts } = await supabase
    .from('user_posts')
    .select('id, title, author_id')
    .or(`author_id.eq.${nbkUserId},author_id.eq.${ikasUserId}`);

  console.log(`\nToplam ${allPosts?.length || 0} post bulundu:\n`);
  
  if (allPosts && allPosts.length > 0) {
    allPosts.forEach((p, i) => {
      const author = p.author_id === nbkUserId ? 'NBK BARIŞ' : 'ikas';
      console.log(`${i + 1}. ${p.title} (${author})`);
    });

    console.log(`\n${allPosts.length} post siliniyor...\n`);
    
    for (const post of allPosts) {
      const { error } = await supabase
        .from('user_posts')
        .delete()
        .eq('id', post.id);
      
      if (error) {
        console.error(`❌ ${post.title} silinemedi:`, error);
      } else {
        console.log(`✅ ${post.title} silindi`);
      }
    }
    
    console.log('\n✅ Tüm postlar silindi!');
    console.log('Artık sadece localPosts kalacak:');
    console.log('- NBK BARIŞ: 21 post');
    console.log('- ikas: 2 post');
  } else {
    console.log('Silinecek post yok.');
  }
}

cleanAllPosts();
