'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Heart } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import SegmentedSubtabs from '@/components/shared/SegmentedSubtabs';
import OutfitCard from '@/components/outfit/OutfitCard';
import SavedItemRow from '@/components/saved/SavedItemRow';
import FolderCard from '@/components/saved/FolderCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useFolders } from '@/contexts/FoldersContext';
import { useBrandFollow } from '@/contexts/BrandFollowContext';
import { products } from '@/data/products';
import { outfits } from '@/data/outfits';
import { stores } from '@/data/stores';
import { cn } from '@/lib/utils';

type Subtab = 'outfits' | 'items' | 'folders' | 'brands';

export default function SavedPage() {
  const { t } = useLanguage();
  const { items: wishlistIds } = useWishlist();
  const { folders, createFolder } = useFolders();
  const { followed } = useBrandFollow();
  const [tab, setTab] = useState<Subtab>('items');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const savedOutfits = useMemo(
    () =>
      wishlistIds
        .filter(id => id.startsWith('outfit:'))
        .map(id => outfits.find(o => `outfit:${o.id}` === id))
        .filter(Boolean) as typeof outfits,
    [wishlistIds]
  );

  const savedItems = useMemo(
    () =>
      wishlistIds
        .filter(id => !id.startsWith('outfit:'))
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) as typeof products,
    [wishlistIds]
  );

  const followedStores = useMemo(
    () => followed.map(id => stores.find(s => s.id === id)).filter(Boolean) as typeof stores,
    [followed]
  );

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    createFolder(name);
    setNewFolderName('');
    setCreatingFolder(false);
  };

  const subtabs = [
    { id: 'outfits' as const, label: { en: 'Outfits', ar: 'الإطلالات' }, count: savedOutfits.length },
    { id: 'items' as const, label: { en: 'Items', ar: 'القطع' }, count: savedItems.length },
    { id: 'folders' as const, label: { en: 'Folders', ar: 'مجلدات' }, count: folders.length },
    { id: 'brands' as const, label: { en: 'Brands', ar: 'ماركات' }, count: followedStores.length },
  ];

  return (
    <PageShell>
      <div className="px-4 pt-2">
        <LargeTitle title={{ en: 'Saved', ar: 'المحفوظات' }} />
      </div>

      <div className="px-2 pt-2">
        <SegmentedSubtabs items={subtabs} active={tab} onChange={setTab} />
      </div>

      {tab === 'outfits' && (
        <section className="px-4 pt-4">
          {savedOutfits.length === 0 ? (
            <EmptyState
              title={{ en: 'No saved outfits yet', ar: 'لا توجد إطلالات محفوظة بعد' }}
              hint={{ en: 'Tap the heart on any outfit to save it here.', ar: 'اضغطي القلب على أي إطلالة لحفظها هنا.' }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedOutfits.map(o => (
                <OutfitCard key={o.id} outfit={o} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'items' && (
        <section className="pt-2">
          {savedItems.length === 0 ? (
            <div className="px-4 pt-4">
              <EmptyState
                title={{ en: 'No saved items yet', ar: 'لا توجد قطع محفوظة بعد' }}
                hint={{ en: 'Tap the heart on any product to save it here.', ar: 'اضغطي القلب على أي منتج لحفظه هنا.' }}
              />
            </div>
          ) : (
            <div className="mx-4 overflow-hidden rounded-3xl bg-white dark:bg-card">
              {savedItems.map((p, i) => (
                <div
                  key={p.id}
                  className={cn(i > 0 && 'border-t border-blush/60 dark:border-border/60')}
                >
                  <SavedItemRow product={p} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'folders' && (
        <section className="px-4 pt-4">
          <div className="mb-4">
            {creatingFolder ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value.slice(0, 25))}
                  placeholder={t({ en: 'Folder name', ar: 'اسم المجلد' })}
                  autoFocus
                  maxLength={25}
                  className="flex-1 rounded-full border border-soft/40 bg-white px-4 py-2 text-[14px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="rounded-full bg-hero px-4 py-2 text-[13px] font-bold text-white disabled:opacity-40"
                >
                  {t({ en: 'Create', ar: 'إنشاء' })}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCreatingFolder(true)}
                className="flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[13px] font-semibold text-plum dark:bg-secondary dark:text-foreground"
              >
                <Plus className="size-4" />
                {t({ en: 'Create new folder', ar: 'إنشاء مجلد جديد' })}
              </button>
            )}
          </div>
          {folders.length === 0 ? (
            <EmptyState
              title={{ en: 'No folders yet', ar: 'لا توجد مجلدات بعد' }}
              hint={{ en: 'Create folders to organize saved items and outfits.', ar: 'أنشئي مجلدات لتنظيم القطع والإطلالات المحفوظة.' }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {folders.map(f => (
                <FolderCard key={f.id} folder={f} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'brands' && (
        <section className="pt-4">
          {followedStores.length === 0 ? (
            <div className="px-4">
              <EmptyState
                title={{ en: 'Not following any brands yet', ar: 'لا تتابعين أي ماركة بعد' }}
                hint={{ en: 'Tap Follow on a brand in Catalog to see new arrivals here.', ar: 'اضغطي متابعة على ماركة من الفئات لترين الجديد هنا.' }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {followedStores.map(store => (
                <FollowedBrandSection key={store.id} storeId={store.id} />
              ))}
            </div>
          )}
        </section>
      )}

      <div className="h-12" />
    </PageShell>
  );
}

function EmptyState({ title, hint }: { title: { en: string; ar: string }; hint: { en: string; ar: string } }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-cream dark:bg-secondary">
        <Heart className="size-7 text-soft" strokeWidth={1.5} />
      </span>
      <p className="text-[15px] font-semibold text-ink dark:text-foreground">{t(title)}</p>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">{t(hint)}</p>
    </div>
  );
}

function FollowedBrandSection({ storeId }: { storeId: string }) {
  const { t } = useLanguage();
  const store = stores.find(s => s.id === storeId);
  if (!store) return null;
  const newArrivals = products.filter(p => p.storeId === storeId).slice(0, 6);
  const hasLogo = !!store.logo && /^(https?:\/\/|\/)/.test(store.logo);

  return (
    <div>
      <div className="flex items-center gap-3 px-4">
        <Link href={`/store/${store.id}`} className="flex items-center gap-3">
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blush/60 text-[13px] font-bold text-plum">
            {hasLogo ? (
              <Image src={store.logo} alt={t(store.name)} fill className="object-cover" />
            ) : (
              t(store.name).charAt(0)
            )}
          </span>
          <div>
            <p className="text-[15px] font-bold text-ink dark:text-foreground">{t(store.name)}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t({ en: 'New arrivals', ar: 'الوصول الجديد' })}
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 hide-scrollbar">
        {newArrivals.map(p => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-2xl bg-blush/40"
          >
            {/^https?:\/\//.test(p.images[0] ?? '') && (
              <Image
                src={p.images[0]}
                alt={t(p.name)}
                fill
                sizes="128px"
                className="object-cover"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
