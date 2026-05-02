'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Camera, ChevronLeft, ChevronRight, X, SlidersHorizontal, Sparkle } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SegmentedSubtabs from '@/components/shared/SegmentedSubtabs';
import ProductCard from '@/components/product/ProductCard';
import OutfitCard from '@/components/outfit/OutfitCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import { outfits } from '@/data/outfits';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

const PREVIOUS_KEY = 'tafseela-recent-searches';
const MAX_PREVIOUS = 10;

type ResultsTab = 'outfits' | 'items';

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, direction } = useLanguage();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [committed, setCommitted] = useState(params.get('q') ?? '');
  const [previous, setPrevious] = useState<string[]>([]);
  const [tab, setTab] = useState<ResultsTab>('items');
  const [showCameraStub, setShowCameraStub] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(params.get('category'));

  useEffect(() => {
    const saved = localStorage.getItem(PREVIOUS_KEY);
    if (saved) {
      try {
        setPrevious(JSON.parse(saved));
      } catch {
        localStorage.removeItem(PREVIOUS_KEY);
      }
    }
  }, []);

  const persistPrevious = (next: string[]) => {
    setPrevious(next);
    localStorage.setItem(PREVIOUS_KEY, JSON.stringify(next));
  };

  const commitSearch = (q: string) => {
    const trimmed = q.trim();
    setCommitted(trimmed);
    if (!trimmed) return;
    const next = [trimmed, ...previous.filter(p => p !== trimmed)].slice(0, MAX_PREVIOUS);
    persistPrevious(next);
  };

  const clearOnePrevious = (q: string) => persistPrevious(previous.filter(p => p !== q));
  const clearAllPrevious = () => persistPrevious([]);

  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;

  // Live suggestions while typing
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const items: { type: 'item' | 'outfit'; label: string }[] = [];
    products.forEach(p => {
      if (p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q)) {
        items.push({ type: 'item', label: p.name.en });
      }
    });
    outfits.forEach(o => {
      if (o.name.en.toLowerCase().includes(q) || o.name.ar.includes(q)) {
        items.push({ type: 'outfit', label: o.name.en });
      }
    });
    return items.slice(0, 8);
  }, [query]);

  // Filtered results when query is committed
  const matchedProducts = useMemo(() => {
    let result = products;
    const q = committed.trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.ar.includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter(p => p.categoryId === categoryFilter);
    }
    return result;
  }, [committed, categoryFilter]);

  const matchedOutfits = useMemo(() => {
    const q = committed.trim().toLowerCase();
    if (!q) return outfits;
    return outfits.filter(o =>
      o.name.en.toLowerCase().includes(q) ||
      o.name.ar.includes(q)
    );
  }, [committed]);

  const isShowingResults = committed.trim().length > 0 || categoryFilter !== null;
  const isShowingSuggestions = query.trim().length > 0 && query !== committed;
  const isShowingPrevious = !isShowingResults && !isShowingSuggestions;

  const totalResults = matchedProducts.length + matchedOutfits.length;
  const showing = tab === 'outfits' ? matchedOutfits.length : matchedProducts.length;

  const subtabs = [
    { id: 'outfits' as const, label: { en: 'Outfits', ar: 'الإطلالات' }, count: matchedOutfits.length },
    { id: 'items' as const, label: { en: 'Items', ar: 'القطع' }, count: matchedProducts.length },
  ];

  const activeCategory = categoryFilter ? categories.find(c => c.id === categoryFilter) : null;

  return (
    <PageShell showTopBar={false} showBottomNav={false}>
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-blush/40 bg-background/95 px-3 py-3 backdrop-blur-md dark:border-border/40">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <Back className="size-5" />
        </button>
        <label className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 dark:bg-card">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') commitSearch(query);
            }}
            placeholder={t({ en: "Try 'sweater'", ar: 'جرّبي "بلوزة"' })}
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCommitted('');
              }}
              aria-label={t({ en: 'Clear', ar: 'مسح' })}
              className="text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowCameraStub(true)}
            aria-label={t({ en: 'Search by image', ar: 'البحث بالصورة' })}
            className="text-muted-foreground"
          >
            <Camera className="size-4" />
          </button>
        </label>
      </div>

      <div className="mx-auto max-w-lg">
        {/* Active category chip */}
        {activeCategory && (
          <div className="px-4 pt-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-[12px] font-semibold text-plum dark:bg-secondary dark:text-foreground">
              {t(activeCategory.name)}
              <button
                type="button"
                onClick={() => setCategoryFilter(null)}
                aria-label={t({ en: 'Remove filter', ar: 'إزالة' })}
                className="text-plum/60 dark:text-foreground/60"
              >
                <X className="size-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* Previous searches */}
        {isShowingPrevious && previous.length > 0 && (
          <section className="px-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {t({ en: 'Previous searches', ar: 'عمليات البحث السابقة' })}
              </h3>
              <button
                type="button"
                onClick={clearAllPrevious}
                className="text-[12px] font-semibold text-hero"
              >
                {t({ en: 'Clear all', ar: 'مسح الكل' })}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {previous.map(q => (
                <span
                  key={q}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-ink shadow-[0_1px_2px_rgba(92,10,61,0.04)] dark:bg-card dark:text-foreground"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      commitSearch(q);
                    }}
                  >
                    {q}
                  </button>
                  <button
                    type="button"
                    onClick={() => clearOnePrevious(q)}
                    aria-label={t({ en: 'Remove', ar: 'إزالة' })}
                    className="text-muted-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </section>
        )}

        {isShowingPrevious && previous.length === 0 && !activeCategory && (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-cream dark:bg-secondary">
              <Search className="size-9 text-soft" strokeWidth={1.5} />
            </span>
            <p className="text-[15px] font-semibold text-ink dark:text-foreground">
              {t({ en: 'Search outfits, items, and brands', ar: 'ابحثي عن إطلالات وقطع وماركات' })}
            </p>
            <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
              {t({
                en: 'Type a query, or tap the camera to search by image.',
                ar: 'اكتبي ما تبحثين عنه، أو اضغطي الكاميرا للبحث بالصورة.',
              })}
            </p>
          </div>
        )}

        {/* Suggestions */}
        {isShowingSuggestions && (
          <section className="pt-2">
            <ul className="divide-y divide-blush/40 dark:divide-border/40">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(s.label);
                      commitSearch(s.label);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-start"
                  >
                    {s.type === 'outfit' ? (
                      <Sparkle className="size-4 text-hero" fill="currentColor" strokeWidth={1.5} />
                    ) : (
                      <Search className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-[14px] text-ink dark:text-foreground">
                      {s.type === 'outfit'
                        ? t({ en: `Outfits with ${s.label}`, ar: `إطلالات بـ ${s.label}` })
                        : s.label}
                    </span>
                  </button>
                </li>
              ))}
              {suggestions.length === 0 && (
                <li className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                  {t({ en: 'No matches.', ar: 'لا توجد مطابقات.' })}
                </li>
              )}
            </ul>
          </section>
        )}

        {/* Results */}
        {isShowingResults && (
          <>
            <div className="mt-2 flex items-center justify-between px-4">
              <p className="text-[13px] text-muted-foreground">
                {t({
                  en: `${totalResults} results${committed ? ` for "${committed}"` : ''}`,
                  ar: `${totalResults} نتيجة${committed ? ` لـ "${committed}"` : ''}`,
                })}
              </p>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-[12px] font-semibold text-plum dark:bg-secondary dark:text-foreground"
              >
                <SlidersHorizontal className="size-3.5" strokeWidth={2} />
                {t({ en: 'Filters', ar: 'التصفية' })}
              </button>
            </div>

            <div className="px-2 pt-2">
              <SegmentedSubtabs items={subtabs} active={tab} onChange={setTab} />
            </div>

            <div className="px-4 pt-3 pb-12">
              {tab === 'items' ? (
                matchedProducts.length === 0 ? (
                  <EmptyResults />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {matchedProducts.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )
              ) : matchedOutfits.length === 0 ? (
                <EmptyResults />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {matchedOutfits.map(o => (
                    <OutfitCard key={o.id} outfit={o} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showCameraStub && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/40 backdrop-blur-sm" onClick={() => setShowCameraStub(false)}>
          <div
            onClick={e => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-white p-6 dark:bg-card"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20" />
            <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cream dark:bg-secondary">
              <Camera className="size-8 text-hero" strokeWidth={1.75} />
            </span>
            <h2 className="text-center text-[18px] font-bold text-ink dark:text-foreground">
              {t({ en: 'Search by image', ar: 'البحث بالصورة' })}
            </h2>
            <p className="mt-2 text-center text-[13px] text-muted-foreground">
              {t({
                en: 'Take a photo of any outfit and we\'ll find similar pieces in our catalog. (Coming soon.)',
                ar: 'التقطي صورة لأي إطلالة وسنجد قطعاً مشابهة في كتالوجنا. (قريباً.)',
              })}
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink/30 py-3.5 text-[15px] font-bold text-white/80 dark:bg-foreground/20"
              >
                {t({ en: 'Allow camera', ar: 'السماح بالكاميرا' })}
              </button>
              <button
                type="button"
                onClick={() => setShowCameraStub(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-cream py-3.5 text-[15px] font-bold text-plum dark:bg-secondary dark:text-foreground"
              >
                {t({ en: 'Not now', ar: 'ليس الآن' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function EmptyResults() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <p className="text-[14px] font-semibold text-ink dark:text-foreground">
        {t({ en: 'No matches', ar: 'لا توجد مطابقات' })}
      </p>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
        {t({ en: 'Try different keywords or remove filters.', ar: 'جرّبي كلمات أخرى أو أزيلي التصفية.' })}
      </p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
