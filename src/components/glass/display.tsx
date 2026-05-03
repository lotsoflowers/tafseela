'use client';

import type { ReactNode, MouseEvent, CSSProperties } from 'react';
import { Glass, useTweaks } from './Glass';

// ── Badge ─────────────────────────────────────────────────────────

export type BadgeVariant = 'accent' | 'soft' | 'plum' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dark?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'accent', dark, className }: BadgeProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const palette: Record<BadgeVariant, { bg: string; fg: string }> = {
    accent: { bg: t.accent, fg: '#FFF4ED' },
    soft: { bg: t.accentSoft, fg: t.accent2 },
    plum: { bg: t.accent2, fg: '#FFF4ED' },
    neutral: {
      bg: isDark ? 'rgba(255,244,237,0.16)' : 'rgba(44,44,42,0.10)',
      fg: isDark ? '#FFF4ED' : '#2C2C2A',
    },
  };
  const p = palette[variant];
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 9px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.1,
        background: p.bg,
        color: p.fg,
      }}
    >
      {children}
    </span>
  );
}

// ── Chip ──────────────────────────────────────────────────────────

interface ChipProps {
  children: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  dark?: boolean;
  className?: string;
}

export function Chip({ children, icon, selected, onClick, dark, className }: ChipProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  if (selected) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 14px',
          height: 34,
          borderRadius: 9999,
          background: t.accent,
          color: '#FFF4ED',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 590,
          boxShadow: `0 4px 10px ${t.accent}44`,
        }}
      >
        {icon}
        {children}
      </button>
    );
  }
  return (
    <Glass as="button" radius={9999} dark={isDark} className={className} onClick={onClick} style={{ height: 34, border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 14px',
          height: 34,
          fontSize: 14,
          fontWeight: 590,
          color: isDark ? '#FFF4ED' : '#2C2C2A',
        }}
      >
        {icon}
        {children}
      </span>
    </Glass>
  );
}

// ── Avatar ────────────────────────────────────────────────────────

interface AvatarProps {
  initials?: string;
  size?: number;
  status?: 'online' | 'busy' | 'away';
  color?: [string, string];
  dark?: boolean;
  className?: string;
}

export function Avatar({ initials = 'AB', size = 40, status, color, dark, className }: AvatarProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const palettes: [string, string][] = [
    [t.accent, t.accent2],
    [t.accentSoft, t.accent],
    [t.accent2, '#7A1454'],
    ['#D1314B', t.accent],
    ['#3A2030', t.accentSoft],
  ];
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % palettes.length;
  const [a, b] = color || palettes[idx];
  const dotSize = Math.round(size * 0.3);

  return (
    <div className={className} style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${a}, ${b})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 600,
          fontSize: size * 0.4,
          boxShadow: `0 2px 8px ${b}44, inset 0 0.5px 0 rgba(255,255,255,0.5), inset 0 -0.5px 0 rgba(0,0,0,0.1)`,
          letterSpacing: 0.5,
        }}
      >
        {initials}
      </div>
      {status && (
        <div
          style={{
            position: 'absolute',
            right: -1,
            bottom: -1,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: status === 'online' ? '#34C759' : status === 'busy' ? '#FF3B30' : '#FFCC00',
            border: `2px solid ${isDark ? '#1A0A14' : '#FFF4ED'}`,
          }}
        />
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  dark?: boolean;
  padding?: number;
  radius?: number;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, dark, padding = 16, radius, style, className }: CardProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <Glass radius={radius ?? t.radius} dark={isDark} className={className} style={style}>
      <div style={{ padding, color: isDark ? '#FFF4ED' : '#2C2C2A' }}>{children}</div>
    </Glass>
  );
}
