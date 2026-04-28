import { supabase } from '../app/lib/supabase';
import { localPosts } from '../app/lib/localPosts';

async function restorePosts() {
  // Get the author_id from an existing post (e.g. "Ücretsiz VDS")
  const { data: existingPosts, error: fetchError } = await supabase
    .from('user_posts')
    .select('author_id')
    .limit(1);

  if (fetchError || !existingPosts || existingPosts.length === 0) {
    console.error('Could not find an author_id', fetchError);
    return;
  }

  const authorId = existingPosts[0].author_id;
  console.log(`Found author_id: ${authorId}`);

  // Insert the local posts into Supabase
  for (const post of localPosts) {
    console.log(`Inserting: ${post.title}`);
    
    // Check if it already exists to be safe
    const { data: check } = await supabase
      .from('user_posts')
      .select('id')
      .ilike('title', post.title)
      .single();
      
    if (check) {
      console.log(`Post already exists, skipping: ${post.title}`);
      continue;
    }

    const { error: insertError } = await supabase
      .from('user_posts')
      .insert({
        title: post.title,
        content: post.content,
        thumbnail_url: post.thumbnail,
        author_id: authorId,
        categories: post.categories,
        is_approved: true,
        created_at: post.published
      });

    if (insertError) {
      console.error(`Failed to insert ${post.title}`, insertError);
    } else {
      console.log(`Successfully restored ${post.title}`);
    }
  }
}

restorePosts().catch(console.error);
