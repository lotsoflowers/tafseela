'use client';

import { Minus, Plus } from 'lucide-react';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Glass, useTweaks } from './Glass';

// ── Toggle ────────────────────────────────────────────────────────

interface ToggleProps {
  on?: boolean;
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
  dark?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Toggle({ on, defaultOn = false, onChange, dark, ariaLabel, className }: ToggleProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const [internalOn, setInternalOn] = useState(defaultOn);
  const isControlled = on !== undefined;
  const value = isControlled ? on : internalOn;

  const handle = () => {
    const next = !value;
    if (!isControlled) setInternalOn(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      onClick={handle}
      className={className}
      style={{
        all: 'unset',
        display: 'inline-block',
        width: 51,
        height: 31,
        borderRadius: 9999,
        position: 'relative',
        background: value ? t.accent : isDark ? 'rgba(255,244,237,0.16)' : 'rgba(44,44,42,0.18)',
        transition: 'background 0.22s ease',
        cursor: 'pointer',
        boxShadow: value
          ? `inset 0 0 0 0.5px ${t.accent}, 0 1px 2px rgba(0,0,0,0.05)`
          : 'inset 0 0.5px 1px rgba(0,0,0,0.08)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: value ? 22 : 2,
          width: 27,
          height: 27,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.22s cubic-bezier(.4,.8,.4,1)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.18), 0 1px 1px rgba(0,0,0,0.06)',
        }}
      />
    </button>
  );
}

// ── Slider ────────────────────────────────────────────────────────

interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  ticks?: boolean;
  dark?: boolean;
  className?: string;
}

export function Slider({ value, defaultValue = 0.5, onChange, ticks, dark, className }: SliderProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const v = isControlled ? value : internal;

  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      ref={ref}
      onPointerDown={e => {
        dragging.current = true;
        (e.target as Element).setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={e => dragging.current && update(e.clientX)}
      onPointerUp={() => {
        dragging.current = false;
      }}
      className={className}
      style={{ height: 32, position: 'relative', cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 13,
          height: 6,
          borderRadius: 3,
          background: isDark ? 'rgba(255,244,237,0.16)' : 'rgba(44,44,42,0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 6,
            borderRadius: 3,
            width: `${v * 100}%`,
            background: `linear-gradient(90deg, ${t.accentSoft}, ${t.accent})`,
            boxShadow: `0 0 12px ${t.accent}66`,
          }}
        />
        {ticks &&
          Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${i * 10}%`,
                top: -3,
                width: 2,
                height: 12,
                borderRadius: 1,
                background: isDark ? 'rgba(255,244,237,0.25)' : 'rgba(44,44,42,0.18)',
              }}
            />
          ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `calc(${v * 100}% - 14px)`,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'white',
          boxShadow: `0 4px 10px ${t.accent}55, 0 1px 2px rgba(0,0,0,0.12), inset 0 0.5px 0 rgba(255,255,255,1)`,
          border: `0.5px solid ${t.accent}33`,
        }}
      />
    </div>
  );
}

// ── Stepper ───────────────────────────────────────────────────────

interface StepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (v: number) => void;
  dark?: boolean;
  className?: string;
}

export function Stepper({ value, defaultValue = 1, min = 0, max = 99, onChange, dark, className }: StepperProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const v = isControlled ? value : internal;

  const update = (next: number) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const btn = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    width: 44,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDark ? '#FFF4ED' : '#2C2C2A',
  } as const;

  const divider = (
    <div
      style={{
        width: 1,
        height: 18,
        background: isDark ? 'rgba(255,244,237,0.18)' : 'rgba(44,44,42,0.12)',
      }}
    />
  );

  return (
    <Glass radius={9999} dark={isDark} className={className} style={{ display: 'inline-block' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 36 }}>
        <button type="button" onClick={() => update(Math.max(min, v - 1))} disabled={v <= min} style={btn} aria-label="Decrease">
          <Minus size={18} />
        </button>
        {divider}
        <div
          style={{
            width: 36,
            textAlign: 'center',
            fontFeatureSettings: '"tnum"',
            fontSize: 16,
            fontWeight: 500,
            color: isDark ? '#FFF4ED' : '#2C2C2A',
          }}
        >
          {v}
        </div>
        {divider}
        <button type="button" onClick={() => update(Math.min(max, v + 1))} disabled={v >= max} style={btn} aria-label="Increase">
          <Plus size={18} />
        </button>
      </div>
    </Glass>
  );
}

// ── Segmented control ─────────────────────────────────────────────

interface SegmentedProps<T extends string = string> {
  options: { id: T; label: ReactNode }[];
  value?: T;
  defaultValue?: T;
  onChange?: (id: T) => void;
  dark?: boolean;
  full?: boolean;
  className?: string;
}

export function Segmented<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  dark,
  full,
  className,
}: SegmentedProps<T>) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const [internal, setInternal] = useState<T>(defaultValue ?? options[0].id);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internal;

  useEffect(() => {
    if (isControlled) setInternal(value);
  }, [value, isControlled]);

  return (
    <Glass radius={t.radius - 6} dark={isDark} className={className} style={{ display: full ? 'block' : 'inline-block' }}>
      <div style={{ display: 'flex', padding: 3, gap: 2 }}>
        {options.map(o => {
          const isActive = o.id === active;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                if (!isControlled) setInternal(o.id);
                onChange?.(o.id);
              }}
              style={{
                border: 'none',
                cursor: 'pointer',
                flex: full ? 1 : undefined,
                padding: '0 14px',
                height: 30,
                borderRadius: t.radius - 9,
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 590,
                letterSpacing: -0.1,
                background: isActive
                  ? isDark
                    ? 'rgba(255,244,237,0.16)'
                    : 'rgba(255,255,255,0.85)'
                  : 'transparent',
                color: isDark ? '#FFF4ED' : '#2C2C2A',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08), inset 0 0.5px 0 rgba(255,255,255,0.6)' : 'none',
                transition: 'background 0.18s ease',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Glass>
  );
}
