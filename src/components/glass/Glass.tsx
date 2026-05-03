'use client';

import React, { createContext, useContext, useState, useCallback, type CSSProperties, type ElementType, type ReactNode } from 'react';

// ── Theme tweaks ─────────────────────────────────────────────────
// Live-tweakable design tokens for the liquid-glass kit. Backed by a
// React context so any component down the tree can read them.

export type GlassIntensity = 'subtle' | 'balanced' | 'heavy';

export type Tweaks = {
  mode: 'light' | 'dark';
  accent: string;
  accent2: string;
  accentSoft: string;
  tintHue: number;
  blur: number;
  radius: number;
  intensity: GlassIntensity;
};

export const TWEAK_DEFAULTS: Tweaks = {
  mode: 'light',
  accent: '#BF066A',
  accent2: '#5C0A3D',
  accentSoft: '#ED93B1',
  tintHue: 330,
  blur: 22,
  radius: 18,
  intensity: 'heavy',
};

const TweaksContext = createContext<{
  tweaks: Tweaks;
  setTweaks: (patch: Partial<Tweaks>) => void;
}>({ tweaks: TWEAK_DEFAULTS, setTweaks: () => {} });

export function TweaksProvider({ children, initial }: { children: ReactNode; initial?: Partial<Tweaks> }) {
  const [tweaks, setState] = useState<Tweaks>({ ...TWEAK_DEFAULTS, ...initial });
  const setTweaks = useCallback((patch: Partial<Tweaks>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);
  return (
    <TweaksContext.Provider value={{ tweaks, setTweaks }}>
      {children}
    </TweaksContext.Provider>
  );
}

export function useTweaks() {
  return useContext(TweaksContext).tweaks;
}

export function useTweaksSetter() {
  return useContext(TweaksContext).setTweaks;
}

// ── GlassFill ─────────────────────────────────────────────────────
// The five stacked layers that make up a liquid-glass surface.

interface GlassFillProps {
  radius?: number | string;
  dark?: boolean;
  tintHue?: number;
  blur?: number;
  intensity?: GlassIntensity;
}

export function GlassFill({ radius = 'inherit', dark, tintHue = 330, blur = 22, intensity = 'heavy' }: GlassFillProps) {
  const tintLight = `hsla(${tintHue}, 60%, 96%, ${intensity === 'heavy' ? 0.42 : intensity === 'balanced' ? 0.55 : 0.7})`;
  const tintDark = `hsla(${tintHue}, 40%, 18%, ${intensity === 'heavy' ? 0.42 : intensity === 'balanced' ? 0.55 : 0.7})`;
  const tint = dark ? tintDark : tintLight;
  const sat = intensity === 'heavy' ? 200 : intensity === 'balanced' ? 180 : 150;
  const chroma = intensity === 'heavy' ? 1 : intensity === 'balanced' ? 0.5 : 0;

  const layerBase: CSSProperties = { position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none' };

  return (
    <>
      {/* 1. Backdrop blur + saturate + tint */}
      <div
        style={{
          ...layerBase,
          backdropFilter: `blur(${blur}px) saturate(${sat}%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${sat}%)`,
          background: tint,
        }}
      />
      {/* 2. Specular highlight */}
      <div
        style={{
          ...layerBase,
          background: dark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.35) 100%)',
          mixBlendMode: dark ? 'screen' : 'normal',
        }}
      />
      {/* 3. Chromatic edges (heavy intensity only) */}
      {chroma > 0 && (
        <div
          style={{
            ...layerBase,
            boxShadow: `inset 1px 0 0 hsla(${tintHue + 20}, 90%, 60%, ${0.35 * chroma}), inset -1px 0 0 hsla(${tintHue - 30}, 90%, 60%, ${0.30 * chroma})`,
          }}
        />
      )}
      {/* 4. Inner hairline */}
      <div
        style={{
          ...layerBase,
          boxShadow: dark
            ? 'inset 0 0.5px 0 rgba(255,255,255,0.22), inset 0 -0.5px 0 rgba(0,0,0,0.4)'
            : 'inset 0 0.5px 0 rgba(255,255,255,0.85), inset 0 -0.5px 0 rgba(0,0,0,0.06)',
        }}
      />
      {/* 5. Outer hairline */}
      <div
        style={{
          ...layerBase,
          border: dark ? '0.5px solid rgba(255,255,255,0.14)' : '0.5px solid rgba(44,44,42,0.10)',
        }}
      />
    </>
  );
}

// ── Glass wrapper ─────────────────────────────────────────────────

interface GlassProps {
  children?: ReactNode;
  radius?: number;
  dark?: boolean;
  tintHue?: number;
  blur?: number;
  intensity?: GlassIntensity;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  as?: ElementType;
  shadow?: boolean;
  [key: string]: unknown;
}

export function Glass({
  children,
  radius,
  dark,
  tintHue,
  blur,
  intensity,
  style = {},
  className,
  onClick,
  as: As = 'div',
  shadow = true,
  ...rest
}: GlassProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const r = radius ?? t.radius;
  const h = tintHue ?? t.tintHue;
  const b = blur ?? t.blur;
  const i = intensity ?? t.intensity;

  const Tag = As as ElementType;

  return (
    <Tag
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        borderRadius: r,
        overflow: 'hidden',
        boxShadow: shadow
          ? isDark
            ? '0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)'
            : '0 1px 0 rgba(255,255,255,0.7), 0 10px 28px rgba(92, 10, 61, 0.10), 0 3px 8px rgba(92, 10, 61, 0.06)'
          : 'none',
        ...style,
      }}
      {...rest}
    >
      <GlassFill radius={r} dark={isDark} tintHue={h} blur={b} intensity={i} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>{children}</div>
    </Tag>
  );
}

// ── Solid surface (non-glass accent fill, for primary buttons) ───

interface SolidProps {
  children?: ReactNode;
  color?: string;
  radius?: number;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  [key: string]: unknown;
}

export function Solid({ children, color, radius, style = {}, className, onClick, ...rest }: SolidProps) {
  const t = useTweaks();
  const r = radius ?? t.radius;
  const c = color ?? t.accent;
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        borderRadius: r,
        overflow: 'hidden',
        background: c,
        boxShadow: `0 6px 18px ${c}55, 0 2px 4px ${c}33, inset 0 0.5px 0 rgba(255,255,255,0.45), inset 0 -0.5px 0 rgba(0,0,0,0.18)`,
        ...style,
      }}
      {...rest}
    >
      {/* Highlight sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: r,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.10))',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
