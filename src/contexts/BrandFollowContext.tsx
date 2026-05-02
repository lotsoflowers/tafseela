'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tafseela-followed-brands';

interface BrandFollowContextType {
  followed: string[];
  follow: (storeId: string) => void;
  unfollow: (storeId: string) => void;
  toggleFollow: (storeId: string) => void;
  isFollowing: (storeId: string) => boolean;
}

const BrandFollowContext = createContext<BrandFollowContextType | undefined>(undefined);

export function BrandFollowProvider({ children }: { children: React.ReactNode }) {
  const [followed, setFollowed] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFollowed(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(followed));
    }
  }, [followed, loaded]);

  const follow = useCallback((storeId: string) => {
    setFollowed(prev => (prev.includes(storeId) ? prev : [...prev, storeId]));
  }, []);

  const unfollow = useCallback((storeId: string) => {
    setFollowed(prev => prev.filter(id => id !== storeId));
  }, []);

  const toggleFollow = useCallback((storeId: string) => {
    setFollowed(prev =>
      prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]
    );
  }, []);

  const isFollowing = useCallback(
    (storeId: string): boolean => followed.includes(storeId),
    [followed]
  );

  return (
    <BrandFollowContext.Provider
      value={{ followed, follow, unfollow, toggleFollow, isFollowing }}
    >
      {children}
    </BrandFollowContext.Provider>
  );
}

export function useBrandFollow() {
  const ctx = useContext(BrandFollowContext);
  if (!ctx) throw new Error('useBrandFollow must be used within BrandFollowProvider');
  return ctx;
}
