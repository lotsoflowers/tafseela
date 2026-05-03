'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Glass, useTweaks } from './Glass';

// ── NavBar ────────────────────────────────────────────────────────

interface NavBarProps {
  title?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  large?: boolean;
  dark?: boolean;
  className?: string;
}

export function NavBar({ title, leading, trailing, large, dark, className }: NavBarProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <div className={className} style={{ padding: '8px 16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{leading}</div>
        {!large && (
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: isDark ? '#FFF4ED' : '#2C2C2A',
              letterSpacing: -0.3,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{trailing}</div>
      </div>
      {large && (
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            marginTop: 4,
            color: isDark ? '#FFF4ED' : '#2C2C2A',
            letterSpacing: -0.8,
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}

// ── TabBar (floating dock) ────────────────────────────────────────

interface TabItem {
  id: string;
  icon: ReactNode;
  label?: string;
  href?: string;
}

interface TabBarProps {
  items: TabItem[];
  active?: string;
  onChange?: (id: string) => void;
  dark?: boolean;
  className?: string;
}

export function TabBar({ items, active, onChange, dark, className }: TabBarProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const [internalActive, setInternalActive] = useState(active ?? items[0]?.id);
  useEffect(() => {
    if (active !== undefined) setInternalActive(active);
  }, [active]);
  const current = active ?? internalActive;

  return (
    <Glass radius={9999} dark={isDark} blur={t.blur + 4} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', padding: 6, gap: 2 }}>
        {items.map(it => {
          const a = it.id === current;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                if (active === undefined) setInternalActive(it.id);
                onChange?.(it.id);
              }}
              style={{
                border: 'none',
                background: a ? t.accent : 'transparent',
                borderRadius: 9999,
                padding: a ? '0 16px' : 0,
                height: 44,
                minWidth: 44,
                cursor: 'pointer',
                color: a ? '#FFF4ED' : isDark ? '#FFF4ED' : '#2C2C2A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 590,
                boxShadow: a ? `0 4px 12px ${t.accent}55` : 'none',
                transition: 'all 0.22s cubic-bezier(.4,.8,.4,1)',
              }}
            >
              {it.icon}
              {a && it.label && <span>{it.label}</span>}
            </button>
          );
        })}
      </div>
    </Glass>
  );
}

// ── TopPill (icon-less segmented for For You / Followed Brands) ──

interface TopPillProps {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  dark?: boolean;
  rtl?: boolean;
  className?: string;
}

export function TopPill({ options, value, onChange, dark, rtl, className }: TopPillProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const arr = rtl ? [...options].reverse() : options;
  const current = value ?? options[0];
  return (
    <Glass radius={9999} dark={isDark} blur={t.blur + 4} className={className}>
      <div style={{ display: 'flex', padding: 4, gap: 2, direction: rtl ? 'rtl' : 'ltr' }}>
        {arr.map(o => {
          const active = o === current;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange?.(o)}
              style={{
                border: 'none',
                cursor: 'pointer',
                flex: 1,
                padding: '0 18px',
                height: 36,
                borderRadius: 9999,
                fontFamily: rtl ? '"Noto Kufi Arabic", "SF Arabic", "Geist", system-ui' : 'inherit',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: rtl ? 0 : -0.2,
                background: active
                  ? isDark
                    ? 'rgba(255,244,237,0.18)'
                    : 'rgba(255,255,255,0.95)'
                  : 'transparent',
                color: isDark ? '#FFF4ED' : '#2C2C2A',
                boxShadow: active ? '0 2px 6px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.7)' : 'none',
                transition: 'background 0.18s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </Glass>
  );
}
