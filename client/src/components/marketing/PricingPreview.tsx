import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { PRICING_PLANS } from '../../config/pricing';
import { cn } from '../../lib/cn';

export function PricingPreview() {
  return (
    <section
      className="px-[var(--space-page)] py-[var(--space-section)]"
      aria-labelledby="pricing-preview-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#BE5A3C] dark:text-[#d8795c]">
            Transparent plans
          </p>
          <h2
            id="pricing-preview-heading"
            className="font-display text-3xl leading-tight text-[var(--color-text-strong)] sm:text-4xl"
          >
            Start with what you&nbsp;need.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-subtle)]">
            Every plan includes the full workspace. Upgrade when your volume&nbsp;grows.
          </p>
        </div>

        {/* Plan cards */}
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const price = plan.monthlyPriceCents / 100;
            const isRecommended = plan.recommended;
            const href = plan.slug === 'free' ? '/signup' : '/pricing';

            return (
              <div
                key={plan.slug}
                className={cn(
                  'relative flex flex-col rounded-[var(--radius-xl)] border p-6',
                  'bg-[var(--color-surface-raised)] transition-shadow duration-200',
                  isRecommended
                    ? 'border-[var(--color-accent-primary)]/50 shadow-lg'
                    : 'border-[var(--color-border-subtle)]',
                )}
              >
                {isRecommended && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-[#BE5A3C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:bg-[#d8795c]">
                    Recommended
                  </span>
                )}

                <p className="text-sm font-bold text-[var(--color-text-strong)]">{plan.name}</p>

                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl text-[var(--color-text-strong)]">
                    ${price}
                  </span>
                  <span className="text-xs text-[var(--color-text-subtle)]">/mo</span>
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                  {plan.monthlyCredits} credits / month
                </p>

                <div className="mt-5 flex-1" />

                <Link to={href} tabIndex={-1} className="mt-auto">
                  <Button
                    variant={isRecommended ? 'primary' : 'secondary'}
                    className="w-full text-sm"
                  >
                    {plan.ctaLabel}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom link */}
        <div className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#BE5A3C] transition-colors hover:text-[#9f4933] dark:text-[#d8795c] dark:hover:text-[#f0a087]"
          >
            Compare all plan details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PricingPreview;
