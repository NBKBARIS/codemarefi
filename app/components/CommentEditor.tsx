'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const EMOJIS = ['😀','😂','🥹','😍','🤔','😎','🔥','💯','👍','👎','❤️','💀','🎉','⚡','🚀','💻','🤖','🎮','👾','🛠️','✅','❌','⚠️','📌','💡','🏆','🥇','🎯','👀','🙏'];

const FORMATS = [
  { label: 'K',   cmd: 'bold',          title: 'Kalın',         icon: null },
  { label: 'İ',   cmd: 'italic',        title: 'İtalik',        icon: null },
  { label: 'A̲',   cmd: 'underline',     title: 'Altı Çizili',   icon: null },
  { label: '~~',  cmd: 'strikeThrough', title: 'Üstü Çizili',   icon: null },
];

const COLORS = [
  { color: '#e60000', title: 'Kırmızı' },
  { color: '#2ea44f', title: 'Yeşil' },
  { color: '#007bff', title: 'Mavi' },
  { color: '#f7df1e', title: 'Sarı' },
  { color: '#ff8c00', title: 'Turuncu' },
  { color: '#fff',    title: 'Beyaz' },
];

export default function CommentEditor({ value, onChange, placeholder, disabled, rows = 4 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isInternalUpdate = useRef(false);

  // value dışarıdan değişince editörü güncelle (sadece ilk yüklemede)
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalUpdate.current) { isInternalUpdate.current = false; return; }
    // Sadece içerik gerçekten farklıysa güncelle (cursor kaybını önle)
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  function execFormat(cmd: string) {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    handleInput();
  }

  function execColor(color: string) {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand('foreColor', false, color);
    handleInput();
  }

  function execCode() {
    if (disabled) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const selected = range.toString();
    const code = document.createElement('code');
    code.style.cssText = 'background:#1a1a1a;padding:2px 6px;border-radius:3px;font-family:monospace;color:#56b6c2;';
    code.textContent = selected || 'kod';
    range.deleteContents();
    range.insertNode(code);
    sel.collapseToEnd();
    handleInput();
  }

  function insertEmoji(emoji: string) {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand('insertText', false, emoji);
    setShowEmoji(false);
    handleInput();
  }

  const minHeight = `${rows * 24}px`;
  const isEmpty = !value || value === '<br>' || value === '';

  return (
    <div style={{ border: `1px solid ${isFocused ? '#e60000' : '#333'}`, borderRadius: '6px', overflow: 'visible', background: '#111', transition: 'border-color 0.2s' }}>

      {/* Araç çubuğu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '6px 8px', borderBottom: '1px solid #222', background: '#0d0d0d', flexWrap: 'wrap' }}>

        {/* Format butonları */}
        {FORMATS.map(f => (
          <button key={f.title} type="button" title={f.title} onClick={() => execFormat(f.cmd)} disabled={disabled}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#888', padding: '3px 7px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', minWidth: '28px', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e60000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >{f.label}</button>
        ))}

        {/* Kod butonu */}
        <button type="button" title="Kod" onClick={execCode} disabled={disabled}
          style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#888', padding: '3px 7px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', minWidth: '28px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#56b6c2'; e.currentTarget.style.borderColor = '#56b6c2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
        >&lt;/&gt;</button>

        {/* Renk butonları */}
        {COLORS.map(c => (
          <button key={c.color} type="button" title={c.title} onClick={() => execColor(c.color)} disabled={disabled}
            style={{ background: c.color, border: `2px solid ${c.color === '#fff' ? '#555' : c.color}`, borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'transform 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ))}

        {/* Emoji butonu */}
        <div style={{ position: 'relative' }}>
          <button type="button" title="Emoji" onClick={() => setShowEmoji(s => !s)} disabled={disabled}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#888', padding: '2px 6px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#e60000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >😀</button>
          {showEmoji && (
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px', width: '220px', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => insertEmoji(e)}
                  style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '3px', borderRadius: '4px' }}
                  onMouseEnter={ev => (ev.currentTarget.style.background = '#222')}
                  onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
                >{e}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenteditable alan */}
      <div style={{ position: 'relative' }}>
        {/* Placeholder */}
        {isEmpty && !isFocused && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', color: '#555', fontSize: '14px', pointerEvents: 'none', userSelect: 'none' }}>
            {placeholder || 'Yazın...'}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            minHeight,
            padding: '12px',
            color: '#fff',
            fontSize: '14px',
            lineHeight: 1.6,
            outline: 'none',
            wordBreak: 'break-word',
            overflowY: 'auto',
            opacity: disabled ? 0.5 : 1,
          }}
        />
      </div>

      {/* Alt bilgi */}
      <div style={{ padding: '4px 10px', borderTop: '1px solid #1a1a1a', fontSize: '10px', color: '#444', display: 'flex', gap: '10px' }}>
        <span><strong style={{ color: '#555' }}>K</strong> kalın</span>
        <span><em style={{ color: '#555' }}>İ</em> italik</span>
        <span style={{ color: '#555' }}>&lt;/&gt; kod</span>
        <span style={{ color: '#555' }}>😀 emoji</span>
        <span style={{ color: '#555', marginLeft: 'auto' }}>Metni seçip butona bas</span>
      </div>

      <style>{`
        [contenteditable] code {
          background: #1a1a1a;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
          color: #56b6c2;
        }
      `}</style>
    </div>
  );
}
