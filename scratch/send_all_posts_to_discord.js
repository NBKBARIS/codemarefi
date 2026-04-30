const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mvhlvnnocklutgljueid.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxOTg2NCwiZXhwIjoyMDkyNzk1ODY0fQ.59pCsyC4YojjYMWhheYljyT1cEjTAxhy2KyOmt0yqnI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1499330498760278108/cVPRUsQ8_Kt6SPtaNi5_V9wCUNQuVAuW-hhCehxOoWGvUYa6DMbDOvR1pI9IFezPUma2';

async function sendAllPostsToDiscord() {
  console.log('📝 Fetching all posts from database...');
  
  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('id, title, author_id, created_at, categories, thumbnail_url, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching posts:', error);
    return;
  }

  console.log(`✅ Found ${posts.length} posts!`);
  console.log('📤 Sending to Discord...\n');

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const authorName = post.profiles?.full_name || 'Bilinmeyen';
    const postUrl = `https://codemarefi.com/post/${post.id}`;
    const categories = Array.isArray(post.categories) ? post.categories.join(', ') : 'Genel';

    try {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            color: 0xe60000,
            title: post.title,
            url: postUrl,
            description: `**Yazar:** ${authorName}\n**Kategoriler:** ${categories}`,
            footer: { text: 'CodeMareFi' },
            timestamp: post.created_at
          }]
        })
      });

      console.log(`✅ ${i + 1}/${posts.length} - ${post.title}`);
      
      // Discord rate limit: 5 mesaj/saniye, güvenli olmak için 300ms bekle
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Error sending post ${post.id}:`, error);
    }
  }

  console.log('\n🎉 All posts sent to Discord!');
}

sendAllPostsToDiscord();
