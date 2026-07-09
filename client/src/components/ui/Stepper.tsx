import { cn } from '../../lib/cn';

export interface StepperProps {
  steps: string[];
  active: number;
  className?: string;
}

export function Stepper({ steps, active, className }: StepperProps) {
  return (
    <div className={cn('flex items-center w-full select-none', className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < active;
        const isActive = idx === active;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center relative">
              {/* Step indicator dot */}
              <div
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all border-2',
                  isCompleted && 'bg-blue-600 border-blue-600 text-white',
                  isActive && 'bg-white border-blue-600 text-blue-600 dark:bg-zinc-950 dark:border-blue-500 dark:text-blue-400',
                  !isCompleted && !isActive && 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                )}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              {/* Step title label */}
              <span 
                className={cn(
                  'absolute top-9 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block',
                  isActive && 'text-blue-600 dark:text-blue-400',
                  isCompleted && 'text-zinc-600 dark:text-zinc-400',
                  !isCompleted && !isActive && 'text-zinc-400 dark:text-zinc-500'
                )}
              >
                {step}
              </span>
            </div>

            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 transition-all duration-300',
                  isCompleted ? 'bg-blue-600 dark:bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-800'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default Stepper;
