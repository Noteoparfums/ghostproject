import type { HTMLAttributes } from 'react';
import { BRAND, type BrandMarkVariant } from '../../config/brand';
import { cn } from '../../lib/cn';
import BrandMark from './BrandMark';

interface BrandLockupProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BrandMarkVariant;
  compact?: boolean;
}

export function BrandLockup({
  variant = 'primary',
  compact = false,
  className,
  ...props
}: BrandLockupProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 text-current', className)}
      aria-label={BRAND.name}
      {...props}
    >
      <BrandMark
        variant={variant}
        decorative
        className={cn(compact ? 'h-7 w-7' : 'h-8 w-8')}
      />
      {!compact && (
        <span className="text-base font-extrabold tracking-[-0.03em]">{BRAND.name}</span>
      )}
    </span>
  );
}

export default BrandLockup;