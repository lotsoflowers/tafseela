'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [animating, setAnimating] = useState(false);
  const wishlisted = isWishlisted(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex size-9 items-center justify-center rounded-full',
        'bg-white/85 dark:bg-card/85 backdrop-blur-md',
        'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
        'transition-transform',
        'hover:scale-110 active:scale-95',
        animating && 'animate-heart-pop',
        className
      )}
    >
      <Heart
        className={cn(
          'size-[18px] transition-colors',
          wishlisted ? 'fill-hero text-hero' : 'fill-none text-ink/70 dark:text-foreground/80'
        )}
        strokeWidth={2}
      />
    </button>
  );
}
