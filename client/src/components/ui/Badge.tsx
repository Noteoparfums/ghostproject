import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, tone = 'default', className, ...props }: BadgeProps) {
  const tones = {
    default:
      'border-[#d4c9ba] bg-[#eee8de] text-[#263b33] dark:border-[#40564c] dark:bg-[#2b3b35] dark:text-[#d9ddd7]',
    success:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    warning:
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    danger:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300',
    info:
      'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  };

  return (
    <span
      data-tone={tone}
      className={cn(
        'inline-flex max-w-full select-text items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
export default Badge;
