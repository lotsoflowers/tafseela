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
        'flex size-8 items-center justify-center rounded-full bg-white shadow-md transition-transform',
        'hover:scale-110 active:scale-95',
        animating && 'animate-heart-pop',
        className
      )}
    >
      <Heart
        className={cn(
          'size-4 transition-colors',
          wishlisted ? 'fill-red-500 text-red-500' : 'fill-none text-ink'
        )}
      />
    </button>
  );
}
