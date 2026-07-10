import { useId } from 'react';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import Button from './Button';
import type { ButtonProps } from './Button';
import { cn } from '../../lib/cn';

export interface EmptyStateAction {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  ariaLabel?: string;
  variant?: ButtonProps['variant'];
}

export type EmptyStateTone = 'default' | 'info' | 'warning' | 'danger';

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  illustration?: ReactNode;
  title: string;
  body?: ReactNode;
  cta?: EmptyStateAction;
  headingLevel?: 2 | 3 | 4;
  tone?: EmptyStateTone;
}

export function EmptyState({
  illustration,
  title,
  body,
  cta,
  headingLevel = 3,
  tone = 'default',
  className,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: EmptyStateProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const hasBody = body !== undefined && body !== null && body !== false;
  const bodyId = hasBody ? `${generatedId}-body` : undefined;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const tones: Record<EmptyStateTone, string> = {
    default:
      'border-[#d4c9ba] bg-[#fffdf8]/80 dark:border-[#40564c] dark:bg-[#1d2b26]/60',
    info: 'border-sky-300 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/30',
    warning: 'border-amber-300 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30',
    danger: 'border-red-300 bg-red-50/80 dark:border-red-800 dark:bg-red-950/30',
  };
  const illustrationTones: Record<EmptyStateTone, string> = {
    default: 'text-[#78847e] dark:text-[#8f9d96]',
    info: 'text-sky-700 dark:text-sky-300',
    warning: 'text-amber-700 dark:text-amber-300',
    danger: 'text-red-700 dark:text-red-300',
  };

  return (
    <section
      aria-labelledby={[ariaLabelledBy, titleId].filter(Boolean).join(' ')}
      aria-describedby={[ariaDescribedBy, bodyId].filter(Boolean).join(' ') || undefined}
      data-tone={tone}
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center',
        tones[tone],
        className
      )}
      {...props}
    >
      {illustration && (
        <div aria-hidden="true" className={cn('mb-4', illustrationTones[tone])}>
          {illustration}
        </div>
      )}

      <Heading id={titleId} className="text-base font-bold text-[#263b33] dark:text-[#f8f3e9]">
        {title}
      </Heading>

      {hasBody && (
        <div
          id={bodyId}
          className="mt-2 max-w-sm text-sm leading-6 text-[#5d6b65] dark:text-[#b8c0bb]"
        >
          {body}
        </div>
      )}

      {cta && (
        <Button
          variant={cta.variant ?? (tone === 'danger' ? 'danger' : 'secondary')}
          size="sm"
          onClick={cta.onClick}
          disabled={cta.disabled}
          loading={cta.loading}
          loadingLabel={cta.loadingLabel}
          aria-label={cta.ariaLabel}
          className="mt-5"
        >
          {cta.label}
        </Button>
      )}
    </section>
  );
}
export default EmptyState;
