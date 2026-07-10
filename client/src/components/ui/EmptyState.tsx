import { useId } from 'react';
import type { MouseEventHandler, ReactNode } from 'react';
import Button from './Button';
import { cn } from '../../lib/cn';

export interface EmptyStateAction {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  body?: ReactNode;
  cta?: EmptyStateAction;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

export function EmptyState({
  illustration,
  title,
  body,
  cta,
  headingLevel = 3,
  className,
}: EmptyStateProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const bodyId = body ? `${generatedId}-body` : undefined;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4c9ba] bg-[#fffdf8]/80 p-8 text-center dark:border-[#40564c] dark:bg-[#1d2b26]/60',
        className
      )}
    >
      {illustration && (
        <div aria-hidden="true" className="mb-4 text-[#78847e] dark:text-[#8f9d96]">
          {illustration}
        </div>
      )}

      <Heading id={titleId} className="text-base font-bold text-[#263b33] dark:text-[#f8f3e9]">
        {title}
      </Heading>

      {body && (
        <div
          id={bodyId}
          className="mt-2 max-w-sm text-sm leading-6 text-[#5d6b65] dark:text-[#b8c0bb]"
        >
          {body}
        </div>
      )}

      {cta && (
        <Button
          variant="secondary"
          size="sm"
          onClick={cta.onClick}
          disabled={cta.disabled}
          loading={cta.loading}
          loadingLabel={cta.loadingLabel}
          className="mt-5"
        >
          {cta.label}
        </Button>
      )}
    </section>
  );
}
export default EmptyState;
