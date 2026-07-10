import { useId } from 'react';
import { cn } from '../../lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  className,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ToggleProps) {
  const id = useId();

  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div className={cn('flex items-center justify-between gap-4 py-1.5 select-none', className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-semibold dark:text-zinc-300 text-zinc-700 cursor-pointer"
        >
          {label}
        </label>
      )}
      
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'group relative inline-flex h-11 w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9573b]/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none relative h-6 w-11 rounded-full border border-transparent transition-colors duration-200 ease-in-out',
            checked
              ? 'bg-[#b9573b] group-hover:bg-[#9f4933] dark:bg-[#d8795c] dark:group-hover:bg-[#c66a50]'
              : 'bg-zinc-300 group-hover:bg-zinc-400 dark:bg-zinc-700 dark:group-hover:bg-zinc-600'
          )}
        >
          <span
            className={cn(
              'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out group-active:scale-95 motion-reduce:transition-none',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </span>
      </button>
    </div>
  );
}
export default Toggle;
