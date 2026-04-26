import { NextRequest, NextResponse } from 'next/server';

const BLOG_ID = process.env.BLOG_ID || '5795750681970782630';
const API_KEY = process.env.BLOGGER_API_KEY || '';

// ── Blogger REST API v3 (JSON, hızlı, güvenilir) ──
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId  = searchParams.get('postId');
  const maxResults = searchParams.get('maxResults') || '10';
  const startIndex = parseInt(searchParams.get('startIndex') || '1', 10);
  const label  = searchParams.get('label') || '';
  const q      = searchParams.get('q') || '';

  // pageToken hesabı (REST v3 startIndex yerine pageToken kullanır; basit sayfalama için biz offset modu yaparız)
  // v3 posts.list endpoint
  let url = '';

  if (postId) {
    url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}?key=${API_KEY}&fetchBody=true&fetchImages=true`;
  } else {
    const params = new URLSearchParams({
      key: API_KEY,
      maxResults: String(Math.min(parseInt(maxResults), 20)),
      fetchImages: 'true',
      status: 'live',
      orderBy: 'published',
    });

    if (label)  params.set('labels', label);
    if (q && !label) params.set('q', q);

    // startIndex > 1 için pageToken gerekmez, sadece ilk 20 için basit offset:
    // Eğer ileride sayfalama gerekirse pageToken cache edilebilir.
    url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?${params}`;
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Blogger v3] Error:', res.status, err);
      return NextResponse.json(
        { error: 'Blogger API error', status: res.status, detail: err },
        { status: res.status },
      );
    }

    const raw = await res.json();

    // ── v3 → Atom Feed-like shape dönüşümü ──
    // Downstream code (blogger.ts) beklediği için feed formatına çeviriyoruz
    if (postId) {
      // Tek post: entry şeklinde dön
      return NextResponse.json(transformPostToEntry(raw), {
        headers: cacheHeaders(),
      });
    }

    // Liste: feed şeklinde dön
    const total = raw.totalItems || (raw.items?.length || 0);
    const feed = {
      'openSearch$totalResults': { $t: String(total) },
      entry: (raw.items || []).map(transformPostToEntry),
    };
    return NextResponse.json({ feed }, { headers: cacheHeaders() });

  } catch (e) {
    console.error('[Blogger v3] Fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch from Blogger', detail: String(e) }, { status: 500 });
  }
}

function cacheHeaders() {
  return { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPostToEntry(p: any) {
  // Thumbnail: images[0] > content ilk img > yok
  let thumb = p.images?.[0]?.url || '';
  if (!thumb && p.content) {
    const m = p.content.match(/<img[^>]+src="([^">]+)"/);
    if (m) thumb = m[1];
  }
  if (thumb) {
    thumb = thumb.replace(/\/s\d+(-c)?\//, '/s1600/').replace('http://', 'https://');
  }

  return {
    id:        { $t: p.id || '' },
    title:     { $t: p.title || '' },
    content:   { $t: p.content || '' },
    published: { $t: p.published || '' },
    updated:   { $t: p.updated || '' },
    link: [
      { rel: 'alternate', href: p.url || '' },
    ],
    category:  (p.labels || []).map((l: string) => ({ term: l })),
    author:    [{ name: { $t: p.author?.displayName || 'MareFi' } }],
    'media$thumbnail': thumb ? { url: thumb } : undefined,
    'thr$total': { $t: String(p.replies?.totalItems || 0) },
  };
}
