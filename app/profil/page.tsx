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

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Kullanıcı adı boş bırakılamaz.' });
      return;
    }
    
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Sistem Güncellendi. Kimliğiniz Onaylandı.' });
      fetchProfile(user.id); // Refresh data
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erişim reddedildi.' });
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

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Görsel Veritabanına İşlendi.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Veri transferi başarısız.' });
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
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '40px', color: '#ff0000' }}></i>
          <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', borderRadius: '50%', boxShadow: '0 0 20px rgba(255,0,0,0.5)', zIndex: -1 }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', background: '#000', color: '#fff', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(230,0,0,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(230,0,0,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        background: 'linear-gradient(145deg, #0a0a0a 0%, #111 100%)', 
        border: '1px solid rgba(230,0,0,0.3)', 
        borderRadius: '16px', 
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(230,0,0,0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '3px',
            background: 'linear-gradient(to right, #fff, #e60000)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            PROFİL AYARLARI
          </h1>
          <div style={{ width: '50px', height: '3px', background: '#e60000', margin: '0 auto', borderRadius: '2px' }}></div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '20px' }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              padding: '4px',
              background: 'linear-gradient(45deg, #e60000, #333)',
              boxShadow: '0 0 25px rgba(230,0,0,0.3)'
            }}>
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#000' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user-secret" style={{ fontSize: '55px', color: '#333' }}></i>
                </div>
              )}
            </div>
            
            <label 
              htmlFor="avatar-upload" 
              style={{
                position: 'absolute', bottom: '5px', right: '5px',
                background: '#e60000', color: '#fff',
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease',
                border: '2px solid #000'
              }}
            >
              <i className="fa-solid fa-camera" style={{ fontSize: '16px' }}></i>
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
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '13px', letterSpacing: '1px', marginBottom: '5px' }}>SİSTEME KAYITLI E-POSTA</p>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>{user?.email}</p>
            
            <div style={{ 
              display: 'inline-block',
              padding: '5px 20px',
              borderRadius: '50px',
              background: profile?.role === 'admin' ? 'rgba(230,0,0,0.1)' : (profile?.role === 'mod' ? 'rgba(46,164,79,0.1)' : (profile?.role === 'author' ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.05)')),
              color: profile?.role === 'admin' ? '#e60000' : (profile?.role === 'mod' ? '#2ea44f' : (profile?.role === 'author' ? '#ff8c00' : '#888')),
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              border: `1px solid ${profile?.role === 'admin' ? '#e60000' : (profile?.role === 'mod' ? '#2ea44f' : (profile?.role === 'author' ? '#ff8c00' : '#222'))}`
            }}>
              <i className={`fa-solid ${profile?.role === 'admin' ? 'fa-user-shield' : (profile?.role === 'mod' ? 'fa-shield-halved' : (profile?.role === 'author' ? 'fa-pen-nib' : 'fa-user'))}`} style={{ marginRight: '8px' }}></i>
              {profile?.role === 'admin' ? 'Yönetici' : (profile?.role === 'mod' ? 'Moderatör' : (profile?.role === 'author' ? 'Yazar' : 'Üye'))}
            </div>
          </div>
        </div>

        <form onSubmit={updateProfile}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#e60000', marginBottom: '10px', fontSize: '12px', fontWeight: '900', letterSpacing: '1.5px' }}>KULLANICI ADI (ZORUNLU)</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-terminal" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' }}></i>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Kod adınızı belirleyin..."
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 45px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '15px',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>

          {message.text && (
            <div style={{
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '30px',
              fontSize: '13px',
              textAlign: 'center',
              backgroundColor: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(230,0,0,0.05)',
              color: message.type === 'error' ? '#ff3333' : '#fff',
              border: `1px solid ${message.type === 'error' ? '#e60000' : 'rgba(255,255,255,0.1)'}`,
            }}>
              <i className={`fa-solid ${message.type === 'error' ? 'fa-triangle-exclamation' : 'fa-check-circle'}`} style={{ marginRight: '8px' }}></i>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button 
              type="submit" 
              disabled={updating}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '8px',
                background: '#e60000',
                color: '#fff',
                border: 'none',
                fontWeight: '900',
                fontSize: '14px',
                letterSpacing: '2px',
                cursor: updating ? 'not-allowed' : 'pointer',
                opacity: updating ? 0.7 : 1,
                boxShadow: '0 5px 20px rgba(230,0,0,0.3)',
              }}
            >
              {updating ? 'VERİ İŞLENİYOR...' : 'SİSTEMİ GÜNCELLE'}
            </button>
            
            <button 
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#444',
                border: '1px solid #222',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              SİSTEMDEN ÇIKIŞ YAP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
