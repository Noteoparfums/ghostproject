import { useId } from 'react';
import { cn } from '../../lib/cn';

export interface SliderProps {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  label,
  minLabel = '0%',
  maxLabel = '100%',
  min = 0,
  max = 100,
  value,
  onChange,
  className,
  disabled,
}: SliderProps) {
  const id = useId();

  return (
    <div className={cn('flex flex-col gap-2 w-full select-none', className)}>
      <div className="flex justify-between items-center">
        {label && (
          <label 
            htmlFor={id} 
            className="text-xs font-semibold uppercase tracking-wider dark:text-zinc-400 text-zinc-500"
          >
            {label}
          </label>
        )}
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-mono">
          {value}%
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 accent-blue-600',
            disabled && 'opacity-50 pointer-events-none'
          )}
        />
      </div>

      <div className="flex justify-between text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
export default Slider;
