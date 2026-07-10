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
  'aria-live': ariaLive,
  'aria-atomic': ariaAtomic,
  'aria-busy': ariaBusy,
  ...props
}: SkeletonProps) {
  const isAccessible = Boolean(role || ariaLabel);
  const resolvedRole = ariaLabel ? role ?? 'status' : role;
  const isStatus = resolvedRole === 'status';

  return (
    <div
      data-animated={animated}
      className={cn(
        'rounded-lg bg-[#e2d9cc] dark:bg-[#354840]',
        animated && 'animate-pulse motion-reduce:animate-none',
        className
      )}
      role={resolvedRole}
      aria-hidden={ariaHidden ?? (isAccessible ? undefined : true)}
      aria-label={ariaLabel}
      aria-live={ariaLive ?? (isStatus ? 'polite' : undefined)}
      aria-atomic={ariaAtomic ?? (isStatus ? true : undefined)}
      aria-busy={ariaBusy ?? (isStatus ? true : undefined)}
      {...props}
    />
  );
}
export default Skeleton;
