import Link from 'next/link';
import { fetchPostById, formatDate } from '../../lib/blogger';
import { localPosts } from '../../lib/localPosts';
import Sidebar from '../../components/Sidebar';
import Comments from '../../components/Comments';
import ShareButtons from '../../components/ShareButtons';
import PostDeleteButton from '../../components/PostDeleteButton';

export async function generateStaticParams() {
  return localPosts.map((post) => ({ id: post.id }));
}

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = await fetchPostById(params.id);

  if (!post) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', color: '#fff' }}>
        <i className="fa-solid fa-file-circle-xmark" style={{ fontSize: '60px', color: '#e60000' }}></i>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Yazı Bulunamadı</h1>
        <Link href="/" style={{ background: '#e60000', color: '#fff', padding: '10px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}>
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="main-layout" style={{ marginTop: '20px' }}>

      {/* ── SOL: MAKALE ── */}
      <div>
        <article style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div style={{ position: 'relative', width: '100%', maxHeight: '420px', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.thumbnail}
                alt={post.title}
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #111, transparent)' }}></div>
            </div>
          )}

          <div style={{ padding: '28px 30px' }}>

            {/* Kategori rozetleri */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {post.categories.map((cat: string) => (
                <Link
                  key={cat}
                  href={`/kategori/${encodeURIComponent(cat)}`}
                  className="post-cat-link"
                >
                  {cat.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>

            {/* Başlık */}
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 900, marginTop: 0, marginBottom: '16px', lineHeight: 1.3 }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', color: '#666', fontSize: '12px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #1e1e1e', flexWrap: 'wrap' }}>
              <Link
                href={`/user/${encodeURIComponent((post as any).authorId || post.author)}`}
                className="author-link"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#888' }}
              >
                <i className="fa-solid fa-user" style={{ color: '#e60000', fontSize: '11px' }}></i>
                <span style={{ fontWeight: 600 }}>{post.author}</span>
              </Link>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-regular fa-clock" style={{ color: '#e60000', fontSize: '11px' }}></i>
                {formatDate(post.published)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-folder-open" style={{ color: '#e60000', fontSize: '11px' }}></i>
                {post.categories.join(', ')}
              </span>
              {/* Silme butonu — sadece yazar veya admin/mod görür */}
              <div style={{ marginLeft: 'auto' }}>
                <PostDeleteButton
                  postId={params.id}
                  authorId={(post as any).authorId}
                />
              </div>
            </div>

            {/* İçerik */}
            <div
              className="post-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{ color: '#ccc', lineHeight: 1.85, fontSize: '15px', overflowWrap: 'break-word' }}
            />

            {/* Etiketler */}
            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-solid fa-tags" style={{ color: '#e60000' }}></i> Etiketler:
              </span>
              {post.categories.map((cat: string) => (
                <Link
                  key={cat}
                  href={`/kategori/${encodeURIComponent(cat)}`}
                  className="post-tag"
                  style={{ textDecoration: 'none' }}
                >
                  {cat.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>

            {/* Paylaş */}
            <ShareButtons post={post} />

            {/* Yorumlar */}
            <Comments postId={params.id} />
          </div>
        </article>
      </div>

      {/* ── SAĞ: SIDEBAR ── */}
      <Sidebar />

      <style dangerouslySetInnerHTML={{ __html: `
        .post-cat-link {
          background: #e60000; color: #fff; font-size: 10px; font-weight: 800;
          padding: 3px 9px; border-radius: 2px; text-decoration: none;
          text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s;
        }
        .post-cat-link:hover { background: #cc0000; }
        .post-body img { max-width: 100%; height: auto; border-radius: 6px; margin: 16px 0; display: block; }
        .post-body a { color: #e60000; text-decoration: none; border-bottom: 1px solid rgba(230,0,0,0.3); transition: border-color 0.2s; }
        .post-body a:hover { border-bottom-color: #e60000; }
        .post-body pre, .post-body code { background: #0d0d0d; padding: 14px 16px; border-radius: 6px; border: 1px solid #2a2a2a; overflow-x: auto; color: #56b6c2; font-family: 'Courier New', monospace; font-size: 13px; display: block; line-height: 1.6; }
        .post-body :not(pre) > code { display: inline; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
        .post-body blockquote { border-left: 4px solid #e60000; margin: 20px 0; padding: 12px 20px; background: rgba(230,0,0,0.05); color: #aaa; font-style: italic; border-radius: 0 4px 4px 0; }
        .post-body h2, .post-body h3, .post-body h4 { color: #fff; margin-top: 28px; margin-bottom: 12px; }
        .post-body ul, .post-body ol { margin-left: 24px; margin-bottom: 16px; color: #ccc; }
        .post-body li { margin-bottom: 6px; line-height: 1.7; }
        .post-body p { margin-bottom: 16px; }
        .post-body table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .post-body th, .post-body td { border: 1px solid #2a2a2a; padding: 10px 14px; text-align: left; }
        .post-body th { background: #1a1a1a; color: #fff; font-weight: 700; }
        .post-body td { color: #ccc; }
        .post-tag { background: #1a1a1a; border: 1px solid #2a2a2a; padding: 4px 10px; font-size: 11px; color: #888; cursor: pointer; transition: all 0.2s; display: inline-block; border-radius: 2px; }
        .post-tag:hover { color: #fff; border-color: #e60000; background: rgba(230,0,0,0.08); }
      ` }} />
    </div>
  );
}
