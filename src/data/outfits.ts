import type { Outfit } from '@/types';
import { products } from './products';

const productImage = (id: string, fallback = ''): string => {
  const p = products.find(p => p.id === id);
  return p?.images[0] ?? fallback;
};

export const outfits: Outfit[] = [
  {
    id: 'outfit-tailored-vest-day',
    name: { en: 'Tailored Vest, Layered', ar: 'صديري مفصّل بطبقات' },
    lifestylePhoto: productImage('modish-sp26312'),
    items: ['modish-sp26312', 'lamsheen-basic-white-shirt', 'modish-sp26408'],
    vibe: 'layered',
    brand: 'modish',
    isFeatured: true,
  },
  {
    id: 'outfit-navy-jacket-office',
    name: { en: 'Navy Jacket Office', ar: 'جاكيت كحلي للعمل' },
    lifestylePhoto: productImage('modish-sp26396'),
    items: ['modish-sp26396', 'lamsheen-basic-white-shirt', 'modish-sp26354'],
    vibe: 'layered',
    brand: 'modish',
    isFeatured: true,
  },
  {
    id: 'outfit-belted-midi-day',
    name: { en: 'Belted Midi Day', ar: 'فستان ميدي بحزام للنهار' },
    lifestylePhoto: productImage('modish-sp26406'),
    items: ['modish-sp26406'],
    vibe: 'daily',
    brand: 'modish',
    isFeatured: true,
  },
  {
    id: 'outfit-off-white-midi',
    name: { en: 'Off-White Midi', ar: 'ميدي أوف وايت' },
    lifestylePhoto: productImage('modish-sp26356'),
    items: ['modish-sp26356'],
    vibe: 'daily',
    brand: 'modish',
  },
  {
    id: 'outfit-statement-grey',
    name: { en: 'Statement Grey Evening', ar: 'فستان رمادي مميز للسهرة' },
    lifestylePhoto: productImage('modish-r262'),
    items: ['modish-r262'],
    vibe: 'evening',
    brand: 'modish',
    isFeatured: true,
  },
  {
    id: 'outfit-sky-blue-edit',
    name: { en: 'Sky Blue Edit', ar: 'إطلالة سماوي' },
    lifestylePhoto: productImage('modish-sp26415'),
    items: ['modish-sp26415', 'modish-sp26407'],
    vibe: 'daily',
    brand: 'modish',
  },
  {
    id: 'outfit-olive-green-set',
    name: { en: 'Olive Green Set', ar: 'إطلالة زيتي' },
    lifestylePhoto: productImage('modish-sp26383'),
    items: ['modish-sp26383', 'modish-sp26354'],
    vibe: 'daily',
    brand: 'modish',
  },
  {
    id: 'outfit-black-ink-power',
    name: { en: 'Black Ink Power', ar: 'إطلالة بليزر حبر' },
    lifestylePhoto: productImage('lamsheen-black-ink-blazer'),
    items: ['lamsheen-black-ink-blazer', 'lamsheen-basic-white-shirt', 'modish-sp26408'],
    vibe: 'layered',
    brand: 'lam-sheen',
    isFeatured: true,
  },
  {
    id: 'outfit-padded-wrap-pink',
    name: { en: 'Padded Wrap Pink', ar: 'لفّة مبطّنة وردي' },
    lifestylePhoto: productImage('lamsheen-padded-wrap-pink'),
    items: ['lamsheen-padded-wrap-pink', 'modish-sp26354'],
    vibe: 'daily',
    brand: 'lam-sheen',
  },
  {
    id: 'outfit-padded-wrap-white',
    name: { en: 'Padded Wrap White', ar: 'لفّة مبطّنة أبيض' },
    lifestylePhoto: productImage('lamsheen-padded-wrap-white'),
    items: ['lamsheen-padded-wrap-white', 'modish-sp26408'],
    vibe: 'daily',
    brand: 'lam-sheen',
  },
  {
    id: 'outfit-cream-dual',
    name: { en: 'Cream Dual Shirt', ar: 'قميص كريمي مزدوج' },
    lifestylePhoto: productImage('lamsheen-cream-dual-shirt'),
    items: ['lamsheen-cream-dual-shirt', 'modish-sp26407'],
    vibe: 'daily',
    brand: 'lam-sheen',
  },
  {
    id: 'outfit-striped-corset',
    name: { en: 'Striped Corset Look', ar: 'إطلالة كورسيه مخطط' },
    lifestylePhoto: productImage('lamsheen-striped-corset-shirt'),
    items: ['lamsheen-striped-corset-shirt', 'modish-sp26354'],
    vibe: 'layered',
    brand: 'lam-sheen',
  },
  {
    id: 'outfit-black-satin-evening',
    name: { en: 'Black Satin Evening', ar: 'فستان ساتان أسود للسهرة' },
    lifestylePhoto: productImage('lamsheen-black-satin-dress'),
    items: ['lamsheen-black-satin-dress'],
    vibe: 'evening',
    brand: 'lam-sheen',
    isFeatured: true,
  },
  {
    id: 'outfit-shiny-brown-evening',
    name: { en: 'Shiny Brown Evening', ar: 'فستان بني لامع للسهرة' },
    lifestylePhoto: productImage('modish-sp26148'),
    items: ['modish-sp26148'],
    vibe: 'evening',
    brand: 'modish',
  },
  {
    id: 'outfit-boz-abaya',
    name: { en: 'Occasion Abaya', ar: 'عباية للمناسبات' },
    lifestylePhoto: productImage('prod-6'),
    items: ['prod-6'],
    vibe: 'modest',
    brand: 'boz-kw',
    isFeatured: true,
  },
  {
    id: 'outfit-tyoor-coords',
    name: { en: 'Modest Coords', ar: 'طقم محتشم' },
    lifestylePhoto: productImage('prod-12'),
    items: ['prod-12'],
    vibe: 'modest',
    brand: 'tyoor-al-jannah',
  },
];

export const getOutfit = (id: string): Outfit | undefined =>
  outfits.find(o => o.id === id);

export const getOutfitsContainingProduct = (productId: string): Outfit[] =>
  outfits.filter(o => o.items.includes(productId));

export const getOutfitsByVibe = (vibe: Outfit['vibe']): Outfit[] =>
  outfits.filter(o => o.vibe === vibe);

export const getOutfitsByBrand = (brand: string): Outfit[] =>
  outfits.filter(o => o.brand === brand);

export const getRelatedOutfits = (outfitId: string, limit = 4): Outfit[] => {
  const outfit = getOutfit(outfitId);
  if (!outfit) return [];
  return outfits
    .filter(o => o.id !== outfitId && o.vibe === outfit.vibe)
    .slice(0, limit);
};

export const getOutfitTotalPrice = (outfit: Outfit): number => {
  return outfit.items.reduce((sum, productId) => {
    const product = products.find(p => p.id === productId);
    return sum + (product?.price ?? 0);
  }, 0);
};
