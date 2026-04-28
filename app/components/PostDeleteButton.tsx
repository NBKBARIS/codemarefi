'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { deletePost } from '../lib/userPosts';

interface Props {
  postId: string;
  authorId?: string;
}

export default function PostDeleteButton({ postId, authorId }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [show, setShow] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      const u = session.user;
      supabase.from('profiles').select('role').eq('id', u.id).single().then(({ data }) => {
        const admin = data?.role === 'admin' || data?.role === 'mod';
        const isOwner = authorId && u.id === authorId;
        setIsAdmin(admin);
        if (isOwner || admin) setShow(true);
      });
    });
  }, [authorId]);

  if (!show) return null;

  const handleDelete = async () => {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    setDeleting(true);
    try {
      await deletePost(postId);
      router.push('/');
    } catch (err: any) {
      alert('Silme hatası: ' + err.message);
      setDeleting(false);
    }
  };

  // localPosts (id: 1-5) için düzenleme butonu gösterme
  const isLocalPost = ['1','2','3','4','5'].includes(postId);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {/* Düzenle butonu — sadece user_posts için */}
      {!isLocalPost && (
        <Link
          href={`/post/${postId}/duzenle`}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'rgba(255,140,0,0.1)', color: '#ff8c00',
            border: '1px solid rgba(255,140,0,0.3)', padding: '8px 14px',
            borderRadius: '4px', fontSize: '12px', fontWeight: 700,
            textDecoration: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ff8c00'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,140,0,0.1)'; e.currentTarget.style.color = '#ff8c00'; }}
        >
          <i className="fa-solid fa-pen"></i>
          Düzenle
        </Link>
      )}

      {/* Sil butonu */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: 'rgba(230,0,0,0.1)', color: '#e60000',
          border: '1px solid rgba(230,0,0,0.3)', padding: '8px 16px',
          borderRadius: '4px', fontSize: '12px', fontWeight: 700,
          cursor: deleting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          opacity: deleting ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!deleting) { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.color = '#fff'; } }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(230,0,0,0.1)'; e.currentTarget.style.color = '#e60000'; }}
      >
        <i className={`fa-solid ${deleting ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
        {deleting ? 'Siliniyor...' : 'Sil'}
      </button>
    </div>
  );
}
