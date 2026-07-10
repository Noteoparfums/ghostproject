import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { billingApi } from '../../api/endpoints/billing';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/cn';
import { track } from '../../lib/analytics';
import { BRAND } from '../../config/brand';
import { PRICING_PLANS } from '../../config/pricing';

export function Pricing() {
  useDocumentMeta({
    title: 'Pricing plans',
    description: `Get started with ${BRAND.name}. Modular plans for individual copywriters and growing digital agencies.`,
    canonical: '/pricing',
  });

  const { status } = useAuth();
  const toast = useToast();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const handleChoosePlan = async (slug: string) => {
    if (slug === 'free') {
      window.location.href = '/signup';
      return;
    }

    if (status !== 'authed') {
      window.location.href = `/signup?plan=${slug}&interval=${billingInterval}`;
      return;
    }

    // Authenticated user checkout
    try {
      track('checkout_started', { plan: slug, interval: billingInterval });
      toast.info('Initializing checkout session...');

      const response = await billingApi.checkoutSubscription({
        planSlug: slug,
        interval: billingInterval,
      });

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('The payment provider did not return a checkout URL. Please try again later.');
      }
    } catch (err: any) {
      toast.error(`Checkout failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-text-default)] py-20 px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-text-strong)]">
            Simple, Transparent Plans
          </h1>
          <p className="mt-4 text-sm text-[var(--color-text-subtle)] leading-relaxed">
            All plans include core Direct Response writing templates. Pay only for the campaign limits you consume.
          </p>
        </div>

        {/* Annual billing toggle */}
        <div className="mt-10 flex items-center gap-3 p-1 rounded-[var(--radius-xl)] bg-[var(--color-surface-sunken)] border border-[var(--color-border-subtle)]">
          <button
            onClick={() => {
              setBillingInterval('monthly');
              track('pricing_toggle_switched', { interval: 'monthly' });
            }}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-[var(--radius-lg)] transition-all',
              billingInterval === 'monthly'
                ? 'bg-[var(--color-accent-primary)] text-white shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]'
            )}
          >
            Billed Monthly
          </button>
          <button
            onClick={() => {
              setBillingInterval('annual');
              track('pricing_toggle_switched', { interval: 'annual' });
            }}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-[var(--radius-lg)] transition-all flex items-center gap-1.5',
              billingInterval === 'annual'
                ? 'bg-[var(--color-accent-primary)] text-white shadow-[var(--shadow-sm)]'
                : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]'
            )}
          >
            Billed Annually
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-status-success)]/20 text-[var(--color-status-success)] uppercase tracking-wider font-extrabold">
              Save ~20%
            </span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16 max-w-6xl">
          {PRICING_PLANS.map((p) => {
            const price = billingInterval === 'monthly' ? p.monthlyPriceCents : p.annualPriceCents;
            const displayPrice = price === 0 ? '0' : (price / 100 / (billingInterval === 'monthly' ? 1 : 12)).toFixed(0);

            const originalYearlyValue = p.monthlyPriceCents * 12;
            const savingsPercent = originalYearlyValue > 0
              ? Math.round(((originalYearlyValue - p.annualPriceCents) / originalYearlyValue) * 100)
              : 0;

            return (
              <div
                key={p.slug}
                className={cn(
                  'p-8 rounded-[var(--radius-xl)] border flex flex-col gap-6 bg-[var(--color-surface-raised)]',
                  p.recommended
                    ? 'border-[var(--color-accent-primary)]/50 shadow-xl'
                    : 'border-[var(--color-border-subtle)]'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-[var(--color-text-strong)]">{p.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{p.monthlyCredits} monthly credits</p>
                  </div>
                  {p.recommended && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] rounded">
                      Standard
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed min-h-[40px]">
                  {p.description}
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[var(--color-text-strong)]">${displayPrice}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">/mo</span>
                </div>

                {billingInterval === 'annual' && p.annualPriceCents > 0 && (
                  <div className="text-[11px] font-semibold text-[var(--color-status-success)]">
                    Billed annually (${(p.annualPriceCents / 100).toFixed(0)}/yr) — saves {savingsPercent}%
                  </div>
                )}

                <div className="h-px bg-[var(--color-border-subtle)]" />

                <ul className="flex-grow flex flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[var(--color-text-subtle)] leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-[var(--color-status-success)] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleChoosePlan(p.slug)}
                  variant={p.recommended ? 'primary' : 'secondary'}
                  className="w-full mt-4"
                >
                  {p.slug === 'free' ? 'Get Started' : p.ctaLabel}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Guarantees */}
        <div className="mt-20 border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-6 rounded-[var(--radius-xl)] flex flex-col sm:flex-row items-center gap-6 max-w-3xl w-full">
          <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text-strong)]">Questions before upgrading?</h4>
            <p className="mt-1 text-xs text-[var(--color-text-subtle)] leading-relaxed">
              Review the refund-policy draft and current provider terms before purchase. Refund submission is not available inside the workspace; {BRAND.support.contactLabel.toLowerCase()} for help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Pricing;
