const { localPosts } = require('../app/lib/localPosts.ts');

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1499330498760278108/cVPRUsQ8_Kt6SPtaNi5_V9wCUNQuVAuW-hhCehxOoWGvUYa6DMbDOvR1pI9IFezPUma2';

async function sendLocalPostsToDiscord() {
  console.log(`📝 Found ${localPosts.length} local posts!`);
  console.log('📤 Sending to Discord...\n');

  for (let i = 0; i < localPosts.length; i++) {
    const post = localPosts[i];
    const postUrl = `https://codemarefi.com/post/${post.id}`;
    const categories = post.categories.join(', ');

    try {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            color: 0x2ea44f,
            title: post.title,
            url: postUrl,
            description: `**Yazar:** ${post.author}\n**Kategoriler:** ${categories}`,
            thumbnail: { url: post.thumbnail },
            footer: { text: 'CodeMareFi' },
            timestamp: post.published
          }]
        })
      });

      console.log(`✅ ${i + 1}/${localPosts.length} - ${post.title}`);
      
      // Discord rate limit: 5 mesaj/saniye, güvenli olmak için 300ms bekle
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Error sending post ${post.id}:`, error);
    }
  }

  console.log('\n🎉 All local posts sent to Discord!');
}

sendLocalPostsToDiscord();
