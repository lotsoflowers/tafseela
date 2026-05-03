'use client';

import type { ReactNode, MouseEvent } from 'react';
import { Glass, Solid, useTweaks } from './Glass';

export type ButtonVariant = 'primary' | 'secondary' | 'tinted' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  trailing?: ReactNode;
  full?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  dark?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const heights: Record<ButtonSize, number> = { sm: 32, md: 44, lg: 52 };
const pads: Record<ButtonSize, string> = { sm: '0 14px', md: '0 20px', lg: '0 24px' };
const fs: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 17 };

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  trailing,
  full,
  onClick,
  dark,
  className,
  type = 'button',
  disabled,
}: ButtonProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const h = heights[size];
  const radius = h / 2;

  const inner = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: h,
        padding: full ? 0 : pads[size],
        width: full ? '100%' : 'auto',
        fontSize: fs[size],
        fontWeight: 590,
        letterSpacing: -0.2,
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {icon}
      {children}
      {trailing}
    </span>
  );

  const wrapStyle = {
    display: full ? 'block' : 'inline-block',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 120ms ease-out',
  };

  const handleClick = disabled ? undefined : onClick;

  if (variant === 'primary') {
    return (
      <Solid radius={radius} color={t.accent} style={wrapStyle} className={className}>
        <button type={type} onClick={handleClick} disabled={disabled} style={{ all: 'unset', display: 'inline-block', width: full ? '100%' : 'auto', color: '#FFF4ED' }}>
          {inner}
        </button>
      </Solid>
    );
  }
  if (variant === 'destructive') {
    return (
      <Solid radius={radius} color="#D1314B" style={wrapStyle} className={className}>
        <button type={type} onClick={handleClick} disabled={disabled} style={{ all: 'unset', display: 'inline-block', width: full ? '100%' : 'auto', color: 'white' }}>
          {inner}
        </button>
      </Solid>
    );
  }
  if (variant === 'secondary') {
    return (
      <Glass radius={radius} dark={isDark} style={wrapStyle} className={className}>
        <button type={type} onClick={handleClick} disabled={disabled} style={{ all: 'unset', display: 'inline-block', width: full ? '100%' : 'auto', color: isDark ? '#FFF4ED' : '#2C2C2A' }}>
          {inner}
        </button>
      </Glass>
    );
  }
  if (variant === 'tinted') {
    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={className}
        style={{
          all: 'unset',
          display: full ? 'block' : 'inline-block',
          width: full ? '100%' : 'auto',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          borderRadius: radius,
          background: t.accent + '22',
          boxShadow: `inset 0 0 0 0.5px ${t.accent}33`,
          color: t.accent,
        }}
      >
        {inner}
      </button>
    );
  }
  // ghost
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={{
        all: 'unset',
        display: full ? 'block' : 'inline-block',
        width: full ? '100%' : 'auto',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: t.accent,
      }}
    >
      {inner}
    </button>
  );
}
