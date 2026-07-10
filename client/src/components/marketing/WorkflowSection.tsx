import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

const steps = [
  ['01', 'Shape the brief', 'Capture the offer, audience, proof, objections, and desired action in one focused workspace.'],
  ['02', 'Choose the voice', 'Apply a reusable brand voice so every asset sounds recognizably yours\u2014not generically AI.'],
  ['03', 'Weave the campaign', 'Generate coordinated hooks, pages, scripts, and emails that share one strategic thread.'],
] as const;

export function WorkflowSection() {
  return (
    <section
      className="px-[var(--space-page)] py-[var(--space-section)]"
      aria-labelledby="workflow-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-16">
        {/* Left column — eyebrow + heading */}
        <div className="max-w-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#BE5A3C] dark:text-[#d8795c]">
            A better way to create
          </p>
          <h2
            id="workflow-heading"
            className="font-display text-3xl leading-tight text-[var(--color-text-strong)] sm:text-4xl"
          >
            From scattered prompts to one strategic&nbsp;thread.
          </h2>
        </div>

        {/* Right column — step cards */}
        <ol className="grid gap-4" role="list">
          {steps.map(([num, title, desc]) => (
            <li
              key={num}
              className={cn(
                'group flex items-start gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)]',
                'bg-[var(--color-surface-raised)] p-5 transition-[transform,box-shadow] duration-200',
                'hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
              )}
            >
              <span className="font-display shrink-0 text-2xl italic text-[#BE5A3C] dark:text-[#d8795c]">
                {num}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--color-text-strong)]">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-subtle)]">
                  {desc}
                </p>
              </div>
              <ChevronRight
                className="mt-0.5 hidden h-4 w-4 shrink-0 text-[var(--color-text-subtle)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block"
                aria-hidden="true"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WorkflowSection;
