import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { billingApi } from '../../api/endpoints/billing';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import { CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { track } from '../../lib/analytics';
import { BRAND } from '../../config/brand';

export function Pricing() {
  useDocumentMeta({
    title: 'Pricing plans',
    description: `Get started with ${BRAND.name}. Modular plans for individual copywriters and growing digital agencies.`,
    canonical: '/pricing',
  });

  const { status } = useAuth();
  const toast = useToast();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  // Modular plans constants (prices in integer cents)
  const plans = [
    {
      name: 'Starter',
      slug: 'free',
      monthly_price: 0,
      annual_price: 0,
      credits: '5.00',
      description: 'Ideal for drafting copy concepts and initial research.',
      features: [
        '5 monthly credits included',
        'VSL copy funnel engine',
        'AIDA & PAS structures',
        'Save up to 5 copies',
        'Standard generation speed',
      ],
    },
    {
      name: 'Pro Copywriter',
      slug: 'pro',
      monthly_price: 4900,
      annual_price: 47000, // $39/mo billed annually
      credits: '50.00',
      description: 'Designed for full-time direct response copywriters.',
      features: [
        '50 monthly credits included',
        'All copy funnel types (VSL, Magnet, PDP...)',
        'Create custom Brand Voice profiles',
        'Regenerate sections and generate A/B variants',
        'Export drafts as Markdown / HTML / TXT',
        'Priority email support',
      ],
    },
    {
      name: 'Agency Hub',
      slug: 'agency',
      monthly_price: 19900,
      annual_price: 191000, // $159/mo billed annually
      credits: '250.00',
      description: 'Built for scaling campaigns across creative teams.',
      features: [
        '250 monthly credits included',
        'Team seats (up to 5 editors)',
        'Shared Brand Voice profiles and assets',
        'Advanced API keys configuration',
        'Custom fine-tuned copywriting model',
        'Dedicated Slack channel access',
      ],
    },
  ];

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
        // Complete mock checkout directly if no URL returned (dev environment fallback)
        await billingApi.completeMockCheckout({
          type: 'subscription',
          planSlug: slug,
          interval: billingInterval,
        });
        toast.success(`Mock subscription activated for ${slug}!`);
        window.location.href = '/app/billing/success?session=mock';
      }
    } catch (err: any) {
      toast.error(`Checkout failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-20 px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Simple, Transparent Plans
          </h1>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
            All plans include core Direct Response writing templates. Pay only for the campaign limits you consume.
          </p>
        </div>

        {/* Annual billing toggle */}
        <div className="mt-10 flex items-center gap-3 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => {
              setBillingInterval('monthly');
              track('pricing_toggle_switched', { interval: 'monthly' });
            }}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-lg transition-all',
              billingInterval === 'monthly'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
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
              'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5',
              billingInterval === 'annual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Billed Annually
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase tracking-wider font-extrabold">
              Save ~20%
            </span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16 max-w-6xl">
          {plans.map((p) => {
            const price = billingInterval === 'monthly' ? p.monthly_price : p.annual_price;
            const displayPrice = price === 0 ? '0' : (price / 100 / (billingInterval === 'monthly' ? 1 : 12)).toFixed(0);
            
            const originalYearlyValue = p.monthly_price * 12;
            const savingsPercent = originalYearlyValue > 0 
              ? Math.round(((originalYearlyValue - p.annual_price) / originalYearlyValue) * 100)
              : 0;

            return (
              <div
                key={p.slug}
                className={cn(
                  'p-8 rounded-2xl border flex flex-col gap-6 bg-zinc-900/10 backdrop-blur-xs',
                  p.slug === 'pro' ? 'border-blue-600/50 shadow-xl shadow-blue-500/5' : 'border-zinc-900'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100">{p.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{p.credits} monthly credits</p>
                  </div>
                  {p.slug === 'pro' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                      Standard
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">
                  {p.description}
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">${displayPrice}</span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>

                {billingInterval === 'annual' && p.annual_price > 0 && (
                  <div className="text-[11px] font-semibold text-emerald-400">
                    Billed annually (${(p.annual_price / 100).toFixed(0)}/yr) — saves {savingsPercent}%
                  </div>
                )}

                <div className="h-px bg-zinc-900" />

                <ul className="flex-grow flex flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleChoosePlan(p.slug)}
                  variant={p.slug === 'pro' ? 'primary' : 'secondary'}
                  className="w-full mt-4"
                >
                  {p.slug === 'free' ? 'Get Started' : `Choose ${p.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Guarantees */}
        <div className="mt-20 border border-zinc-900 bg-zinc-900/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 max-w-3xl w-full">
          <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-100">14-Day Money-Back Guarantee</h4>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              If {BRAND.name} doesn't improve your campaign conversions, drop us a line within 14 days of upgrade for a full refund of your invoice. Reversed charges apply instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Pricing;
