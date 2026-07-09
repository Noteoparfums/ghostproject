import {  createContext, useContext, useState, useEffect,  useCallback  } from 'react';
import type { ReactNode } from 'react';
import type { Subscription, Plan } from '@ghostwriter/shared';
import { useAuth } from './AuthContext';
import { billingApi } from '../api/endpoints/billing';

interface BillingContextType {
  plan: Plan | null;
  subscription: Subscription | null;
  credits: string;
  isLoading: boolean;
  refresh: () => Promise<void>;
  
  // Derived flags
  isPastDue: boolean;
  isPaused: boolean;
  pendingDowngrade: boolean;
  inCancelGrace: boolean;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [credits, setCredits] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const state = await billingApi.state();
      setSubscription(state.subscription);
      setPlan(state.plan);
      setCredits(state.credit_balance || '0.00');
    } catch (e) {
      console.error('Failed to load billing state', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setSubscription(null);
      setPlan(null);
      setCredits('0.00');
      setIsLoading(false);
    }
  }, [user, refresh]);

  // Derived flags
  const isPastDue = subscription?.status === 'past_due';
  const isPaused = subscription?.status === 'paused';
  const pendingDowngrade = subscription?.pending_plan_id !== null;
  const inCancelGrace = subscription ? subscription.status === 'cancelled' || subscription.cancel_at_period_end : false;

  return (
    <BillingContext.Provider
      value={{
        plan,
        subscription,
        credits,
        isLoading,
        refresh,
        isPastDue,
        isPaused,
        pendingDowngrade,
        inCancelGrace,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
