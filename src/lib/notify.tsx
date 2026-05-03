'use client';

import { toast } from 'sonner';
import { ShoppingBag, Heart, FolderPlus, Sparkle, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { Toast } from '@/components/glass';

type Bilingual = { en: string; ar: string };

function notifyJSX(node: ReactNode, durationMs = 3000) {
  toast.custom(() => <div style={{ minWidth: 280, maxWidth: 360 }}>{node}</div>, { duration: durationMs });
}

const t = (lang: 'en' | 'ar', text: Bilingual) => text[lang];

// ── Cart ─────────────────────────────────────────────────────────

export function notifyAddedToBag(lang: 'en' | 'ar', productName: Bilingual) {
  notifyJSX(
    <Toast
      icon={<ShoppingBag size={18} />}
      title={t(lang, { en: 'Added to bag', ar: 'أُضيفت للحقيبة' })}
      message={t(lang, productName)}
      action={t(lang, { en: 'View', ar: 'عرض' })}
      onAction={() => {
        if (typeof window !== 'undefined') window.location.assign('/cart');
      }}
    />
  );
}

// ── Wishlist / Saved ─────────────────────────────────────────────

export function notifySaved(lang: 'en' | 'ar', name: Bilingual) {
  notifyJSX(
    <Toast
      icon={<Heart size={18} />}
      title={t(lang, { en: 'Saved', ar: 'تم الحفظ' })}
      message={t(lang, name)}
    />
  );
}

export function notifyRemovedFromSaved(lang: 'en' | 'ar', name: Bilingual) {
  notifyJSX(
    <Toast
      icon={<Heart size={18} />}
      title={t(lang, { en: 'Removed from saved', ar: 'تمت الإزالة' })}
      message={t(lang, name)}
    />
  );
}

// ── Folders ──────────────────────────────────────────────────────

export function notifyFolderCreated(lang: 'en' | 'ar', folderName: string) {
  notifyJSX(
    <Toast
      icon={<FolderPlus size={18} />}
      title={t(lang, { en: 'Folder created', ar: 'تم إنشاء المجلد' })}
      message={folderName}
    />
  );
}

export function notifyAddedToFolder(lang: 'en' | 'ar', folderName: string) {
  notifyJSX(
    <Toast
      icon={<FolderPlus size={18} />}
      title={t(lang, { en: 'Added to folder', ar: 'تمت الإضافة إلى المجلد' })}
      message={folderName}
    />
  );
}

// ── Reviews ──────────────────────────────────────────────────────

export function notifyReviewSubmitted(lang: 'en' | 'ar') {
  notifyJSX(
    <Toast
      icon={<Sparkle size={18} />}
      title={t(lang, { en: 'Review submitted', ar: 'تم إرسال التقييم' })}
      message={t(lang, { en: 'Thanks for sharing.', ar: 'شكراً للمشاركة.' })}
    />
  );
}

// ── Generic ──────────────────────────────────────────────────────

export function notify(lang: 'en' | 'ar', title: Bilingual, message?: Bilingual, action?: { label: Bilingual; onClick?: () => void }) {
  notifyJSX(
    <Toast
      icon={<Check size={18} />}
      title={t(lang, title)}
      message={message ? t(lang, message) : undefined}
      action={action ? t(lang, action.label) : undefined}
      onAction={action?.onClick}
    />
  );
}
