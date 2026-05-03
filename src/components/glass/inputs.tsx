'use client';

import { Search, Mic } from 'lucide-react';
import type { ReactNode, ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { Glass, useTweaks } from './Glass';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  type?: HTMLInputTypeAttribute;
  dark?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function TextField({ label, placeholder, value, defaultValue, leading, trailing, type = 'text', dark, onChange, className }: TextFieldProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <label className={className} style={{ display: 'block' }}>
      {label && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
            color: isDark ? 'rgba(255,244,237,0.62)' : 'rgba(44,44,42,0.62)',
            letterSpacing: 0.1,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      )}
      <Glass radius={t.radius} dark={isDark}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 48 }}>
          {leading && (
            <span style={{ color: isDark ? 'rgba(255,244,237,0.5)' : 'rgba(44,44,42,0.5)', display: 'flex' }}>
              {leading}
            </span>
          )}
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 16,
              color: isDark ? '#FFF4ED' : '#2C2C2A',
              minWidth: 0,
            }}
          />
          {trailing}
        </div>
      </Glass>
    </label>
  );
}

interface SearchFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  dark?: boolean;
  showMic?: boolean;
  className?: string;
}

export function SearchField({ placeholder = 'Search', value, onChange, dark, showMic = true, className }: SearchFieldProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  return (
    <Glass radius={9999} dark={isDark} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', height: 40 }}>
        <Search size={18} color={isDark ? 'rgba(255,244,237,0.6)' : 'rgba(44,44,42,0.55)'} />
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'inherit',
            fontSize: 16,
            color: isDark ? '#FFF4ED' : '#2C2C2A',
            minWidth: 0,
          }}
        />
        {showMic && (
          <span style={{ color: isDark ? 'rgba(255,244,237,0.5)' : 'rgba(44,44,42,0.5)' }}>
            <Mic size={18} />
          </span>
        )}
      </div>
    </Glass>
  );
}
