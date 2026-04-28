'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const ROLE_META: Record<string, { label: string; color: string; icon: string }> = {
  admin:  { label: 'Yönetici',  color: '#e60000', icon: 'fa-user-shield' },
  mod:    { label: 'Moderatör', color: '#2ea44f', icon: 'fa-shield-halved' },
  author: { label: 'Yazar',     color: '#ff8c00', icon: 'fa-pen-nib' },
  member: { label: 'Üye',       color: '#007bff', icon: 'fa-user' },
};

interface Props {
  authorName: string;
  authorId?: string;
}

export default function AuthorBadge({ authorName, authorId }: Props) {
  const finalAuthorId = authorId || (authorName.toUpperCase().includes('NBK') ? 'e2a270ed-39b1-4de8-8b22-4784dbfe27ca' : undefined);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!finalAuthorId) return;
    supabase
      .from('profiles')
      .select('role')
      .eq('id', finalAuthorId)
      .single()
      .then(({ data }) => { if (data?.role) setRole(data.role); });
  }, [finalAuthorId]);

  const meta = role ? ROLE_META[role] : null;
  const profileHref = `/user/${encodeURIComponent(finalAuthorId || authorName)}`;

  return (
    <Link
      href={profileHref}
      className="author-link"
      style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#888' }}
    >
      <i className="fa-solid fa-user" style={{ color: '#e60000', fontSize: '11px' }}></i>
      <span style={{ fontWeight: 600 }}>{authorName}</span>

      {/* Rütbe rozeti */}
      {meta && (
        <span
          title={meta.label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: meta.color + '22',
            color: meta.color,
            border: `1px solid ${meta.color}55`,
            borderRadius: '4px',
            padding: '1px 6px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.3px',
            cursor: 'default',
          }}
        >
          <i className={`fa-solid ${meta.icon}`} style={{ fontSize: '9px' }}></i>
          {meta.label}
        </span>
      )}
    </Link>
  );
}
