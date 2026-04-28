'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { deletePost } from '../lib/userPosts';

interface Props {
  postId: string;
  authorId?: string; // user post'larda var, localPost'larda yok
}

export default function PostDeleteButton({ postId, authorId }: Props) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      const u = session.user;
      setCurrentUser(u);
      supabase.from('profiles').select('role').eq('id', u.id).single().then(({ data }) => {
        setProfile(data);
        // Göster: kendi gönderisi VEYA admin/mod
        const isOwner = authorId && u.id === authorId;
        const isAdmin = data?.role === 'admin' || data?.role === 'mod';
        if (isOwner || isAdmin) setShow(true);
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

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        background: 'rgba(230,0,0,0.1)',
        color: '#e60000',
        border: '1px solid rgba(230,0,0,0.3)',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 700,
        cursor: deleting ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: deleting ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!deleting) {
          e.currentTarget.style.background = '#e60000';
          e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(230,0,0,0.1)';
        e.currentTarget.style.color = '#e60000';
      }}
    >
      <i className={`fa-solid ${deleting ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
      {deleting ? 'Siliniyor...' : 'Gönderiyi Sil'}
    </button>
  );
}
