import { fetchPostById, formatDate } from '../../lib/blogger';
import Sidebar from '../../components/Sidebar';
import Comments from '../../components/Comments';

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const postId = params.id;
    const post = await fetchPostById(postId);

    if (!post) {
      return (
        <div className="main-layout" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff' }}>Yazı bulunamadı.</h1>
        </div>
      );
    }

    // Use raw HTML from Blogger directly
    const cleanHTML = post.content;

  return (
    <div className="main-layout" style={{ marginTop: '20px' }}>
      
      {/* ── LEFT: MAIN CONTENT ── */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '25px', marginBottom: '20px' }}>
        
        {/* Post Header */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginTop: 0, marginBottom: '10px' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#888', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-solid fa-user" style={{ color: '#e60000' }}></i> {post.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-regular fa-clock" style={{ color: '#e60000' }}></i> {formatDate(post.published)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-solid fa-folder" style={{ color: '#e60000' }}></i> 
              {post.categories.map((c, i) => (
                <span key={c}>{c}{i < post.categories.length - 1 ? ', ' : ''}</span>
              ))}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div 
          className="post-body"
          dangerouslySetInnerHTML={{ __html: cleanHTML }} 
          style={{ 
            color: '#ccc', 
            lineHeight: 1.8, 
            fontSize: '15px',
            fontFamily: "'Inter', sans-serif",
            overflowWrap: 'break-word'
          }}
        />

        {/* Tags Row */}
        <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
           <strong style={{ color: '#fff', fontSize: '13px' }}><i className="fa-solid fa-tags" style={{ color: '#e60000', marginRight: '5px' }}></i> Etiketler:</strong>
           {post.categories.map(cat => (
             <span key={cat} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '4px 10px', fontSize: '12px', color: '#bbb', cursor: 'pointer', transition: 'all 0.2s' }}
               onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e60000' }}
               onMouseLeave={e => { e.currentTarget.style.color = '#bbb'; e.currentTarget.style.borderColor = '#333' }}
             >
               {cat}
             </span>
           ))}
        </div>

        {/* Social Share Buttons (Static Visuals) */}
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #222', display: 'flex', gap: '10px' }}>
           <button style={{ flex: 1, background: '#3b5998', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa-brands fa-facebook-f"></i> Paylaş</button>
           <button style={{ flex: 1, background: '#1da1f2', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa-brands fa-twitter"></i> Tweetle</button>
           <button style={{ flex: 1, background: '#cb2027', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa-brands fa-pinterest-p"></i> Pinle</button>
           <button style={{ flex: 1, background: '#25d366', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa-brands fa-whatsapp"></i> Gönder</button>
        </div>

        {/* Comments Section */}
        <Comments postId={postId} />
      </div>

      {/* ── RIGHT: SIDEBAR ── */}
      <Sidebar />

      {/* Basic global styles to fix Blogger default HTML spacing */}
      <style dangerouslySetInnerHTML={{__html: `
        .post-body img { max-width: 100%; height: auto; border-radius: 4px; margin: 15px 0; }
        .post-body a { color: #e60000; text-decoration: none; }
        .post-body a:hover { text-decoration: underline; }
        .post-body pre, .post-body code { background: #1a1a1a; padding: 10px; border-radius: 4px; border: 1px solid #333; overflow-x: auto; color: #56b6c2; font-family: monospace; }
        .post-body blockquote { border-left: 4px solid #e60000; margin: 15px 0; padding-left: 15px; font-style: italic; color: #999; }
        .post-body ul, .post-body ol { margin-left: 20px; margin-bottom: 15px; }
      `}} />
    </div>
  );
  } catch (err: any) {
    return (
      <div style={{ color: 'red', padding: '50px' }}>
        <h1>DEBUG ERROR:</h1>
        <pre>{err.stack || String(err)}</pre>
      </div>
    );
  }
}
