'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Order,
  CartItem,
  DeliveryAddress,
  ReturnRequest,
  ReturnLineItem,
} from '@/types';

const STORAGE_KEY = 'tafseela-orders';
const RETURNS_KEY = 'tafseela-returns';

type PlaceOrderInput = {
  items: CartItem[];
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: Order['paymentMethod'];
};

interface OrdersContextType {
  orders: Order[];
  returns: ReturnRequest[];
  placeOrder: (input: PlaceOrderInput) => Order;
  getOrder: (id: string) => Order | undefined;
  getActiveOrders: () => Order[];
  getPastOrders: () => Order[];
  placeReturn: (orderId: string, items: ReturnLineItem[]) => ReturnRequest;
  getReturnsForOrder: (orderId: string) => ReturnRequest[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ACTIVE_STATUSES: Order['status'][] = [
  'confirmed',
  'processing',
  'shipped',
  'out-for-delivery',
];

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedOrders = localStorage.getItem(STORAGE_KEY);
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const savedReturns = localStorage.getItem(RETURNS_KEY);
    if (savedReturns) {
      try {
        setReturns(JSON.parse(savedReturns));
      } catch {
        localStorage.removeItem(RETURNS_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      localStorage.setItem(RETURNS_KEY, JSON.stringify(returns));
    }
  }, [orders, returns, loaded]);

  const placeOrder = useCallback((input: PlaceOrderInput): Order => {
    const now = new Date();
    const eta = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const order: Order = {
      id: `order-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
      items: input.items,
      status: 'confirmed',
      total: input.total,
      deliveryAddress: input.deliveryAddress,
      paymentMethod: input.paymentMethod,
      createdAt: now.toISOString(),
      estimatedDelivery: eta.toISOString(),
      trackingUpdates: [
        {
          status: 'confirmed',
          timestamp: now.toISOString(),
          note: { en: 'Order placed', ar: 'تم تأكيد الطلب' },
        },
      ],
    };
    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const getOrder = useCallback(
    (id: string): Order | undefined => orders.find(o => o.id === id),
    [orders]
  );

  const getActiveOrders = useCallback(
    (): Order[] => orders.filter(o => ACTIVE_STATUSES.includes(o.status)),
    [orders]
  );

  const getPastOrders = useCallback(
    (): Order[] => orders.filter(o => o.status === 'delivered'),
    [orders]
  );

  const placeReturn = useCallback(
    (orderId: string, items: ReturnLineItem[]): ReturnRequest => {
      const ret: ReturnRequest = {
        id: `return-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        orderId,
        items,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setReturns(prev => [ret, ...prev]);
      return ret;
    },
    []
  );

  const getReturnsForOrder = useCallback(
    (orderId: string): ReturnRequest[] => returns.filter(r => r.orderId === orderId),
    [returns]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        returns,
        placeOrder,
        getOrder,
        getActiveOrders,
        getPastOrders,
        placeReturn,
        getReturnsForOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
