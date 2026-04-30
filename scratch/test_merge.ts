import { createClient } from '@supabase/supabase-js';
import { localPosts } from '../app/lib/localPosts';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function testMerge() {
  // Supabase'den onaylı postları çek
  const { data: approved } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  console.log(`\n📊 Supabase'de ${approved?.length || 0} onaylı post`);
  console.log(`📊 localPosts'ta ${localPosts.length} post`);

  // Duplicate check
  const localIds = new Set(localPosts.map(p => p.id));
  const localTitles = new Set(localPosts.map(p => p.title.trim().toLowerCase()));

  const filteredUserPosts = (approved || []).filter(p => 
    !localIds.has(p.id) && !localTitles.has(p.title.trim().toLowerCase())
  );

  console.log(`📊 Duplicate olmayan Supabase postları: ${filteredUserPosts.length}`);
  console.log(`\n✅ Toplam merge sonucu: ${localPosts.length + filteredUserPosts.length} post\n`);

  // Duplicate olanları göster
  const duplicates = (approved || []).filter(p => 
    localIds.has(p.id) || localTitles.has(p.title.trim().toLowerCase())
  );

  if (duplicates.length > 0) {
    console.log(`⚠️  ${duplicates.length} duplicate post bulundu (bunlar filtrelendi):`);
    duplicates.forEach(p => {
      console.log(`   - ${p.title}`);
    });
  }
}

testMerge();
