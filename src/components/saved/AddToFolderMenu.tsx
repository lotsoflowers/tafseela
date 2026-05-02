'use client';

import { useState } from 'react';
import { Folder, Plus, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFolders } from '@/contexts/FoldersContext';
import { cn } from '@/lib/utils';

interface AddToFolderMenuProps {
  itemId: string;
  onClose: () => void;
}

export default function AddToFolderMenu({ itemId, onClose }: AddToFolderMenuProps) {
  const { t } = useLanguage();
  const { folders, createFolder, addToFolder, getFoldersForItem } = useFolders();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const inFolders = getFoldersForItem(itemId);
  const inFolderIds = new Set(inFolders.map(f => f.id));

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const folder = createFolder(name);
    addToFolder(folder.id, itemId);
    setNewName('');
    setCreating(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white pb-8 dark:bg-card"
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <span className="text-[15px] font-bold text-ink dark:text-foreground">
            {t({ en: 'Add to folder', ar: 'إضافة لمجلد' })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-cream dark:hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mx-4 mb-3">
          {creating ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value.slice(0, 25))}
                placeholder={t({ en: 'Folder name', ar: 'اسم المجلد' })}
                className="flex-1 rounded-full border border-soft/40 bg-white px-4 py-2 text-[14px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
                autoFocus
                maxLength={25}
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded-full bg-hero px-4 py-2 text-[13px] font-bold text-white disabled:opacity-40"
              >
                {t({ en: 'Create', ar: 'إنشاء' })}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2 rounded-full bg-cream px-4 py-2 text-[13px] font-semibold text-plum dark:bg-secondary dark:text-foreground"
            >
              <Plus className="size-4" />
              {t({ en: 'Create new folder', ar: 'إنشاء مجلد جديد' })}
            </button>
          )}
        </div>

        <div className="max-h-[40vh] overflow-y-auto">
          {folders.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-muted-foreground">
              {t({
                en: 'No folders yet — create one above.',
                ar: 'لا توجد مجلدات بعد — أنشئي واحداً أعلاه.',
              })}
            </p>
          ) : (
            <ul>
              {folders.map(folder => {
                const has = inFolderIds.has(folder.id);
                return (
                  <li key={folder.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!has) {
                          addToFolder(folder.id, itemId);
                          onClose();
                        }
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3 text-start transition-colors',
                        has ? 'text-muted-foreground' : 'hover:bg-cream dark:hover:bg-secondary'
                      )}
                    >
                      <Folder className="size-5 text-plum dark:text-foreground" strokeWidth={1.75} />
                      <span className="flex-1 text-[14px] font-semibold text-ink dark:text-foreground">
                        {folder.name}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {folder.itemIds.length}
                      </span>
                      {has && <Check className="size-5 text-hero" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
