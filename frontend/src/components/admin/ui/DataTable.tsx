'use client';
/**
 * DataTable — reusable, sortable, searchable table for admin listings.
 * Columns are defined declaratively; rows can have custom render functions.
 */
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import SearchInput from './SearchInput';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  hidden?: 'sm' | 'md' | 'lg'; // hide on smaller breakpoints
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  toolbar?: React.ReactNode; // extra filters/buttons next to search
  className?: string;
}

type SortDir = 'asc' | 'desc';

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  searchFields = [],
  pageSize = 15,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyAction,
  toolbar,
  className,
}: DataTableProps<T>) {
  const [query,   setQuery]   = useState('');
  const [page,    setPage]    = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(row =>
      searchFields.some(f => String(row[f] ?? '').toLowerCase().includes(q))
    );
  }, [data, query, searchFields]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  function handleSearch(v: string) { setQuery(v); setPage(1); }

  const hiddenMap: Record<string, string> = { sm: 'hidden sm:table-cell', md: 'hidden md:table-cell', lg: 'hidden lg:table-cell' };

  // Skeleton rows
  const skeletonRows = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className={cn('flex flex-col gap-3', className)}>

      {/* Toolbar */}
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {searchable && (
            <SearchInput
              value={query}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full sm:max-w-xs"
            />
          )}
          {toolbar && <div className="flex items-center gap-2 flex-wrap">{toolbar}</div>}
          {query && (
            <p className="text-xs text-slate-500 shrink-0">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      'text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap',
                      col.sortable && 'cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100 transition-colors',
                      col.hidden && hiddenMap[col.hidden],
                      col.headerClassName,
                    )}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                  >
                    <span className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="flex flex-col -space-y-1">
                          <svg className={cn('w-2.5 h-2.5', sortKey === col.key && sortDir === 'asc' ? 'text-green-600' : 'text-slate-300')} fill="currentColor" viewBox="0 0 16 16"><path d="M8 4l4 6H4z"/></svg>
                          <svg className={cn('w-2.5 h-2.5', sortKey === col.key && sortDir === 'desc' ? 'text-green-600' : 'text-slate-300')} fill="currentColor" viewBox="0 0 16 16"><path d="M8 12L4 6h8z"/></svg>
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                skeletonRows.map(i => (
                  <tr key={i}>
                    {columns.map(col => (
                      <td key={col.key} className={cn('px-4 py-3', col.hidden && hiddenMap[col.hidden])}>
                        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + (i * 13) % 35}%` }}/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      title={query ? `No results for "${query}"` : emptyTitle}
                      description={query ? 'Try a different search term.' : emptyDescription}
                      action={!query ? emptyAction : undefined}
                    />
                  </td>
                </tr>
              ) : (
                paged.map((row, i) => (
                  <tr
                    key={String(row[keyField])}
                    className={cn('hover:bg-slate-50 transition-colors', i % 2 === 1 ? 'bg-slate-50/40' : 'bg-white')}
                  >
                    {columns.map(col => (
                      <td key={col.key} className={cn('px-4 py-3', col.hidden && hiddenMap[col.hidden], col.className)}>
                        {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination inside table card */}
        {!loading && sorted.length > pageSize && (
          <div className="px-4 pb-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={sorted.length}
              limit={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
