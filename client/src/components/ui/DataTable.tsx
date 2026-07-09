import type { ReactNode } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { cn } from '../../lib/cn';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  mobileRender?: (row: T) => ReactNode;
  sort?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  pagination?: {
    page: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  mobileRender,
  sort,
  onSort,
  pagination,
  className,
}: DataTableProps<T>) {
  
  const handleSort = (columnKey: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(columnKey);
    }
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.perPage) : 0;
  
  return (
    <div className={cn('flex flex-col gap-4 w-full min-w-0', className)}>
      {/* Desktop view: Table */}
      <div className="overflow-x-auto border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 max-md:hidden">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b dark:border-zinc-900 border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={cn(
                    'px-6 py-4 text-xs font-bold uppercase tracking-wider dark:text-zinc-400 text-zinc-500',
                    col.sortable && 'cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200'
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <ArrowUpDown className="w-3.5 h-3.5" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-900 divide-zinc-200">
            {rows.map((row) => (
              <tr 
                key={row.id} 
                className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm dark:text-zinc-300 text-zinc-600">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Stacked List */}
      <div className="hidden max-md:flex flex-col gap-3">
        {rows.map((row) => (
          <div 
            key={row.id} 
            className="p-4 rounded-xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/10"
          >
            {mobileRender ? (
              mobileRender(row)
            ) : (
              <div className="flex flex-col gap-2">
                {columns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start gap-4">
                    <span className="text-xs font-semibold dark:text-zinc-500 text-zinc-400">
                      {col.label}
                    </span>
                    <span className="text-sm text-right dark:text-zinc-300 text-zinc-600">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1 shrink-0 select-none">
          <p className="text-xs dark:text-zinc-400 text-zinc-500">
            Showing <span className="font-semibold">{(pagination.page - 1) * pagination.perPage + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(pagination.page * pagination.perPage, pagination.total)}
            </span>{' '}
            of <span className="font-semibold">{pagination.total}</span> entries
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="p-2 min-w-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="p-2 min-w-0"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
