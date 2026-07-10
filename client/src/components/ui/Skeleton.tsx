import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
}

export function Skeleton({
  animated = true,
  className,
  role,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  ...props
}: SkeletonProps) {
  const isAccessible = Boolean(role || ariaLabel);

  return (
    <div
      className={cn(
        'rounded-lg bg-[#e2d9cc] dark:bg-[#354840]',
        animated && 'animate-pulse motion-reduce:animate-none',
        className
      )}
      role={ariaLabel ? role ?? 'status' : role}
      aria-hidden={ariaHidden ?? (isAccessible ? undefined : true)}
      aria-label={ariaLabel}
      {...props}
    />
  );
}
export default Skeleton;
