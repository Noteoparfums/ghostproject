import { useId } from 'react';
import type { SVGProps } from 'react';
import type { BrandMarkVariant } from '../../config/brand';
import { cn } from '../../lib/cn';

interface BrandMarkProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  variant?: BrandMarkVariant;
  decorative?: boolean;
}

export function BrandMark({
  variant = 'primary',
  decorative = true,
  className,
  ...props
}: BrandMarkProps) {
  const titleId = useId();
  const monochrome = variant === 'monochrome';

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      className={cn('shrink-0', className)}
      {...props}
    >
      {!decorative && <title id={titleId}>Briefloom</title>}
      <path
        d="M9 12.5c8.4 0 12.6 4.2 12.6 12.6S25.8 37.7 34.2 37.7"
        stroke={monochrome ? 'currentColor' : '#BE5A3C'}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M39 10.3c-8.4 0-12.6 4.2-12.6 12.6S22.2 35.5 13.8 35.5"
        stroke={monochrome ? 'currentColor' : '#263B33'}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M10.2 24h27.6"
        stroke={monochrome ? 'currentColor' : '#D6A84B'}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="12.5" r="3.3" fill={monochrome ? 'currentColor' : '#BE5A3C'} />
      <circle cx="39" cy="10.3" r="3.3" fill={monochrome ? 'currentColor' : '#263B33'} />
      <circle cx="10.2" cy="24" r="3.3" fill={monochrome ? 'currentColor' : '#D6A84B'} />
    </svg>
  );
}

export default BrandMark;