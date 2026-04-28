import { supabase } from '../app/lib/supabase';
import { localPosts } from '../app/lib/localPosts';

async function removeDuplicates() {
  const localTitles = new Set(localPosts.map(p => p.title.trim().toLowerCase()));
  
  const { data: userPosts, error } = await supabase
    .from('user_posts')
    .select('id, title');
    
  if (error) {
    console.error('Error fetching user_posts:', error);
    return;
  }
  
  console.log(`Found ${userPosts.length} user posts.`);
  
  for (const post of userPosts) {
    if (localTitles.has(post.title.trim().toLowerCase())) {
      console.log(`Deleting duplicate post: "${post.title}" (ID: ${post.id})`);
      const { error: deleteError } = await supabase
        .from('user_posts')
        .delete()
        .eq('id', post.id);
        
      if (deleteError) {
        console.error(`Failed to delete post ${post.id}:`, deleteError);
      } else {
        console.log(`Successfully deleted post ${post.id}.`);
      }
    } else {
      console.log(`Keeping post: "${post.title}"`);
    }
  }
  
  console.log('Finished removing duplicates.');
}

removeDuplicates().catch(console.error);
