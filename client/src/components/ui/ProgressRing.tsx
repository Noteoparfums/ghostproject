import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  valueLabel?: string;
  displayValue?: ReactNode;
  className?: string;
}

export function ProgressRing({
  value,
  max,
  size = 64,
  strokeWidth = 6,
  label = 'Progress',
  valueLabel,
  displayValue,
  className,
}: ProgressRingProps) {
  const normalizedSize = Number.isFinite(size) ? Math.max(size, 24) : 64;
  const normalizedStrokeWidth = Number.isFinite(strokeWidth)
    ? Math.min(Math.max(strokeWidth, 1), normalizedSize / 2)
    : 6;
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 1;
  const normalizedValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), normalizedMax)
    : 0;
  const radius = (normalizedSize - normalizedStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = normalizedValue / normalizedMax;
  const offset = circumference - percent * circumference;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={normalizedMax}
      aria-valuenow={normalizedValue}
      aria-valuetext={valueLabel ?? `${normalizedValue} of ${normalizedMax}`}
      className={cn('relative flex items-center justify-center shrink-0', className)}
      style={{ width: normalizedSize, height: normalizedSize }}
    >
      <svg aria-hidden="true" focusable="false" className="h-full w-full -rotate-90">
        <circle
          className="text-[#e2d9cc] dark:text-[#354840]"
          strokeWidth={normalizedStrokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={normalizedSize / 2}
          cy={normalizedSize / 2}
        />
        <circle
          className="text-[#b9573b] transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none dark:text-[#d8795c]"
          strokeWidth={normalizedStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={normalizedSize / 2}
          cy={normalizedSize / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono text-xs font-bold text-[#263b33] dark:text-[#f8f3e9]">
          {displayValue ?? normalizedValue}
        </span>
      </div>
    </div>
  );
}
export default ProgressRing;
