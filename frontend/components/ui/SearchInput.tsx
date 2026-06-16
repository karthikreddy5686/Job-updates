import type * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SearchInput({ label = 'Search', className, ...props }: SearchInputProps) {
  return (
    <label className={cn('group relative block w-full', className)}>
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-focus-within:text-primary-500" />
      <input
        type="search"
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
        placeholder="Search jobs, companies, locations"
        {...props}
      />
    </label>
  );
}
