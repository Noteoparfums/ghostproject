import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useBilling } from '../../contexts/BillingContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Button from '../../components/ui/Button';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { track } from '../../lib/analytics';
import type { BillingState } from '../../api/endpoints/billing';

function materiallyChanged(before: BillingState, after: BillingState) {
  return (
    before.credit_balance !== after.credit_balance ||
    before.plan?.slug !== after.plan?.slug ||
    before.subscription?.id !== after.subscription?.id ||
    before.subscription?.status !== after.subscription?.status
  );
}

export function BillingSuccess() {
  useDocumentMeta({
    title: 'Payment verification',
  });

  const { refresh } = useBilling();
  const reducedMotion = useReducedMotion();
  const baselineRef = useRef<BillingState | null>(null);

  const [status, setStatus] = useState<'polling' | 'success' | 'timeout'>('polling');

  useEffect(() => {
    let disposed = false;
    let tries = 0;
    let timeout: number | undefined;

    const poll = async () => {
      try {
        const next = await refresh();
        if (disposed || !next) return;
        if (!baselineRef.current) {
          baselineRef.current = next;
        } else if (materiallyChanged(baselineRef.current, next)) {
          setStatus('success');
          track('checkout_completed');
          if (!reducedMotion) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          }
          return;
        }
      } catch (error) {
        console.error('Billing verification request failed', error);
      }
      tries += 1;
      if (tries >= 20) {
        setStatus('timeout');
      } else {
        timeout = window.setTimeout(poll, 1500);
      }
    };
    void poll();

    return () => {
      disposed = true;
      if (timeout) window.clearTimeout(timeout);
    };
  }, [refresh, reducedMotion]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center p-6 select-none text-[var(--color-text-strong)]">
      <div className="w-full max-w-md p-8 border rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] shadow-2xl flex flex-col items-center text-center gap-6">
        {status === 'polling' && (
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-[var(--color-accent-primary)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <h2 className="text-base font-bold text-[var(--color-text-strong)]">Verifying Payment...</h2>
            <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
              We are confirming your invoice with the provider. This should take a few seconds.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-[var(--color-status-success)] animate-bounce" />
            <h2 className="text-xl font-bold text-[var(--color-text-strong)]">Billing change confirmed</h2>
            <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
              Payment confirmed. Your account limits have been successfully updated.
            </p>
            <Link to="/app" className="w-full mt-4">
              <Button variant="primary" className="w-full">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}

        {status === 'timeout' && (
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-16 h-16 text-[var(--color-status-warning)]" />
            <h2 className="text-xl font-bold text-[var(--color-text-strong)]">Confirmation Delay</h2>
            <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
              We could not yet verify a plan or credit change. Your provider may still be processing it. Check billing again shortly or contact support.
            </p>
            <Link to="/app" className="w-full mt-4">
              <Button variant="secondary" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default BillingSuccess;
