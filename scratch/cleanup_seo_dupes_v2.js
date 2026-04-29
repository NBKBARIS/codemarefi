const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  const { data: posts } = await supabase.from('user_posts').select('id, title, content');
  
  for (const post of posts) {
    let content = post.content || '';
    let changed = false;

    // Detect duplicated "CodeMareFi Notu:"
    const noteMarker = "CodeMareFi Notu:";
    const parts = content.split(noteMarker);
    
    if (parts.length > 2) {
      console.log(`Found ${parts.length - 1} notes in: ${post.title}`);
      
      // Clean up logic: Find the div blocks and remove duplicates
      // We look for the div start and end
      const divPattern = /<div style="background:rgba\(230,0,0,0\.08\);[\s\S]*?<\/div>/gi;
      let matches = content.match(divPattern);
      
      if (matches) {
        // Only keep those that contain "CodeMareFi Notu:"
        const noteDivs = matches.filter(m => m.includes(noteMarker));
        if (noteDivs.length > 1) {
          console.log(`Removing ${noteDivs.length - 1} duplicate note divs...`);
          // Replace all except the first one
          let firstFound = false;
          content = content.replace(divPattern, (match) => {
            if (match.includes(noteMarker)) {
              if (!firstFound) { firstFound = true; return match; }
              return '';
            }
            return match;
          });
          changed = true;
        }
      }
    }

    // Also check for duplicated H2 detail headers
    const h2Marker = "Hakkında Detaylar</h2>";
    const h2Parts = content.split(h2Marker);
    if (h2Parts.length > 2) {
       console.log(`Found duplicated H2 in: ${post.title}`);
       const h2Pattern = /<h2 style="color:#fff;margin-top:28px;margin-bottom:12px;">[\s\S]*?<\/h2>/gi;
       let firstH2 = false;
       content = content.replace(h2Pattern, (match) => {
         if (match.includes(h2Marker)) {
           if (!firstH2) { firstH2 = true; return match; }
           return '';
         }
         return match;
       });
       changed = true;
    }

    if (changed) {
      console.log(`Updating post ${post.id}...`);
      await supabase.from('user_posts').update({ content }).eq('id', post.id);
    }
  }
  console.log('Done.');
}
cleanup();
