'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const FINAL_TEXT = ">> CodeMareFi << Yükleniyor...";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:<>?,./";

export default function Preloader() {
  const pathname = usePathname();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  
  const isInitialLoad = useRef(true);
  const isBackNavigation = useRef(false);

  // Track browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      isBackNavigation.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const isPostPage = pathname.startsWith('/post/');
    const shouldShow = isInitialLoad.current || (isPostPage && !isBackNavigation.current);

    isInitialLoad.current = false;
    isBackNavigation.current = false; // reset for next navigation

    if (!shouldShow) {
      setVisible(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setVisible(true);
    setText("");

    let iteration = 0;
    
    const interval = setInterval(() => {
      setText(FINAL_TEXT.split("").map((letter, index) => {
        if (index < iteration) {
          return FINAL_TEXT[index];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      
      if (iteration >= FINAL_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setVisible(false), 500); // fade out duration
        }, 800);
      }
      
      iteration += 1 / 2; // Speed of decoding
    }, 30);

    return () => clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('hide-cursor');
    } else {
      document.body.classList.remove('hide-cursor');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#000',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: loading ? 1 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none'
    }}>
      <div style={{
        color: '#00ff41',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textShadow: '0 0 10px #00ff41',
        whiteSpace: 'pre-wrap',
        textAlign: 'center',
        padding: '20px'
      }}>
        {text}
      </div>
    </div>
  );
}
