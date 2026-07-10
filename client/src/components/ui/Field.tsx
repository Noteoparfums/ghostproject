import { cloneElement, isValidElement, useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface FieldProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, error, className, children }: FieldProps) {
  const generatedId = useId();
  const child = isValidElement<{
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
  }>(children)
    ? children
    : null;
  const controlId = id ?? child?.props.id ?? generatedId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [child?.props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = child
    ? cloneElement(child, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : child.props['aria-invalid'],
      })
    : children;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label 
          htmlFor={controlId} 
          className="text-xs font-semibold uppercase tracking-wider dark:text-zinc-400 text-zinc-500"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {control}
      </div>

      {hint && (
        <p 
          id={hintId} 
          className="text-xs dark:text-zinc-500 text-zinc-500"
        >
          {hint}
        </p>
      )}

      {error && (
        <p 
          id={errorId} 
          className="text-xs text-red-500 dark:text-red-400 font-medium" 
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
export default Field;
