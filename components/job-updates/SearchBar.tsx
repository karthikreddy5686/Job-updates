'use client';

import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useJobUpdates } from '@/store/jobUpdatesStore';

export default function SearchBar() {
  const { search, setSearch } = useJobUpdates();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input when user presses Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search across the OS..."
          className="w-full pl-11 pr-20 py-2.5 rounded-full text-sm font-medium transition-all duration-300
            bg-slate-100 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500
            border border-slate-200 dark:border-white/5
            focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:bg-white dark:focus:bg-slate-900
            shadow-inner"
          aria-label="Search jobs"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {search ? (
            <button
              onClick={() => setSearch('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-1.5 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
