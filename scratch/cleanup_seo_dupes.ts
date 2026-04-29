import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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
    const notePattern = /<div style="background:rgba\(230,0,0,0\.08\);border-left:4px solid #e60000;padding:15px;margin-top:20px;border-radius:0 4px 4px 0;">\s*<strong style="color:#e60000;">CodeMareFi Notu:<\/strong>\s*<p style="color:#ccc;margin:8px 0 0;">Bu konu hakkında daha fazla bilgi almak için yorum bölümünden sorularınızı iletebilirsiniz\. Topluluğumuz size yardımcı olmaktan memnuniyet duyar\.<\/p>\s*<\/div>/gi;
    
    const matches = content.match(notePattern);
    if (matches && matches.length > 1) {
      console.log(`Found ${matches.length} notes in post: ${post.title}`);
      // Keep only one
      content = content.replace(notePattern, (match, offset, string) => {
        return string.indexOf(match) === offset ? match : '';
      });
      changed = true;
    }

    // 2. Remove duplicated Kategori Link
    const tagPattern = /<p style="margin-top:20px;color:#888;font-size:13px;">\s*<i class="fa-solid fa-tag" style="color:#e60000;margin-right:6px;"><\/i>\s*Bu yazı <a href="\/kategori\/[^"]+" style="color:#e60000;">[^<]+<\/a> kategorisinde yayınlanmıştır\.\s*<\/p>/gi;
    
    const tagMatches = content.match(tagPattern);
    if (tagMatches && tagMatches.length > 1) {
      console.log(`Found ${tagMatches.length} category tags in post: ${post.title}`);
      content = content.replace(tagPattern, (match, offset, string) => {
        return string.indexOf(match) === offset ? match : '';
      });
      changed = true;
    }

    // 3. Remove duplicated H2 detail headers
    const h2Pattern = /<h2 style="color:#fff;margin-top:28px;margin-bottom:12px;">[^<]+ Hakkında Detaylar<\/h2>/gi;
    const h2Matches = content.match(h2Pattern);
    if (h2Matches && h2Matches.length > 1) {
       console.log(`Found ${h2Matches.length} H2 headers in post: ${post.title}`);
       content = content.replace(h2Pattern, (match, offset, string) => {
         return string.indexOf(match) === offset ? match : '';
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
