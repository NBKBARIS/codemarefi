'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // URL'deki hash fragment'tan session'ı al (implicit flow)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/');
      } else {
        // Hash'ten session exchange dene
        supabase.auth.exchangeCodeForSession(window.location.search).then(({ error }) => {
          if (error) {
            console.error('Auth callback error:', error);
          }
          router.replace('/');
        }).catch(() => {
          router.replace('/');
        });
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
      <p style={{ color: '#888', fontSize: '14px' }}>Giriş yapılıyor, lütfen bekleyin...</p>
    </div>
  );
}
