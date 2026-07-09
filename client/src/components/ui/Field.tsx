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
  const hintId = id ? `${id}-hint` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-semibold uppercase tracking-wider dark:text-zinc-400 text-zinc-500"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {children}
      </div>

      {error ? (
        <p 
          id={errorId} 
          className="text-xs text-red-500 dark:text-red-400 font-medium" 
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p 
          id={hintId} 
          className="text-xs dark:text-zinc-500 text-zinc-400"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
export default Field;
