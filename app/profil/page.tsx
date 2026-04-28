'use client';

import { useState, useEffect } from 'react';
import { supabase, clearLastSeen } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const SOCIAL_FIELDS = [
  { key: 'github',    icon: 'fa-github',    label: 'GitHub',    placeholder: 'https://github.com/kullanici',    color: '#fff',     pattern: /^https:\/\/(www\.)?github\.com\/.+/i },
  { key: 'twitter',   icon: 'fa-twitter',   label: 'Twitter',   placeholder: 'https://twitter.com/kullanici',   color: '#1da1f2',  pattern: /^https:\/\/(www\.)?(twitter|x)\.com\/.+/i },
  { key: 'youtube',   icon: 'fa-youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@kanal',      color: '#ff0000',  pattern: /^https:\/\/(www\.)?youtube\.com\/.+/i },
  { key: 'discord',   icon: 'fa-discord',   label: 'Discord',   placeholder: 'KullaniciAdi veya discord.gg/...', color: '#5865f2', pattern: /^.{2,50}$/ },
  { key: 'instagram', icon: 'fa-instagram', label: 'Instagram', placeholder: 'https://instagram.com/kullanici', color: '#e1306c',  pattern: /^https:\/\/(www\.)?instagram\.com\/.+/i },
  { key: 'website',   icon: 'fa-globe',     label: 'Website',   placeholder: 'https://siteadresi.com',          color: '#2ea44f',  pattern: /^https?:\/\/.{3,}/i },
];

function validateSocialLink(key: string, value: string): string | null {
  if (!value.trim()) return null; // boş = geçerli (gösterilmez)
  const field = SOCIAL_FIELDS.find(f => f.key === key);
  if (!field) return null;
  if (!field.pattern.test(value.trim())) {
    const examples: Record<string, string> = {
      github:    'https://github.com/kullanici-adi',
      twitter:   'https://twitter.com/kullanici-adi',
      youtube:   'https://youtube.com/@kanal-adi',
      discord:   'KullaniciAdi#1234 veya discord.gg/davet',
      instagram: 'https://instagram.com/kullanici-adi',
      website:   'https://siteadresi.com',
    };
    return `Geçersiz ${field.label} linki. Örnek: ${examples[key]}`;
  }
  return null;
}
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [socialVisible, setSocialVisible] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/'); return; }
      setUser(session.user);
      fetchProfile(session.user.id);
    });
  }, [router]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        // social_links: { github: { url, visible } } veya eski format { github: "url" }
        const raw = data.social_links || {};
        const urls: Record<string, string> = {};
        const vis: Record<string, boolean> = {};
        for (const key of Object.keys(raw)) {
          if (typeof raw[key] === 'object' && raw[key] !== null) {
            urls[key] = raw[key].url || '';
            vis[key] = raw[key].visible !== false;
          } else {
            urls[key] = raw[key] || '';
            vis[key] = true;
          }
        }
        setSocialLinks(urls);
        setSocialVisible(vis);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setMessage({ type: 'error', text: 'Kullanıcı adı boş bırakılamaz.' }); return; }

    // Sosyal link validasyonu
    for (const field of SOCIAL_FIELDS) {
      const val = socialLinks[field.key] || '';
      const err = validateSocialLink(field.key, val);
      if (err) { setMessage({ type: 'error', text: err }); return; }
    }
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName.trim(),
        social_links: Object.fromEntries(
          SOCIAL_FIELDS.map(f => [f.key, { url: socialLinks[f.key] || '', visible: socialVisible[f.key] !== false }])
            .filter(([, v]: any) => v.url)
        ),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profil güncellendi!' });
      fetchProfile(user.id);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Hata oluştu.' });
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUpdating(true);
    try {
      const file = e.target.files[0];
      const filePath = `${user.id}-${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() });
      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Fotoğraf güncellendi.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Yükleme başarısız.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearLastSeen();
    router.push('/');
    window.location.reload();
  };

  const ROLE_MAP: Record<string, { label: string; color: string; icon: string }> = {
    admin:  { label: 'Yönetici',  color: '#e60000', icon: 'fa-user-shield' },
    mod:    { label: 'Moderatör', color: '#2ea44f', icon: 'fa-shield-halved' },
    author: { label: 'Yazar',     color: '#ff8c00', icon: 'fa-pen-nib' },
    member: { label: 'Üye',       color: '#888',    icon: 'fa-user' },
  };
  const roleMeta = ROLE_MAP[profile?.role] || ROLE_MAP['member'];

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '40px', color: '#e60000' }}></i>
    </div>
  );

  return (
    <div style={{ minHeight: '90vh', background: '#000', color: '#fff', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(230,0,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(230,0,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '540px', margin: '0 auto', background: 'linear-gradient(145deg, #0a0a0a, #111)', border: '1px solid rgba(230,0,0,0.25)', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }}>

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', background: 'linear-gradient(to right, #fff, #e60000)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            PROFİL AYARLARI
          </h1>
          <div style={{ width: '50px', height: '3px', background: '#e60000', margin: '0 auto', borderRadius: '2px' }}></div>
        </div>

        {/* Avatar + Bilgi */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '35px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '16px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', padding: '3px', background: 'linear-gradient(45deg, #e60000, #333)', boxShadow: '0 0 20px rgba(230,0,0,0.25)' }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user-secret" style={{ fontSize: '48px', color: '#333' }}></i>
                </div>
              )}
            </div>
            <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: '4px', right: '4px', background: '#e60000', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #000' }}>
              <i className="fa-solid fa-camera" style={{ fontSize: '13px' }}></i>
              <input id="avatar-upload" type="file" accept="image/*" onChange={uploadAvatar} disabled={updating} style={{ display: 'none' }} />
            </label>
          </div>
          <p style={{ color: '#555', fontSize: '12px', marginBottom: '4px' }}>{user?.email}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 16px', borderRadius: '50px', background: roleMeta.color + '18', color: roleMeta.color, fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase', border: `1px solid ${roleMeta.color}44` }}>
            <i className={`fa-solid ${roleMeta.icon}`}></i>
            {roleMeta.label}
          </div>
        </div>

        <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Kullanıcı Adı */}
          <div>
            <label style={{ display: 'block', color: '#e60000', marginBottom: '8px', fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px' }}>KULLANICI ADI</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-terminal" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '13px' }}></i>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Kod adınızı belirleyin..."
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid #2a2a2a', color: '#fff', outline: 'none', fontSize: '14px', fontFamily: 'monospace' }} />
            </div>
          </div>

          {/* Sosyal Medya Linkleri */}
          <div>
            <label style={{ display: 'block', color: '#e60000', marginBottom: '12px', fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px' }}>
              <i className="fa-solid fa-share-nodes" style={{ marginRight: '6px' }}></i>
              SOSYAL MEDYA LİNKLERİ
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SOCIAL_FIELDS.map(field => {
                const val = socialLinks[field.key] || '';
                const err = val ? validateSocialLink(field.key, val) : null;
                return (
                  <div key={field.key}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <i className={`fa-brands ${field.icon}`} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: err ? '#e60000' : val ? field.color : '#444', fontSize: '14px' }}></i>
                        <input
                          type="text"
                          value={val}
                          onChange={e => setSocialLinks(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%', padding: '10px 12px 10px 40px', borderRadius: '6px',
                            background: 'rgba(0,0,0,0.3)',
                            border: `1px solid ${err ? '#e60000' : val && !err ? field.color + '55' : '#1e1e1e'}`,
                            color: '#ccc', outline: 'none', fontSize: '12px', fontFamily: 'monospace',
                            transition: 'border-color 0.2s',
                            opacity: socialVisible[field.key] === false ? 0.4 : 1,
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = err ? '#e60000' : field.color)}
                          onBlur={e => (e.currentTarget.style.borderColor = err ? '#e60000' : val ? field.color + '55' : '#1e1e1e')}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSocialVisible(prev => ({ ...prev, [field.key]: prev[field.key] === false ? true : false }))}
                        title={socialVisible[field.key] === false ? 'Gizli — tıkla göster' : 'Görünür — tıkla gizle'}
                        style={{ background: 'none', border: `1px solid ${socialVisible[field.key] === false ? '#333' : '#444'}`, borderRadius: '6px', padding: '8px 10px', cursor: 'pointer', color: socialVisible[field.key] === false ? '#444' : '#888', fontSize: '12px', flexShrink: 0, transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = field.color)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = socialVisible[field.key] === false ? '#333' : '#444')}
                      >
                        <i className={`fa-solid ${socialVisible[field.key] === false ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {err && (
                      <p style={{ color: '#e60000', fontSize: '11px', margin: '4px 0 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '10px' }}></i>
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ color: '#444', fontSize: '11px', marginTop: '8px' }}>
              <i className="fa-solid fa-circle-info" style={{ marginRight: '4px' }}></i>
              Boş bıraktığın alanlar profilinde gösterilmez.
            </p>
          </div>

          {/* Mesaj */}
          {message.text && (
            <div style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', backgroundColor: message.type === 'error' ? 'rgba(230,0,0,0.1)' : 'rgba(46,164,79,0.1)', color: message.type === 'error' ? '#ff3333' : '#2ea44f', border: `1px solid ${message.type === 'error' ? '#e60000' : '#2ea44f'}` }}>
              <i className={`fa-solid ${message.type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}`} style={{ marginRight: '8px' }}></i>
              {message.text}
            </div>
          )}

          {/* Butonlar */}
          <button type="submit" disabled={updating} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: '#e60000', color: '#fff', border: 'none', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.7 : 1, boxShadow: '0 4px 15px rgba(230,0,0,0.25)' }}>
            {updating ? 'GÜNCELLENİYOR...' : 'PROFİLİ KAYDET'}
          </button>

          <button type="button" onClick={handleLogout} style={{ width: '100%', padding: '11px', borderRadius: '8px', background: 'transparent', color: '#444', border: '1px solid #1e1e1e', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer' }}>
            SİSTEMDEN ÇIKIŞ YAP
          </button>
        </form>
      </div>
    </div>
  );
}
