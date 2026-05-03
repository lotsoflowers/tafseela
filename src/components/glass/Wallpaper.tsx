'use client';

import { useTweaks } from './Glass';

interface WallpaperProps {
  className?: string;
}

export function Wallpaper({ className }: WallpaperProps) {
  const t = useTweaks();
  const dark = t.mode === 'dark';

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: dark
          ? `radial-gradient(ellipse at 0% 0%, ${t.accent2} 0%, transparent 55%),
             radial-gradient(ellipse at 100% 20%, ${t.accent}aa 0%, transparent 60%),
             radial-gradient(ellipse at 50% 100%, #3A1028 0%, transparent 60%),
             linear-gradient(180deg, #1A0814, #2A0F1F)`
          : `radial-gradient(ellipse at 0% 0%, ${t.accentSoft} 0%, transparent 55%),
             radial-gradient(ellipse at 100% 20%, ${t.accent}33 0%, transparent 60%),
             radial-gradient(ellipse at 50% 100%, ${t.accent2}20 0%, transparent 60%),
             linear-gradient(180deg, #FFF4ED, #FBE0E8)`,
      }}
    >
      {/* Fractal noise overlay */}
      <svg width="100%" height="100%" style={{ opacity: dark ? 0.18 : 0.10, mixBlendMode: 'overlay' }}>
        <filter id="wallpaper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wallpaper-noise)" />
      </svg>
    </div>
  );
}
