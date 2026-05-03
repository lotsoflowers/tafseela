'use client';

import type { ReactNode, MouseEvent } from 'react';
import { Glass, useTweaks } from './Glass';

// ── Sheet ─────────────────────────────────────────────────────────

interface SheetProps {
  children: ReactNode;
  title?: string;
  dark?: boolean;
  className?: string;
}

export function Sheet({ children, title, dark, className }: SheetProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <Glass radius={28} dark={isDark} blur={t.blur + 6} className={className}>
      <div style={{ padding: '12px 0 24px' }}>
        <div
          style={{
            width: 36,
            height: 5,
            borderRadius: 999,
            background: isDark ? 'rgba(255,244,237,0.3)' : 'rgba(44,44,42,0.18)',
            margin: '0 auto 8px',
          }}
        />
        {title && (
          <div
            style={{
              textAlign: 'center',
              fontSize: 17,
              fontWeight: 600,
              padding: '8px 16px 12px',
              color: isDark ? '#FFF4ED' : '#2C2C2A',
            }}
          >
            {title}
          </div>
        )}
        <div style={{ padding: '0 16px' }}>{children}</div>
      </div>
    </Glass>
  );
}

// ── Alert ─────────────────────────────────────────────────────────

interface AlertProps {
  title: string;
  message?: string;
  primary?: string;
  secondary?: string;
  destructive?: boolean;
  onPrimary?: (e: MouseEvent<HTMLButtonElement>) => void;
  onSecondary?: (e: MouseEvent<HTMLButtonElement>) => void;
  dark?: boolean;
  className?: string;
}

export function Alert({
  title,
  message,
  primary = 'OK',
  secondary,
  destructive,
  onPrimary,
  onSecondary,
  dark,
  className,
}: AlertProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const btn = (bold: boolean, color?: string) => ({
    flex: 1,
    height: 44,
    border: 'none',
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: 17,
    fontWeight: bold ? 600 : 400,
    color: color || (isDark ? '#FFF4ED' : '#2C2C2A'),
    cursor: 'pointer',
  } as const);

  return (
    <Glass radius={22} dark={isDark} blur={t.blur + 8} intensity="heavy" className={className} style={{ width: 270 }}>
      <div
        style={{
          padding: '20px 16px 0',
          textAlign: 'center',
          color: isDark ? '#FFF4ED' : '#2C2C2A',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 600 }}>{title}</div>
        {message && (
          <div
            style={{
              fontSize: 13,
              marginTop: 4,
              color: isDark ? 'rgba(255,244,237,0.7)' : 'rgba(44,44,42,0.7)',
            }}
          >
            {message}
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          borderTop: `0.5px solid ${isDark ? 'rgba(255,244,237,0.15)' : 'rgba(44,44,42,0.12)'}`,
          marginTop: 18,
        }}
      >
        {secondary && (
          <>
            <button type="button" style={btn(false)} onClick={onSecondary}>
              {secondary}
            </button>
            <div
              style={{
                width: 0.5,
                background: isDark ? 'rgba(255,244,237,0.15)' : 'rgba(44,44,42,0.12)',
              }}
            />
          </>
        )}
        <button type="button" style={btn(true, destructive ? '#D1314B' : t.accent)} onClick={onPrimary}>
          {primary}
        </button>
      </div>
    </Glass>
  );
}

// ── Toast ─────────────────────────────────────────────────────────

interface ToastProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: string;
  onAction?: (e: MouseEvent<HTMLSpanElement>) => void;
  dark?: boolean;
  className?: string;
}

export function Toast({ icon, title, message, action, onAction, dark, className }: ToastProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <Glass radius={18} dark={isDark} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: t.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF4ED',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#FFF4ED' : '#2C2C2A' }}>{title}</div>
          {message && (
            <div
              style={{
                fontSize: 12,
                color: isDark ? 'rgba(255,244,237,0.65)' : 'rgba(44,44,42,0.65)',
                marginTop: 1,
              }}
            >
              {message}
            </div>
          )}
        </div>
        {action && (
          <span onClick={onAction} style={{ fontSize: 14, fontWeight: 590, color: t.accent, cursor: 'pointer' }}>
            {action}
          </span>
        )}
      </div>
    </Glass>
  );
}
