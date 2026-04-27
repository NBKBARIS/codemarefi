'use client';

import { BlogPost } from '../lib/blogger';

interface ShareButtonsProps {
  post: BlogPost;
}

export default function ShareButtons({ post }: ShareButtonsProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = encodeURIComponent(post.title);
  const url = encodeURIComponent(shareUrl);
  const thumb = encodeURIComponent(post.thumbnail || '');

  const shares = [
    {
      name: 'Paylaş',
      icon: 'fa-facebook-f',
      color: '#3b5998',
      link: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    },
    {
      name: 'Tweetle',
      icon: 'fa-twitter',
      color: '#1da1f2',
      link: `https://twitter.com/intent/tweet?url=${url}&text=${title}`
    },
    {
      name: 'Pinle',
      icon: 'fa-pinterest-p',
      color: '#cb2027',
      link: `https://pinterest.com/pin/create/button/?url=${url}&media=${thumb}&description=${title}`
    },
    {
      name: 'Gönder',
      icon: 'fa-whatsapp',
      color: '#25d366',
      link: `https://api.whatsapp.com/send?text=${title}%20${url}`
    }
  ];

  return (
    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #222', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {shares.map(s => (
        <a
          key={s.name}
          href={s.link}
          target="_blank"
          rel="noreferrer"
          style={{
            flex: 1,
            minWidth: '100px',
            background: s.color,
            color: '#fff',
            textDecoration: 'none',
            padding: '10px',
            fontWeight: 'bold',
            fontSize: '13px',
            textAlign: 'center',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <i className={`fa-brands ${s.icon}`}></i> {s.name}
        </a>
      ))}
    </div>
  );
}
