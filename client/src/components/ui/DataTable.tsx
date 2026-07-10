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
  caption?: string;
  emptyMessage?: string;
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
  caption = 'Data',
  emptyMessage = 'No entries are available.',
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

  const totalPages = pagination && pagination.perPage > 0
    ? Math.ceil(pagination.total / pagination.perPage)
    : 0;
  const currentPage = pagination
    ? Math.min(Math.max(pagination.page, 1), Math.max(totalPages, 1))
    : 1;
  const renderCell = (row: T, column: Column<T>) => (
    column.render
      ? column.render(row)
      : (row as unknown as Record<string, ReactNode>)[column.key]
  );

  return (
    <div className={cn('flex flex-col gap-4 w-full min-w-0', className)}>
      <div className="max-md:hidden overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left border-collapse table-auto">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((column) => {
                const isActiveSort = sort?.key === column.key;
                const nextDirection = isActiveSort && sort.direction === 'asc' ? 'descending' : 'ascending';

                return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={isActiveSort ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key, true)}
                      aria-label={`Sort by ${column.label} ${nextDirection}`}
                      className="flex min-h-11 w-full items-center gap-1.5 rounded-md text-left transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span>{column.label}</span>
                      <ArrowUpDown
                        aria-hidden="true"
                        className={cn('h-3.5 w-3.5', isActiveSort && 'text-primary')}
                      />
                    </button>
                  ) : (
                    <span className="flex min-h-11 items-center">{column.label}</span>
                  )}
                </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : rows.map((row) => (
              <tr 
                key={row.id} 
                className="transition-colors hover:bg-muted/40"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-muted-foreground">
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="hidden flex-col gap-3 max-md:flex" aria-label={`${caption} list`}>
        {rows.length === 0 ? (
          <li className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {emptyMessage}
          </li>
        ) : rows.map((row) => (
          <li
            key={row.id} 
            className="rounded-xl border border-border bg-card p-4"
          >
            {mobileRender ? (
              mobileRender(row)
            ) : (
              <dl className="flex flex-col gap-2">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <dt className="text-xs font-semibold text-muted-foreground">
                      {column.label}
                    </dt>
                    <dd className="text-right text-sm text-foreground">
                      {renderCell(row, column)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>

      {pagination && totalPages > 1 && (
        <nav
          aria-label={`${caption} pagination`}
          className="flex shrink-0 select-none items-center justify-between gap-4 px-2 py-1"
        >
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing <span className="font-semibold">{(currentPage - 1) * pagination.perPage + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(currentPage * pagination.perPage, pagination.total)}
            </span>{' '}
            of <span className="font-semibold">{pagination.total}</span> entries
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => pagination.onPageChange(currentPage - 1)}
              className="min-h-11 min-w-11 p-2"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => pagination.onPageChange(currentPage + 1)}
              className="min-h-11 min-w-11 p-2"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
export default DataTable;
