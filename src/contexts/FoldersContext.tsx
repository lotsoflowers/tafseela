'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Folder } from '@/types';

const STORAGE_KEY = 'tafseela-folders';

interface FoldersContextType {
  folders: Folder[];
  createFolder: (name: string) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  addToFolder: (folderId: string, itemId: string) => void;
  removeFromFolder: (folderId: string, itemId: string) => void;
  getFolder: (id: string) => Folder | undefined;
  getFoldersForItem: (itemId: string) => Folder[];
}

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export function FoldersProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFolders(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders, loaded]);

  const createFolder = useCallback((name: string): Folder => {
    const folder: Folder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      itemIds: [],
      createdAt: new Date().toISOString(),
    };
    setFolders(prev => [folder, ...prev]);
    return folder;
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setFolders(prev => prev.map(f => (f.id === id ? { ...f, name } : f)));
  }, []);

  const deleteFolder = useCallback((id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  }, []);

  const addToFolder = useCallback((folderId: string, itemId: string) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId && !f.itemIds.includes(itemId)
          ? { ...f, itemIds: [...f.itemIds, itemId] }
          : f
      )
    );
  }, []);

  const removeFromFolder = useCallback((folderId: string, itemId: string) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId ? { ...f, itemIds: f.itemIds.filter(id => id !== itemId) } : f
      )
    );
  }, []);

  const getFolder = useCallback(
    (id: string): Folder | undefined => folders.find(f => f.id === id),
    [folders]
  );

  const getFoldersForItem = useCallback(
    (itemId: string): Folder[] => folders.filter(f => f.itemIds.includes(itemId)),
    [folders]
  );

  return (
    <FoldersContext.Provider
      value={{
        folders,
        createFolder,
        renameFolder,
        deleteFolder,
        addToFolder,
        removeFromFolder,
        getFolder,
        getFoldersForItem,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const ctx = useContext(FoldersContext);
  if (!ctx) throw new Error('useFolders must be used within FoldersProvider');
  return ctx;
}
