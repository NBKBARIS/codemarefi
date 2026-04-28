'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Şifre sıfırlama linkinden gelindi — reset sayfasına yönlendir
        router.replace('/auth/reset-password');
      } else if (session) {
        // Normal OAuth girişi — ana sayfaya
        router.replace('/');
      }
    });

    // Fallback: hash'ten session exchange dene
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      color: '#fff',
    }}>
      <i className="fa-solid fa-spinner fa-spin fa-3x" style={{ color: '#e60000' }}></i>
      <p style={{ color: '#888', fontSize: '14px' }}>Yönlendiriliyor, lütfen bekleyin...</p>
    </div>
  );
}
