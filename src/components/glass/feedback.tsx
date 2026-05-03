'use client';

import { Sparkle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTweaks } from './Glass';

// ── Spinner ───────────────────────────────────────────────────────

interface SpinnerProps {
  size?: number;
  color?: string;
  dark?: boolean;
  className?: string;
}

export function Spinner({ size = 22, color, dark, className }: SpinnerProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${size * 0.12}px solid ${isDark ? 'rgba(255,244,237,0.15)' : 'rgba(44,44,42,0.12)'}`,
        borderTopColor: color || t.accent,
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

// ── ProgressBar ───────────────────────────────────────────────────

interface ProgressBarProps {
  value?: number;
  dark?: boolean;
  className?: string;
}

export function ProgressBar({ value = 0.4, dark, className }: ProgressBarProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <div
      className={className}
      style={{
        height: 6,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        background: isDark ? 'rgba(255,244,237,0.14)' : 'rgba(44,44,42,0.1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          borderRadius: 3,
          width: `${value * 100}%`,
          background: `linear-gradient(90deg, ${t.accentSoft}, ${t.accent})`,
          boxShadow: `0 0 10px ${t.accent}88`,
        }}
      />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  dark?: boolean;
  className?: string;
}

export function EmptyState({ icon, title, message, action, dark, className }: EmptyStateProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <div className={className} style={{ textAlign: 'center', padding: 24 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          margin: '0 auto 16px',
          background: t.accent + '18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: t.accent,
        }}
      >
        {icon || <Sparkle size={28} color={t.accent} />}
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: isDark ? '#FFF4ED' : '#2C2C2A' }}>{title}</div>
      {message && (
        <div
          style={{
            fontSize: 14,
            color: isDark ? 'rgba(255,244,237,0.6)' : 'rgba(44,44,42,0.6)',
            marginTop: 4,
            maxWidth: 240,
            marginInline: 'auto',
          }}
        >
          {message}
        </div>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
