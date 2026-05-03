'use client';

import type { ReactNode, MouseEvent } from 'react';
import { Glass, useTweaks } from './Glass';

interface IconButtonProps {
  icon: ReactNode;
  size?: number;
  dark?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  accent?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function IconButton({ icon, size = 44, dark, onClick, accent, ariaLabel, className }: IconButtonProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <Glass radius={9999} dark={isDark} className={className} style={{ width: size, height: size, display: 'inline-flex' }}>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        style={{
          all: 'unset',
          width: '100%',
          height: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: accent ? t.accent : isDark ? '#FFF4ED' : '#2C2C2A',
        }}
      >
        {icon}
      </button>
    </Glass>
  );
}
