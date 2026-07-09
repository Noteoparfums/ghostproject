import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  onChange?: (e: any) => void;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, multiline, error, ...props }, ref) => {
    const baseStyles = cn(
      'w-full px-4 py-2.5 rounded-xl border font-normal text-sm transition-all focus:outline-none focus:ring-2 select-text',
      'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:ring-blue-500/60 focus:border-blue-500',
      'dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-blue-500/40 dark:focus:border-blue-500',
      error 
        ? 'border-red-500 focus:ring-red-500/50 dark:border-red-500 dark:focus:ring-red-500/30' 
        : 'border-zinc-200 dark:border-zinc-800'
    );

    if (multiline) {
      return (
        <textarea
          ref={ref as any}
          className={cn(baseStyles, 'resize-y min-h-[80px]', className)}
          {...(props as any)}
        />
      );
    }

    return (
      <input
        ref={ref as any}
        className={cn(baseStyles, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
