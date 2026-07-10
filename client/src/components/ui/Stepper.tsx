import { cn } from '../../lib/cn';

export interface StepperProps {
  steps: string[];
  active: number;
  label?: string;
  className?: string;
}

export function Stepper({ steps, active, label = 'Progress', className }: StepperProps) {
  const activeStep = Math.min(Math.max(active, 0), Math.max(steps.length - 1, 0));

  return (
    <div className={cn('w-full select-none', className)}>
      {steps.length > 0 && (
        <p aria-hidden="true" className="mb-3 text-sm font-semibold text-[#263b33] dark:text-[#f8f3e9] sm:hidden">
          Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
        </p>
      )}
      <ol aria-label={label} className="flex w-full items-center">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <li
              key={`${step}-${index}`}
              aria-current={isActive ? 'step' : undefined}
              className="flex flex-1 items-center last:flex-initial"
            >
              <div className="relative flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors motion-reduce:transition-none',
                    isCompleted && 'border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-[#17211d]',
                    isActive && 'border-[#b9573b] bg-[#fffdf8] text-[#9f4933] dark:border-[#d8795c] dark:bg-[#17211d] dark:text-[#f0a087]',
                    !isCompleted && !isActive && 'border-[#d4c9ba] bg-[#fffdf8] text-[#78847e] dark:border-[#40564c] dark:bg-[#17211d] dark:text-[#8f9d96]'
                  )}
                >
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span
                  className={cn(
                    'absolute top-10 hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-wider sm:block',
                    isActive && 'text-[#9f4933] dark:text-[#f0a087]',
                    isCompleted && 'text-emerald-800 dark:text-emerald-300',
                    !isCompleted && !isActive && 'text-[#78847e] dark:text-[#8f9d96]'
                  )}
                >
                  {step}
                </span>
                <span className="sr-only">
                  {step}, {isCompleted ? 'completed' : isActive ? 'current step' : 'not started'}
                </span>
              </div>

              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mx-3 h-0.5 flex-1 transition-colors duration-300 motion-reduce:transition-none sm:mx-4',
                    isCompleted ? 'bg-emerald-700 dark:bg-emerald-500' : 'bg-[#d4c9ba] dark:bg-[#40564c]'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
export default Stepper;
