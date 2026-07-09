import * as React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9573b]/60 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none';
    
    const variants = {
      primary: 'bg-[#b9573b] hover:bg-[#9f4933] text-white shadow-[0_8px_24px_rgba(185,87,59,0.22)] dark:bg-[#d8795c] dark:hover:bg-[#c66a50]',
      secondary: 'bg-[#fffdf8] hover:bg-[#eee8de] dark:bg-[#263b33] dark:hover:bg-[#30483f] dark:text-[#f8f3e9] text-[#263b33] border border-[#d4c9ba] dark:border-[#40564c]',
      ghost: 'bg-transparent hover:bg-[#eee8de] dark:hover:bg-[#2b3b35] text-[#42534c] dark:text-[#d9ddd7]',
      danger: 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/10 hover:shadow-lg active:bg-red-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
