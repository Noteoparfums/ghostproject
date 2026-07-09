import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    const baseStyles = cn(
      'w-full px-4 py-2.5 rounded-xl border font-normal text-sm transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer bg-no-repeat bg-right pr-10',
      'bg-white border-zinc-200 text-zinc-800 focus:ring-blue-500/60 focus:border-blue-500',
      'dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:ring-blue-500/40 dark:focus:border-blue-500',
      error 
        ? 'border-red-500 focus:ring-red-500/50 dark:border-red-500 dark:focus:ring-red-500/30' 
        : 'border-zinc-200 dark:border-zinc-800'
    );

    // Custom SVG arrow for styled select
    const arrowStyle = {
      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundPosition: 'calc(100% - 12px) center',
      backgroundSize: '20px',
    };

    return (
      <select
        ref={ref}
        className={cn(baseStyles, className)}
        style={arrowStyle}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
export default Select;
