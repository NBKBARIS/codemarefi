'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, formatDate } from '../lib/blogger';
import { supabase } from '../lib/supabase';

interface PostCardProps {
  post: BlogPost;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function getCatClass(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('discord-bot-kod')) return 'cat-discord';
  if (c.includes('javascript') || c.includes('js')) return 'cat-js';
  if (c.includes('blogger')) return 'cat-blogger';
  if (c.includes('genel')) return 'cat-genel';
  if (c.includes('web') || c.includes('css') || c.includes('html')) return 'cat-web';
  if (c.includes('python')) return 'cat-python';
  return 'cat-default';
}

export default function PostCard({ post }: PostCardProps) {
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const excerpt = stripHtml(post.content).slice(0, 160) + '...';

  useEffect(() => {
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)
      .then(({ count }) => setCommentCount(count ?? 0));
  }, [post.id]);

  return (
    <Link href={post.url} className="post-card">
      {/* Thumbnail */}
      <div className="post-card-thumb-wrap">
        {post.thumbnail ? (
          <img src={post.thumbnail} alt={post.title} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-image" style={{ color: '#444', fontSize: '32px' }}></i>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="post-card-body">
        {/* Kategori rozetleri */}
        <div className="post-card-cats">
          {post.categories.slice(0, 2).map(cat => (
            <span key={cat} className={`cat-badge ${getCatClass(cat)}`}>
              {cat.replace(/-/g, ' ')}
            </span>
          ))}
        </div>

        {/* Başlık */}
        <h2 className="post-card-title">{post.title}</h2>

        {/* Özet */}
        <p className="post-card-excerpt">{excerpt}</p>

        {/* Alt bilgi */}
        <div className="post-card-footer">
          <div className="post-card-meta-left">
            {/* Author — Link ile, full page reload yok */}
            <Link
              href={`/user/${encodeURIComponent(post.author)}`}
              className="post-card-author"
              onClick={e => e.stopPropagation()}
              style={{ color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e60000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              <i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#e60000' }}></i>
              <span>{post.author}</span>
            </Link>
            <span style={{ color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fa-regular fa-clock" style={{ fontSize: '10px' }}></i>
              {formatDate(post.published)}
            </span>
            <span style={{ color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fa-regular fa-comment" style={{ fontSize: '10px' }}></i>
              {commentCount !== null ? commentCount : <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '9px' }}></i>}
            </span>
          </div>
          <span className="read-more">
            Devamını Oku <i className="fa-solid fa-angle-right" style={{ fontSize: '10px' }}></i>
          </span>
        </div>
      </div>
    </Link>
  );
}
