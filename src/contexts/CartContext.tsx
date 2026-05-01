'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CartItem, ProductSize } from '@/types';
import { useAuth } from './AuthContext';

const DELIVERY_FEE_PER_STORE = 1.5; // 1.500 KD
const STORAGE_KEY = 'tafseela-cart';

interface StoreGroup {
  storeId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (productId: string, storeId: string, size: ProductSize, quantity?: number) => void;
  removeItem: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  getStoreGroups: () => StoreGroup[];
  getSubtotal: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Dynamic import helper for products data — returns empty array if not yet available
let productsCache: Array<{ id: string; price: number; storeId: string }> | null = null;
async function loadProducts() {
  if (productsCache) return productsCache;
  try {
    const mod = await import('@/data/products');
    productsCache = (mod.products || []).map((p: { id: string; price: number; storeId: string }) => ({
      id: p.id,
      price: p.price,
      storeId: p.storeId,
    }));
    return productsCache;
  } catch {
    return [];
  }
}

function getProductPrice(productId: string): number {
  if (!productsCache) return 0;
  const product = productsCache.find(p => p.id === productId);
  return product?.price ?? 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  // Load products data and cart from localStorage on mount
  useEffect(() => {
    loadProducts().then(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setLoaded(true);
    });
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback(
    (productId: string, storeId: string, size: ProductSize, quantity: number = 1) => {
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }
      setItems(prev => {
        const existing = prev.find(
          item => item.productId === productId && item.size === size
        );
        if (existing) {
          return prev.map(item =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { productId, storeId, size, quantity }];
      });
    },
    [isAuthenticated, openAuthModal]
  );

  const removeItem = useCallback((productId: string, size: ProductSize) => {
    setItems(prev => prev.filter(
      item => !(item.productId === productId && item.size === size)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, size: ProductSize, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(
        item => !(item.productId === productId && item.size === size)
      ));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getSubtotal = useCallback((): number => {
    return items.reduce((sum, item) => {
      return sum + getProductPrice(item.productId) * item.quantity;
    }, 0);
  }, [items]);

  const getStoreGroups = useCallback((): StoreGroup[] => {
    const groups: Record<string, CartItem[]> = {};
    for (const item of items) {
      if (!groups[item.storeId]) {
        groups[item.storeId] = [];
      }
      groups[item.storeId].push(item);
    }
    return Object.entries(groups).map(([storeId, storeItems]) => ({
      storeId,
      items: storeItems,
      subtotal: storeItems.reduce(
        (sum, item) => sum + getProductPrice(item.productId) * item.quantity,
        0
      ),
      deliveryFee: DELIVERY_FEE_PER_STORE,
    }));
  }, [items]);

  const getTotal = useCallback((): number => {
    const groups = getStoreGroups();
    const subtotal = getSubtotal();
    const totalDelivery = groups.length * DELIVERY_FEE_PER_STORE;
    return subtotal + totalDelivery;
  }, [getStoreGroups, getSubtotal]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const total = useMemo(() => getTotal(), [getTotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getStoreGroups,
        getSubtotal,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
