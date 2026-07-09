import { useId } from 'react';
import { cn } from '../../lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, className, disabled }: ToggleProps) {
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
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          checked ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
export default Toggle;
