'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MoreHorizontal, Trash2, FolderPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { stores } from '@/data/stores';
import { formatPrice } from '@/lib/format';
import { cn, isLoadableImage } from '@/lib/utils';
import { notifyAddedToBag, notifyRemovedFromSaved } from '@/lib/notify';
import type { Product } from '@/types';
import AddToFolderMenu from './AddToFolderMenu';

interface SavedItemRowProps {
  product: Product;
}

export default function SavedItemRow({ product }: SavedItemRowProps) {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { toggleWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [folderMenuOpen, setFolderMenuOpen] = useState(false);

  const store = stores.find(s => s.id === product.storeId);
  const hasPhoto = isLoadableImage(product.images[0]);
  const oos = product.isOutOfStock || product.availableSizes.length === 0;
  const firstAvailableSize = product.availableSizes[0];

  const handleAddToBag = () => {
    if (!firstAvailableSize) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    addItem(product.id, product.storeId, firstAvailableSize);
    notifyAddedToBag(language, product.name);
  };

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href={`/product/${product.id}`}
          className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-blush/40"
        >
          {hasPhoto && (
            <Image
              src={product.images[0]}
              alt={t(product.name)}
              fill
              sizes="80px"
              className={cn('object-cover', oos && 'grayscale')}
            />
          )}
          {oos && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/40 text-[10px] font-bold uppercase text-ink">
              {t({ en: 'Out of stock', ar: 'نفد' })}
            </span>
          )}
        </Link>

        <Link
          href={`/product/${product.id}`}
          className="min-w-0 flex-1"
        >
          <p className="truncate text-[14px] font-bold leading-tight text-ink dark:text-foreground">
            {t(product.name)}
          </p>
          <p className="mt-0.5 text-[14px] font-bold text-ink dark:text-foreground">
            {formatPrice(product.price)}
          </p>
          {store && (
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
              {t(store.name)}
            </p>
          )}
        </Link>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {oos ? (
            <button
              type="button"
              className="min-h-[36px] rounded-full px-3 text-[12px] font-semibold text-hero active:scale-95"
            >
              {t({ en: 'Notify me', ar: 'أشعريني' })}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToBag}
              className="min-h-[40px] rounded-full bg-hero px-4 py-2 text-[13px] font-bold text-white transition-[background-color,transform] hover:bg-hero/90 active:scale-95 shadow-cta"
            >
              {t({ en: 'Add to Bag', ar: 'للحقيبة' })}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={t({ en: 'More', ar: 'المزيد' })}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-[background-color,transform] hover:bg-cream active:scale-90 dark:hover:bg-secondary"
          >
            <MoreHorizontal className="size-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4 pb-8 dark:bg-card"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20" />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setFolderMenuOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-start dark:bg-secondary"
            >
              <FolderPlus className="size-5 text-plum dark:text-foreground" />
              <span className="text-[14px] font-semibold text-ink dark:text-foreground">
                {t({ en: 'Add to folder', ar: 'إضافة لمجلد' })}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
                notifyRemovedFromSaved(language, product.name);
                setMenuOpen(false);
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-start text-red-600 dark:bg-red-950/40 dark:text-red-400"
            >
              <Trash2 className="size-5" />
              <span className="text-[14px] font-semibold">
                {t({ en: 'Remove from saved', ar: 'إزالة من المحفوظات' })}
              </span>
            </button>
          </div>
        </div>
      )}

      {folderMenuOpen && (
        <AddToFolderMenu
          itemId={product.id}
          onClose={() => setFolderMenuOpen(false)}
        />
      )}
    </>
  );
}
