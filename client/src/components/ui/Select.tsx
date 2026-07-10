import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error = false,
      success = false,
      children,
      style,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const isInvalid = error || ariaInvalid === true || ariaInvalid === 'true';
    const baseStyles = cn(
      'min-h-11 w-full cursor-pointer appearance-none rounded-xl border bg-right bg-no-repeat px-4 py-2.5 pr-10 text-sm font-normal transition-[color,background-color,border-color,box-shadow]',
      'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 focus-visible:border-[#b9573b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9573b]/40',
      'disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 disabled:opacity-70',
      'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:focus-visible:border-[#d8795c] dark:focus-visible:ring-[#d8795c]/40 dark:disabled:bg-zinc-800',
      isInvalid &&
        'border-red-600 focus-visible:border-red-600 focus-visible:ring-red-500/40 dark:border-red-500 dark:focus-visible:border-red-500 dark:focus-visible:ring-red-500/30',
      success &&
        !isInvalid &&
        'border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/30 dark:border-emerald-500'
    );

    const arrowStyle = {
      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundPosition: 'calc(100% - 12px) center',
      backgroundSize: '20px',
      ...style,
    };

    return (
      <select
        ref={ref}
        aria-invalid={isInvalid || undefined}
        data-status={isInvalid ? 'error' : success ? 'success' : undefined}
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
