import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mvhlvnnocklutgljueid.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function removeIkasAdmin() {
  const ikasUserId = 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca';

  console.log('🔍 ikas kullanıcısı kontrol ediliyor...');

  // Önce mevcut durumu kontrol et
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ikasUserId)
    .single();

  if (fetchError) {
    console.error('❌ Kullanıcı bulunamadı:', fetchError);
    return;
  }

  console.log('📋 Mevcut durum:', {
    id: profile.id,
    full_name: profile.full_name,
    role: profile.role,
    discord_id: profile.discord_id,
  });

  // Rolü 'member' yap
  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({ 
      role: 'member',
      updated_at: new Date().toISOString()
    })
    .eq('id', ikasUserId)
    .select()
    .single();

  if (updateError) {
    console.error('❌ Güncelleme hatası:', updateError);
    return;
  }

  console.log('✅ ikas\'ın yönetici yetkisi kaldırıldı!');
  console.log('📋 Yeni durum:', {
    id: updated.id,
    full_name: updated.full_name,
    role: updated.role,
  });

  // İstatistikleri göster
  const { count: postCount } = await supabase
    .from('user_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', ikasUserId);

  const { count: commentCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', ikasUserId);

  console.log('\n📊 ikas istatistikleri:');
  console.log(`   Gönderi sayısı: ${postCount || 0}`);
  console.log(`   Yorum sayısı: ${commentCount || 0}`);
  console.log('\n💡 Not: Postları ve yorumları silmedik, sadece yönetici yetkisini kaldırdık.');
}

removeIkasAdmin();
