import { supabase } from './supabase';

// Lazy import — circular dependency önlemek için
async function clearBloggerCache() {
  try {
    const { invalidatePostCache } = await import('./blogger');
    invalidatePostCache();
  } catch { /* sessizce geç */ }
}

export interface UserPost {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  author_id: string;
  user_id?: string;
  is_approved: boolean;
  categories: string[];
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export async function submitUserPost(post: Omit<UserPost, 'id' | 'is_approved' | 'created_at' | 'profiles'>) {
  const { data, error } = await supabase
    .from('user_posts')
    .insert([post])
    .select();
  
  if (error) throw error;
  
  // Discord'a bildirim gönder
  if (data && data.length > 0) {
    const newPost = data[0];
    try {
      // Yazar bilgisini al
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', post.author_id)
        .single();
      
      const authorName = profile?.full_name || 'Bilinmeyen';
      const postUrl = `https://codemarefi.com/post/${newPost.id}`;
      const categories = Array.isArray(post.categories) ? post.categories.join(', ') : 'Genel';
      
      // 1. Yeni postlar kanalına bildirim (herkese açık)
      await fetch('https://discord.com/api/webhooks/1499330498760278108/cVPRUsQ8_Kt6SPtaNi5_V9wCUNQuVAuW-hhCehxOoWGvUYa6DMbDOvR1pI9IFezPUma2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            color: 0xe60000,
            title: `📝 ${post.title}`,
            url: postUrl,
            description: `**Yazar:** ${authorName}\n**Kategoriler:** ${categories}\n\n⏳ **Durum:** Onay bekliyor`,
            thumbnail: { url: post.thumbnail_url },
            footer: { text: 'CodeMareFi • Yeni Post' },
            timestamp: new Date().toISOString()
          }]
        })
      });
      
      // 2. Post onay kanalına bildirim (moderatörler için - butonlu)
      await fetch('https://discord.com/api/webhooks/POST_ONAY_WEBHOOK_BURAYA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `<@&MODERATOR_ROLE_ID> Yeni gönderi onay bekliyor!`,
          embeds: [{
            color: 0xffa500,
            title: `⏳ ${post.title}`,
            url: postUrl,
            description: `**Yazar:** ${authorName}\n**Kategoriler:** ${categories}\n**Post ID:** \`${newPost.id}\``,
            thumbnail: { url: post.thumbnail_url },
            footer: { text: 'Post Onay Sistemi' },
            timestamp: new Date().toISOString()
          }],
          components: [{
            type: 1,
            components: [
              {
                type: 2,
                style: 3,
                label: 'Onayla',
                custom_id: `approve_post_${newPost.id}`,
                emoji: { name: '✅' }
              },
              {
                type: 2,
                style: 4,
                label: 'Reddet',
                custom_id: `reject_post_${newPost.id}`,
                emoji: { name: '❌' }
              },
              {
                type: 2,
                style: 5,
                label: 'Görüntüle',
                url: postUrl,
                emoji: { name: '👁️' }
              }
            ]
          }]
        })
      });
    } catch (webhookError) {
      console.error('Discord webhook hatası:', webhookError);
      // Webhook hatası post eklemeyi engellemez
    }
  }
  
  return data;
}

export async function getPendingPosts() {
  const { data, error } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
    .limit(100); // max 100 bekleyen gönderi

  if (error) throw error;
  return data as UserPost[];
}

export async function getApprovedPosts() {
  const { data, error } = await supabase
    .from('user_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(200); // max 200 onaylı gönderi

  if (error) throw error;
  return data as UserPost[];
}

export async function approvePost(id: string) {
  const { error } = await supabase
    .from('user_posts')
    .update({ is_approved: true })
    .eq('id', id);

  if (error) throw error;
  await clearBloggerCache();
  
  // Discord'a onay bildirimi gönder
  try {
    const { data: post } = await supabase
      .from('user_posts')
      .select('title, thumbnail_url, author_id, categories, profiles(full_name)')
      .eq('id', id)
      .single();
    
    if (post) {
      const authorName = post.profiles?.full_name || 'Bilinmeyen';
      const postUrl = `https://codemarefi.com/post/${id}`;
      const categories = Array.isArray(post.categories) ? post.categories.join(', ') : 'Genel';
      
      await fetch('https://discord.com/api/webhooks/1499330498760278108/cVPRUsQ8_Kt6SPtaNi5_V9wCUNQuVAuW-hhCehxOoWGvUYa6DMbDOvR1pI9IFezPUma2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            color: 0x2ea44f,
            title: `✅ ${post.title}`,
            url: postUrl,
            description: `**Yazar:** ${authorName}\n**Kategoriler:** ${categories}\n\n✅ **Durum:** Onaylandı ve yayında!`,
            thumbnail: { url: post.thumbnail_url },
            footer: { text: 'CodeMareFi • Post Onaylandı' },
            timestamp: new Date().toISOString()
          }]
        })
      });
    }
  } catch (webhookError) {
    console.error('Discord webhook hatası:', webhookError);
  }
}

export async function updatePost(id: string, updates: { title: string; content: string; categories: string[] }) {
  // Düzenleme yapılınca tekrar onay beklesin
  const { error } = await supabase
    .from('user_posts')
    .update({ ...updates, is_approved: false })
    .eq('id', id);

  if (error) throw error;
}

export async function deletePost(id: string) {
  // Önce yazarı bul
  const { data: post } = await supabase
    .from('user_posts')
    .select('author_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('user_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Silme sonrası cache temizle
  await clearBloggerCache();

  // Silme sonrası yazarın onaylı gönderi sayısını kontrol et
  // Eğer 0 kaldıysa YAZAR -> ÜYE'ye düşür
  if (post?.author_id) {
    const { count } = await supabase
      .from('user_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', post.author_id)
      .eq('is_approved', true);

    if ((count ?? 0) === 0) {
      // Onaylı gönderisi kalmadı — rolü kontrol et
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', post.author_id)
        .single();

      // Sadece 'author' rolündeyse 'member'a düşür (admin/mod dokunma)
      if (profile?.role === 'author') {
        await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', post.author_id);
      }
    }
  }
}
