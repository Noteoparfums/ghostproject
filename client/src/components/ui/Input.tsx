import { forwardRef } from 'react';
import type {
  ChangeEventHandler,
  ForwardedRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  success?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      multiline,
      rows,
      error = false,
      success = false,
      onChange,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const isInvalid = error || ariaInvalid === true || ariaInvalid === 'true';
    const baseStyles = cn(
      'min-h-11 w-full select-text rounded-xl border px-4 py-2.5 text-sm font-normal transition-[color,background-color,border-color,box-shadow]',
      'border-zinc-300 bg-white text-zinc-800 placeholder:text-zinc-500 hover:border-zinc-400 focus-visible:border-[#b9573b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9573b]/40',
      'disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 disabled:opacity-70 read-only:bg-zinc-50',
      'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus-visible:border-[#d8795c] dark:focus-visible:ring-[#d8795c]/40 dark:disabled:bg-zinc-800 dark:read-only:bg-zinc-800',
      isInvalid &&
        'border-red-600 focus-visible:border-red-600 focus-visible:ring-red-500/40 dark:border-red-500 dark:focus-visible:border-red-500 dark:focus-visible:ring-red-500/30',
      success &&
        !isInvalid &&
        'border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/30 dark:border-emerald-500'
    );

    if (multiline) {
      return (
        <textarea
          ref={ref as ForwardedRef<HTMLTextAreaElement>}
          rows={rows}
          aria-invalid={isInvalid || undefined}
          data-status={isInvalid ? 'error' : success ? 'success' : undefined}
          className={cn(baseStyles, 'min-h-24 resize-y', className)}
          onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
          {...(props as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        ref={ref as ForwardedRef<HTMLInputElement>}
        aria-invalid={isInvalid || undefined}
        data-status={isInvalid ? 'error' : success ? 'success' : undefined}
        className={cn(baseStyles, className)}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
