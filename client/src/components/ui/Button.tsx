import * as React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingLabel = 'Loading…',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9573b]/60 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 aria-[pressed=true]:ring-2 aria-[pressed=true]:ring-[#b9573b]/40';
    
    const variants = {
      primary:
        'bg-[#b9573b] text-white shadow-[0_8px_24px_rgba(185,87,59,0.22)] hover:bg-[#9f4933] active:bg-[#873e2d] dark:bg-[#d8795c] dark:hover:bg-[#c66a50] dark:active:bg-[#b45e47]',
      secondary:
        'border border-[#d4c9ba] bg-[#fffdf8] text-[#263b33] hover:border-[#b8aa99] hover:bg-[#eee8de] active:bg-[#e2d9cc] aria-[pressed=true]:border-[#b9573b] aria-[pressed=true]:bg-[#f5e4dc] dark:border-[#40564c] dark:bg-[#263b33] dark:text-[#f8f3e9] dark:hover:border-[#577066] dark:hover:bg-[#30483f] dark:active:bg-[#385147] dark:aria-[pressed=true]:border-[#d8795c] dark:aria-[pressed=true]:bg-[#3b473e]',
      ghost:
        'bg-transparent text-[#42534c] hover:bg-[#eee8de] active:bg-[#e2d9cc] aria-[pressed=true]:bg-[#f5e4dc] aria-[pressed=true]:text-[#873e2d] dark:text-[#d9ddd7] dark:hover:bg-[#2b3b35] dark:active:bg-[#354840] dark:aria-[pressed=true]:bg-[#3b473e] dark:aria-[pressed=true]:text-[#f0a087]',
      success:
        'bg-emerald-700 text-white shadow-[0_8px_24px_rgba(4,120,87,0.18)] hover:bg-emerald-800 active:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:active:bg-emerald-700',
      danger:
        'bg-red-700 text-white shadow-[0_8px_24px_rgba(185,28,28,0.16)] hover:bg-red-800 active:bg-red-900 dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700',
    };

    const sizes = {
      sm: 'px-3 text-xs',
      md: 'px-5 text-sm',
      lg: 'min-h-12 px-7 text-base',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <>
            <svg 
              className="h-4 w-4 animate-spin text-current motion-reduce:animate-none" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{loadingLabel}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
