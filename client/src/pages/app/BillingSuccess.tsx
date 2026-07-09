import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useBilling } from '../../contexts/BillingContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Button from '../../components/ui/Button';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { track } from '../../lib/analytics';

export function BillingSuccess() {
  useDocumentMeta({
    title: 'Payment Successful — Ghostwriter OS',
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useBilling();
  const reducedMotion = useReducedMotion();

  const [status, setStatus] = useState<'polling' | 'success' | 'timeout'>('polling');

  useEffect(() => {
    track('checkout_completed');

    // Polling loop
    let tries = 0;
    const interval = setInterval(async () => {
      tries++;
      try {
        await refresh();
        // Since it's mock / active billing state, we've successfully refreshed.
        // In a real app we'd verify subscription status is active/trialing.
        clearInterval(interval);
        setStatus('success');
        
        // Trigger confetti (unless reduced motion is preferred)
        if (!reducedMotion) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (e) {
        if (tries >= 20) {
          clearInterval(interval);
          setStatus('timeout');
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [refresh, reducedMotion]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none text-zinc-100">
      <div className="w-full max-w-md p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-2xl flex flex-col items-center text-center gap-6">
        {status === 'polling' && (
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <h2 className="text-base font-bold dark:text-zinc-200 text-zinc-800">Verifying Payment...</h2>
            <p className="text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed">
              We are confirming your invoice with the provider. This should take a few seconds.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h2 className="text-xl font-bold dark:text-zinc-200 text-zinc-800">Upgrade Activated!</h2>
            <p className="text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed">
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
            <AlertTriangle className="w-16 h-16 text-amber-500" />
            <h2 className="text-xl font-bold dark:text-zinc-200 text-zinc-800">Confirmation Delay</h2>
            <p className="text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed">
              Payment received. Plan activation is taking longer than usual. Please check back in a few minutes, or reach out to support.
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
