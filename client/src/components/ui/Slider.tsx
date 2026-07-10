import { useId } from 'react';
import { cn } from '../../lib/cn';

export interface SliderProps {
  label?: string;
  ariaLabel?: string;
  minLabel?: string;
  maxLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  label,
  ariaLabel,
  minLabel = '0%',
  maxLabel = '100%',
  min = 0,
  max = 100,
  step = 1,
  value,
  formatValue = (currentValue) => `${currentValue}%`,
  onChange,
  className,
  disabled = false,
}: SliderProps) {
  const id = useId();
  const endpointsId = `${id}-endpoints`;
  const formattedValue = formatValue(value);

  return (
    <div
      className={cn(
        'flex w-full select-none flex-col gap-2',
        disabled && 'opacity-60',
        className
      )}
      data-disabled={disabled || undefined}
    >
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
        )}
        <output
          htmlFor={id}
          className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-semibold tabular-nums text-foreground"
        >
          {formattedValue}
        </output>
      </div>

      <div className="relative flex min-h-11 items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label ? undefined : ariaLabel || 'Value'}
          aria-describedby={endpointsId}
          aria-valuetext={formattedValue}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className={cn(
            'h-11 w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            disabled && 'cursor-not-allowed'
          )}
        />
      </div>

      <div
        id={endpointsId}
        className="flex justify-between gap-4 text-[11px] font-medium text-muted-foreground"
      >
        <span>{minLabel}</span>
        <span className="text-right">{maxLabel}</span>
      </div>
    </div>
  );
}
export default Slider;
