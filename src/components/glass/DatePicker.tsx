'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTweaks } from './Glass';
import { Card } from './display';

interface DatePickerProps {
  value?: Date;
  onChange?: (d: Date) => void;
  dark?: boolean;
  className?: string;
}

const DAYS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function buildGrid(year: number, monthIdx: number): (number | null)[][] {
  const first = new Date(year, monthIdx, 1).getDay();
  const daysIn = new Date(year, monthIdx + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export function DatePicker({ value, onChange, dark, className }: DatePickerProps) {
  const t = useTweaks();
  const isDark = dark ?? t.mode === 'dark';
  const today = new Date();
  const [view, setView] = useState({ year: (value ?? today).getFullYear(), monthIdx: (value ?? today).getMonth() });
  const grid = buildGrid(view.year, view.monthIdx);

  const isToday = (n: number | null) =>
    n != null &&
    today.getFullYear() === view.year &&
    today.getMonth() === view.monthIdx &&
    today.getDate() === n;
  const isSelected = (n: number | null) =>
    n != null &&
    value &&
    value.getFullYear() === view.year &&
    value.getMonth() === view.monthIdx &&
    value.getDate() === n;

  const navMonth = (delta: number) => {
    setView(v => {
      let m = v.monthIdx + delta;
      let y = v.year;
      while (m < 0) {
        m += 12;
        y -= 1;
      }
      while (m > 11) {
        m -= 12;
        y += 1;
      }
      return { year: y, monthIdx: m };
    });
  };

  return (
    <Card dark={isDark} padding={16} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 600 }}>
          {MONTHS_EN[view.monthIdx]} {view.year}
        </div>
        <div style={{ display: 'flex', gap: 12, color: t.accent }}>
          <button type="button" onClick={() => navMonth(-1)} aria-label="Previous month" style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex' }}>
            <ChevronLeft size={20} color={t.accent} />
          </button>
          <button type="button" onClick={() => navMonth(1)} aria-label="Next month" style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex' }}>
            <ChevronRight size={20} color={t.accent} />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {DAYS_EN.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: isDark ? 'rgba(255,244,237,0.5)' : 'rgba(44,44,42,0.5)',
              padding: 4,
            }}
          >
            {d}
          </div>
        ))}
        {grid.flat().map((n, i) => {
          const today = isToday(n);
          const selected = isSelected(n);
          return (
            <button
              key={i}
              type="button"
              disabled={n == null}
              onClick={() => n != null && onChange?.(new Date(view.year, view.monthIdx, n))}
              style={{
                all: 'unset',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: today || selected ? 600 : 400,
                color: today || selected ? '#FFF4ED' : isDark ? '#FFF4ED' : '#2C2C2A',
                background: today || selected ? t.accent : 'transparent',
                borderRadius: '50%',
                opacity: n ? 1 : 0,
                cursor: n != null ? 'pointer' : 'default',
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
