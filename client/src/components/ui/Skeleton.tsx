import {    } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800/80',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
export default Skeleton;
