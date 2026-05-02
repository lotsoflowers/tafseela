'use client';

import { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { countries, type Country } from '@/data/countries';
import { cn } from '@/lib/utils';

interface CountryPickerProps {
  value?: string;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

export default function CountryPicker({ value, onSelect, onClose }: CountryPickerProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const selected = countries.find(c => c.code === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(c =>
      c.name.en.toLowerCase().includes(q) ||
      c.name.ar.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, Country[]> = {};
    for (const c of filtered) {
      const letter = c.name.en[0].toUpperCase();
      (groups[letter] ??= []).push(c);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex items-center gap-3 border-b border-blush/40 px-4 py-3 dark:border-border/40">
        <button
          type="button"
          onClick={onClose}
          aria-label={t({ en: 'Close', ar: 'إغلاق' })}
          className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-[15px] font-bold text-ink dark:text-foreground">
          {t({ en: 'Select your country', ar: 'اختاري بلدك' })}
        </h2>
      </div>

      <div className="px-4 py-3">
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 dark:bg-card">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t({ en: 'Search Country', ar: 'ابحثي عن بلد' })}
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </label>
      </div>

      <div className="overflow-y-auto pb-12" style={{ maxHeight: 'calc(100vh - 130px)' }}>
        {selected && (
          <>
            <h3 className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t({ en: 'Selected', ar: 'المحدد' })}
            </h3>
            <CountryRow country={selected} selected onClick={() => onSelect(selected)} />
          </>
        )}

        {grouped.map(([letter, items]) => (
          <div key={letter}>
            <h3 className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {letter}
            </h3>
            <ul>
              {items.map(c => (
                <li key={c.code}>
                  <CountryRow
                    country={c}
                    selected={c.code === value}
                    onClick={() => onSelect(c)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">
            {t({ en: 'No countries match.', ar: 'لا توجد بلدان مطابقة.' })}
          </p>
        )}
      </div>
    </div>
  );
}

function CountryRow({ country, selected, onClick }: { country: Country; selected: boolean; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-start hover:bg-cream dark:hover:bg-secondary',
        selected && 'bg-cream/60 dark:bg-secondary/60'
      )}
    >
      <span className="text-2xl leading-none">{country.flag}</span>
      <span className="flex-1 text-[14px] font-semibold text-ink dark:text-foreground">
        {t(country.name)}
      </span>
      {selected && <Check className="size-5 text-hero" />}
    </button>
  );
}
