import { Layers3 } from 'lucide-react';
import { cn } from '../../lib/cn';

const capabilities = [
  'Project-based campaign organization',
  'Reusable brand voice profiles',
  'Coordinated funnel generation',
  'Campaign history summaries',
] as const;

export function CapabilitySection() {
  return (
    <section
      className={cn(
        'bg-[#263b33] text-[#f8f3e9] dark:bg-[#101915]',
        'px-[var(--space-page)] py-[var(--space-section)]',
      )}
      aria-labelledby="capability-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left column — copy */}
        <div className="max-w-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#D6A84B]">
            What the workspace keeps together
          </p>
          <h2
            id="capability-heading"
            className="font-display text-3xl leading-tight sm:text-4xl"
          >
            One audience, one promise, one campaign&nbsp;context.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[#f8f3e9]/70">
            Every campaign starts with context&mdash;your audience, your offer, your proof.
            Briefloom keeps that context threaded through every asset so the copy stays
            strategically coherent, the voice stays yours, and every section is yours to
            review, refine, or regenerate before anything goes&nbsp;live.
          </p>
        </div>

        {/* Right column — glass card */}
        <div
          className={cn(
            'rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.055]',
            'p-6 backdrop-blur-sm sm:p-8',
          )}
        >
          <div className="mb-5 flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-[#d8795c]" aria-hidden="true" />
            <h3 className="text-base font-bold">Available today</h3>
          </div>

          <ul className="grid gap-3" role="list">
            {capabilities.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-2.5 text-sm leading-relaxed text-[#f8f3e9]/85"
              >
                <span
                  className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#D6A84B]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CapabilitySection;
