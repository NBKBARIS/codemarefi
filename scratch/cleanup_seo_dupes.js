const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manuel env okuma
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Env variables not found!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log('Fetching posts...');
  const { data: posts, error } = await supabase.from('user_posts').select('id, title, content');
  
  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  console.log(`Checking ${posts.length} posts...`);
  
  for (const post of posts) {
    let content = post.content || '';
    let changed = false;

    // 1. Remove duplicated CodeMareFi Notu
    // Pattern flexible for spacing and tags
    const notePattern = /<div style="background:rgba\(230,0,0,0\.08\);border-left:4px solid #e60000;padding:15px;margin-top:20px;border-radius:0 4px 4px 0;">[\s\S]*?<strong style="color:#e60000;">CodeMareFi Notu:<\/strong>[\s\S]*?<p style="color:#ccc;margin:8px 0 0;">Bu konu hakkında daha fazla bilgi almak için yorum bölümünden sorularınızı iletebilirsiniz\. Topluluğumuz size yardımcı olmaktan memnuniyet duyar\.<\/p>[\s\S]*?<\/div>/gi;
    
    const matches = content.match(notePattern);
    if (matches && matches.length > 1) {
      console.log(`Found ${matches.length} notes in post: ${post.title}`);
      // Keep only first occurrence
      let first = true;
      content = content.replace(notePattern, (match) => {
        if (first) { first = false; return match; }
        return '';
      });
      changed = true;
    }

    // 2. Remove duplicated Kategori Link
    const tagPattern = /<p style="margin-top:20px;color:#888;font-size:13px;">[\s\S]*?<i class="fa-solid fa-tag" style="color:#e60000;margin-right:6px;"><\/i>[\s\S]*?Bu yazı <a href="\/kategori\/[^"]+" style="color:#e60000;">[^<]+<\/a> kategorisinde yayınlanmıştır\.[\s\S]*?<\/p>/gi;
    
    const tagMatches = content.match(tagPattern);
    if (tagMatches && tagMatches.length > 1) {
      console.log(`Found ${tagMatches.length} category tags in post: ${post.title}`);
      let first = true;
      content = content.replace(tagPattern, (match) => {
        if (first) { first = false; return match; }
        return '';
      });
      changed = true;
    }

    // 3. Remove duplicated H2 detail headers
    const h2Pattern = /<h2 style="color:#fff;margin-top:28px;margin-bottom:12px;">[^<]+ Hakkında Detaylar<\/h2>/gi;
    const h2Matches = content.match(h2Pattern);
    if (h2Matches && h2Matches.length > 1) {
       console.log(`Found ${h2Matches.length} H2 headers in post: ${post.title}`);
       let first = true;
       content = content.replace(h2Pattern, (match) => {
         if (first) { first = false; return match; }
         return '';
       });
       changed = true;
    }

    if (changed) {
      console.log(`Updating post ${post.id}...`);
      const { error: updateError } = await supabase
        .from('user_posts')
        .update({ content })
        .eq('id', post.id);
      
      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      } else {
        console.log(`Post ${post.id} cleaned up successfully.`);
      }
    }
  }
  
  console.log('Cleanup finished.');
}

cleanup();
