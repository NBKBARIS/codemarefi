'use client';

import { useEffect } from 'react';

export default function SecurityProvider() {
  useEffect(() => {
    // 1. Sağ Tıkı Engelle
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Kısayolları Engelle (F12, Ctrl+Shift+I, Ctrl+U vb.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }

      // Ctrl + Shift + I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }

      // Ctrl + Shift + J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
      }

      // Ctrl + U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }

      // Ctrl + S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
    };

    // 3. Console Uyarı Mesajı
    const printWarning = () => {
      console.clear();
      console.log(
        '%c DUR! ',
        'background: #e60000; color: #fff; font-size: 50px; font-weight: bold; padding: 10px; border-radius: 5px;'
      );
      console.log(
        '%cBu alan geliştiriciler ve sistem yöneticileri içindir. Eğer birisi size buraya kod yapıştırmanızı söylerse, bu bir dolandırıcılık girişimi olabilir ve hesabınızın çalınmasına yol açabilir!',
        'color: #e60000; font-size: 16px; font-weight: bold;'
      );
      console.log(
        '%cCodeMareFi Güvenlik Sistemi Tarafından Korunmaktadır.',
        'color: #888; font-size: 12px;'
      );
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Console açıldığında uyarı ver
    printWarning();
    const interval = setInterval(printWarning, 5000); // Her 5 saniyede bir temizle ve yaz

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return null; // Bu bileşen görsel bir şey döndürmez, sadece çalışır.
}
