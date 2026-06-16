'use client';

import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: Array<keyof T>;
  initialPageSize?: number;
  emptyState?: React.ReactNode;
}

export function Table<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchKeys,
  initialPageSize = 5,
  emptyState,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const keysToSearch = searchKeys || (Object.keys(row) as Array<keyof T>);
      return keysToSearch.some((key) => {
        const val = row[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, searchQuery, searchKeys]);

  // 2. Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData];
    sorted.sort((a: any, b: any) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      // Handle strings, numbers, dates
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // 3. Paginate data
  const totalItems = sortedData.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  // Adjust page if current page exceeds total pages after filtering
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable || !column.accessorKey) return null;
    const key = String(column.accessorKey);
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4 text-primary-500" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4 text-primary-500" />
    );
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="w-full space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-primary-500"
          />
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <label htmlFor="table-page-size" className="font-medium">
            Rows per page:
          </label>
          <select
            id="table-page-size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 outline-none transition focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-primary-500"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800/80 dark:bg-slate-900/40">
        <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => column.sortable && column.accessorKey && handleSort(String(column.accessorKey))}
                  className={cn(
                    'px-6 py-4 font-semibold text-slate-800 dark:text-slate-200',
                    column.sortable && column.accessorKey ? 'cursor-pointer select-none group' : ''
                  )}
                >
                  <div className="flex items-center">
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-800/10"
                >
                  {columns.map((column, colIndex) => {
                    const cellContent = column.cell
                      ? column.cell(row)
                      : column.accessorKey
                      ? (row as any)[column.accessorKey]
                      : null;

                    return (
                      <td key={colIndex} className="px-6 py-4">
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-base font-medium text-slate-900 dark:text-slate-100">No results found</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Try adjusting your search terms or filters.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium text-slate-800 dark:text-slate-200">{startIndex}</span> to{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">{endIndex}</span> of{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">{totalItems}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page <span className="font-semibold text-slate-800 dark:text-slate-100">{currentPage}</span> of{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-100">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
