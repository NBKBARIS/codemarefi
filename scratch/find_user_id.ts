import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk4NjQsImV4cCI6MjA5Mjc5NTg2NH0.H0rnNtYLzF3jX9WZuqY8NHRFgEgYWGogxS5sg_-uNAE'
);

async function findUser() {
  // NBK BARIŞ kullanıcısını bul
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', '%NBK%');

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log('NBK içeren kullanıcılar:');
  profiles?.forEach(p => {
    console.log(`- ID: ${p.id}`);
    console.log(`  İsim: ${p.full_name}`);
    console.log(`  Rol: ${p.role}`);
    console.log('---');
  });

  // Tüm onaylı postları kontrol et
  const { data: posts, error: postError } = await supabase
    .from('user_posts')
    .select('id, title, author_id, is_approved')
    .eq('is_approved', true);

  if (postError) {
    console.error('Post hatası:', postError);
    return;
  }

  console.log(`\nToplam onaylı post: ${posts?.length || 0}`);
  posts?.forEach(p => {
    console.log(`- ${p.title} (Author ID: ${p.author_id})`);
  });
}

findUser();
