const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mvhlvnnocklutgljueid.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aGx2bm5vY2tsdXRnbGp1ZWlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxOTg2NCwiZXhwIjoyMDkyNzk1ODY0fQ.59pCsyC4YojjYMWhheYljyT1cEjTAxhy2KyOmt0yqnI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const NBK_USER_ID = 'b0cd3649-e54a-49f2-a8ed-da7a8561bd3b';

async function updateProfile() {
  console.log('🔧 Updating NBK BARIŞ profile...');
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      social_links: {
        github: {
          url: 'https://github.com/NBKBARIS',
          visible: true
        },
        discord: {
          url: 'codemarefi.com',
          visible: true
        },
        youtube: {
          url: 'https://youtube.com/@codemarefi',
          visible: true
        },
        website: {
          url: 'https://codemarefi.com',
          visible: true
        }
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', NBK_USER_ID)
    .select();

  if (error) {
    console.error('❌ Error updating profile:', error);
  } else {
    console.log('✅ Profile updated successfully!');
    console.log('📱 Social links added:');
    console.log('   - GitHub: https://github.com/NBKBARIS');
    console.log('   - Discord: codemarefi.com');
    console.log('   - YouTube: https://youtube.com/@codemarefi');
    console.log('   - Website: https://codemarefi.com');
  }
}

updateProfile();
