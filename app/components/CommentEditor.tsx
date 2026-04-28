'use client';
import { useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const EMOJIS = ['😀','😂','🥹','😍','🤔','😎','🔥','💯','👍','👎','❤️','💀','🎉','⚡','🚀','💻','🤖','🎮','👾','🛠️','✅','❌','⚠️','📌','💡','🏆','🥇','🎯','👀','🙏'];

const FORMATS = [
  { label: 'K',   style: 'font-weight:bold',                        wrap: ['<strong>','</strong>'],           title: 'Kalın' },
  { label: 'İ',   style: 'font-style:italic',                       wrap: ['<em>','</em>'],                   title: 'İtalik' },
  { label: 'A̲',   style: 'text-decoration:underline',               wrap: ['<u>','</u>'],                     title: 'Altı Çizili' },
  { label: '~~',  style: 'text-decoration:line-through',            wrap: ['<s>','</s>'],                     title: 'Üstü Çizili' },
  { label: '</>',  style: 'font-family:monospace;background:#1a1a1a;padding:2px 6px;border-radius:3px', wrap: ['<code>','</code>'], title: 'Kod' },
  { label: '🔴',  style: 'color:#e60000',                           wrap: ['<span style="color:#e60000">','</span>'], title: 'Kırmızı' },
  { label: '🟢',  style: 'color:#2ea44f',                           wrap: ['<span style="color:#2ea44f">','</span>'], title: 'Yeşil' },
  { label: '🔵',  style: 'color:#007bff',                           wrap: ['<span style="color:#007bff">','</span>'], title: 'Mavi' },
  { label: '🟡',  style: 'color:#f7df1e',                           wrap: ['<span style="color:#f7df1e">','</span>'], title: 'Sarı' },
];

export default function CommentEditor({ value, onChange, placeholder, disabled, rows = 4 }: Props) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(wrap: [string, string]) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newVal = value.slice(0, start) + wrap[0] + (selected || 'metin') + wrap[1] + value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + wrap[0].length, start + wrap[0].length + (selected || 'metin').length);
    }, 0);
  }

  function insertEmoji(emoji: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newVal = value.slice(0, pos) + emoji + value.slice(pos);
    onChange(newVal);
    setShowEmoji(false);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + emoji.length, pos + emoji.length); }, 0);
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: '6px', overflow: 'hidden', background: '#111' }}>
      {/* Araç çubuğu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '6px 8px', borderBottom: '1px solid #222', background: '#0d0d0d', flexWrap: 'wrap' }}>
        {FORMATS.map(f => (
          <button
            key={f.title}
            type="button"
            title={f.title}
            onClick={() => applyFormat(f.wrap as [string, string])}
            disabled={disabled}
            style={{
              background: 'none',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              color: '#888',
              padding: '3px 7px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              minWidth: '28px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e60000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            {f.label}
          </button>
        ))}

        {/* Emoji butonu */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            title="Emoji"
            onClick={() => setShowEmoji(s => !s)}
            disabled={disabled}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#888', padding: '3px 7px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#e60000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            😀
          </button>
          {showEmoji && (
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px', width: '220px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => insertEmoji(e)}
                  style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '3px', borderRadius: '4px', transition: 'background 0.1s' }}
                  onMouseEnter={ev => (ev.currentTarget.style.background = '#222')}
                  onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
                >{e}</button>
              ))}
            </div>
          )}
        </div>

        {/* Önizleme toggle */}
        <button
          type="button"
          title={preview ? 'Düzenle' : 'Önizle'}
          onClick={() => setPreview(p => !p)}
          style={{ marginLeft: 'auto', background: preview ? '#e60000' : 'none', border: '1px solid #2a2a2a', borderRadius: '4px', color: preview ? '#fff' : '#888', padding: '3px 8px', fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          <i className={`fa-solid ${preview ? 'fa-pen' : 'fa-eye'}`} style={{ marginRight: '4px' }}></i>
          {preview ? 'Düzenle' : 'Önizle'}
        </button>
      </div>

      {/* Textarea veya Önizleme */}
      {preview ? (
        <div
          dangerouslySetInnerHTML={{ __html: value || '<span style="color:#555">Önizleme boş...</span>' }}
          style={{ padding: '12px', minHeight: '100px', color: '#ccc', fontSize: '14px', lineHeight: 1.6, wordBreak: 'break-word' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Yorumunuzu yazın... (Araç çubuğunu kullanarak biçimlendirebilirsiniz)'}
          disabled={disabled}
          rows={rows}
          style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'vertical', fontSize: '14px', lineHeight: 1.6, fontFamily: 'inherit' }}
        />
      )}

      {/* Alt bilgi */}
      <div style={{ padding: '4px 10px', borderTop: '1px solid #1a1a1a', fontSize: '10px', color: '#444', display: 'flex', gap: '10px' }}>
        <span><strong style={{ color: '#555' }}>K</strong> kalın</span>
        <span><em style={{ color: '#555' }}>İ</em> italik</span>
        <span style={{ color: '#555' }}>&lt;/&gt; kod</span>
        <span style={{ color: '#555' }}>😀 emoji</span>
      </div>
    </div>
  );
}
