'use client';

import type { ReactNode, MouseEvent } from 'react';
import { Glass, useTweaks } from './Glass';

interface ListGroupProps {
  children: ReactNode;
  header?: string;
  footer?: string;
  dark?: boolean;
  className?: string;
}

export function ListGroup({ children, header, footer, dark, className }: ListGroupProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <div className={className}>
      {header && (
        <div
          style={{
            padding: '0 16px 8px',
            fontSize: 12,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            color: isDark ? 'rgba(255,244,237,0.5)' : 'rgba(44,44,42,0.5)',
          }}
        >
          {header}
        </div>
      )}
      <Glass radius={t.radius} dark={isDark}>
        <div>{children}</div>
      </Glass>
      {footer && (
        <div
          style={{
            padding: '8px 16px 0',
            fontSize: 12,
            color: isDark ? 'rgba(255,244,237,0.5)' : 'rgba(44,44,42,0.5)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  trailing?: ReactNode;
  last?: boolean;
  accent?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  dark?: boolean;
  className?: string;
}

export function ListRow({ leading, title, subtitle, value, trailing, last, accent, onClick, dark, className }: ListRowProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderBottom: last ? 'none' : `0.5px solid ${isDark ? 'rgba(255,244,237,0.12)' : 'rgba(44,44,42,0.08)'}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {leading && (
        <div style={{ display: 'flex', alignItems: 'center', color: accent ? t.accent : undefined }}>
          {leading}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: accent ? t.accent : isDark ? '#FFF4ED' : '#2C2C2A',
            letterSpacing: -0.1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 13,
              color: isDark ? 'rgba(255,244,237,0.55)' : 'rgba(44,44,42,0.55)',
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {value && (
        <div style={{ fontSize: 15, color: isDark ? 'rgba(255,244,237,0.55)' : 'rgba(44,44,42,0.55)' }}>
          {value}
        </div>
      )}
      {trailing}
    </div>
  );
}
