'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });
  }, [router]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      setFullName(data.full_name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profil güncellendi!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Hata oluştu.' });
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setUpdating(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Profile Table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Profil resmi başarıyla yüklendi!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Resim yüklenemedi.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', color: '#fff' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '30px', color: '#e60000' }}></i>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: '#0d1117', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '30px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>Profil Ayarları</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '15px' }}>
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e60000' }} 
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#30363d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #e60000' }}>
                <i className="fa-solid fa-user" style={{ fontSize: '50px', color: '#8b949e' }}></i>
              </div>
            )}
            <label 
              htmlFor="avatar-upload" 
              style={{
                position: 'absolute', bottom: '5px', right: '5px',
                background: '#e60000', color: '#fff',
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              <i className="fa-solid fa-camera" style={{ fontSize: '14px' }}></i>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={uploadAvatar} 
                disabled={updating}
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          <p style={{ color: '#8b949e', fontSize: '14px' }}>{user?.email}</p>
        </div>

        <form onSubmit={updateProfile}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#8b949e', marginBottom: '8px', fontSize: '14px' }}>Görünen Ad Soyad</label>
            <input 
              type="text" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                background: '#0d1117',
                border: '1px solid #30363d',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {message.text && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
              backgroundColor: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)',
              color: message.type === 'error' ? '#e60000' : '#2ea44f',
              border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}`
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              type="submit" 
              disabled={updating}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '6px',
                background: '#238636',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                cursor: updating ? 'not-allowed' : 'pointer',
                opacity: updating ? 0.7 : 1
              }}
            >
              {updating ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              style={{
                padding: '14px 20px',
                borderRadius: '6px',
                background: '#30363d',
                color: '#f85149',
                border: '1px solid #f85149',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
