import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function checkSeoStatus() {
  const { data: allPosts, error } = await supabase
    .from('user_posts')
    .select('id, title, content, categories');

  if (error) {
    console.error('❌ Hata:', error);
    return;
  }

  console.log(`\n📊 ${allPosts?.length || 0} post SEO durumu:\n`);
  
  if (allPosts && allPosts.length > 0) {
    allPosts.forEach((p, i) => {
      const hasH2 = /<h2/i.test(p.content);
      const hasNote = p.content.includes('CodeMareFi Notu:');
      const hasCategoryLink = p.content.includes('/kategori/');
      const hasAlt = /<img[^>]+alt=/i.test(p.content);
      
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   H2 başlık: ${hasH2 ? '✅' : '❌'}`);
      console.log(`   CodeMareFi Notu: ${hasNote ? '✅' : '❌'}`);
      console.log(`   Kategori linki: ${hasCategoryLink ? '✅' : '❌'}`);
      console.log(`   Görsel alt text: ${hasAlt ? '✅' : '❌'}`);
      console.log('');
    });
  }
}

checkSeoStatus();
