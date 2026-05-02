'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { RestockAlert, ProductSize } from '@/types';

const STORAGE_KEY = 'tafseela-restock-alerts';

interface RestockAlertsContextType {
  alerts: RestockAlert[];
  subscribe: (productId: string, size: ProductSize) => void;
  unsubscribe: (productId: string, size: ProductSize) => void;
  isSubscribed: (productId: string, size: ProductSize) => boolean;
  getAlertsForProduct: (productId: string) => RestockAlert[];
}

const RestockAlertsContext = createContext<RestockAlertsContextType | undefined>(undefined);

const matches = (a: RestockAlert, productId: string, size: ProductSize) =>
  a.productId === productId && a.size === size;

export function RestockAlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<RestockAlert[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAlerts(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    }
  }, [alerts, loaded]);

  const subscribe = useCallback((productId: string, size: ProductSize) => {
    setAlerts(prev => {
      if (prev.some(a => matches(a, productId, size))) return prev;
      return [
        ...prev,
        { productId, size, createdAt: new Date().toISOString() },
      ];
    });
  }, []);

  const unsubscribe = useCallback((productId: string, size: ProductSize) => {
    setAlerts(prev => prev.filter(a => !matches(a, productId, size)));
  }, []);

  const isSubscribed = useCallback(
    (productId: string, size: ProductSize): boolean =>
      alerts.some(a => matches(a, productId, size)),
    [alerts]
  );

  const getAlertsForProduct = useCallback(
    (productId: string): RestockAlert[] => alerts.filter(a => a.productId === productId),
    [alerts]
  );

  return (
    <RestockAlertsContext.Provider
      value={{ alerts, subscribe, unsubscribe, isSubscribed, getAlertsForProduct }}
    >
      {children}
    </RestockAlertsContext.Provider>
  );
}

export function useRestockAlerts() {
  const ctx = useContext(RestockAlertsContext);
  if (!ctx) throw new Error('useRestockAlerts must be used within RestockAlertsProvider');
  return ctx;
}
