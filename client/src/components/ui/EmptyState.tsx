import type { ReactNode } from 'react';
import Button from './Button';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  body?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ illustration, title, body, cta, className }: EmptyStateProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-2xl bg-zinc-50/50 border-zinc-200 dark:bg-zinc-950/20 dark:border-zinc-800/80 min-h-[300px]',
        className
      )}
    >
      {illustration && (
        <div className="mb-4 text-zinc-400 dark:text-zinc-600">
          {illustration}
        </div>
      )}
      
      <h3 className="text-base font-bold dark:text-zinc-200 text-zinc-800">
        {title}
      </h3>
      
      {body && (
        <p className="mt-1 text-sm dark:text-zinc-400 text-zinc-500 max-w-sm">
          {body}
        </p>
      )}
      
      {cta && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={cta.onClick} 
          className="mt-5"
        >
          {cta.label}
        </Button>
      )}
    </div>
  );
}
export default EmptyState;
