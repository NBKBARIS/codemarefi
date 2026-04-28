import { fetchPosts } from '../app/lib/blogger';

async function main() {
  const { posts } = await fetchPosts(20, 1, '');
  posts.forEach((p, i) => {
    console.log(`${i}: [${p.id}] ${p.title} (Author: ${p.author})`);
  });
}

main().catch(console.error);
