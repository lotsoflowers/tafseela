'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { DeliveryAddress } from '@/types';

const STORAGE_KEY = 'tafseela-addresses';
const SELECTED_KEY = 'tafseela-selected-address';

export type SavedAddress = DeliveryAddress & {
  id: string;
  countryCode: string;
};

interface AddressesContextType {
  addresses: SavedAddress[];
  selectedId: string | null;
  selected: SavedAddress | null;
  addAddress: (address: Omit<SavedAddress, 'id'>) => SavedAddress;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

const AddressesContext = createContext<AddressesContextType | undefined>(undefined);

export function AddressesProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const sel = localStorage.getItem(SELECTED_KEY);
    if (sel) setSelectedId(sel);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, loaded]);

  useEffect(() => {
    if (loaded) {
      if (selectedId) localStorage.setItem(SELECTED_KEY, selectedId);
      else localStorage.removeItem(SELECTED_KEY);
    }
  }, [selectedId, loaded]);

  const addAddress = useCallback((address: Omit<SavedAddress, 'id'>): SavedAddress => {
    const id = `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newAddr: SavedAddress = { ...address, id };
    setAddresses(prev => [...prev, newAddr]);
    setSelectedId(prev => prev ?? id);
    return newAddr;
  }, []);

  const updateAddress = useCallback((id: string, patch: Partial<SavedAddress>) => {
    setAddresses(prev => prev.map(a => (a.id === id ? { ...a, ...patch, id } : a)));
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, []);

  const selectAddress = useCallback((id: string) => setSelectedId(id), []);

  const selected = addresses.find(a => a.id === selectedId) ?? null;

  return (
    <AddressesContext.Provider
      value={{
        addresses,
        selectedId,
        selected,
        addAddress,
        updateAddress,
        deleteAddress,
        selectAddress,
      }}
    >
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressesContext);
  if (!ctx) throw new Error('useAddresses must be used within AddressesProvider');
  return ctx;
}
