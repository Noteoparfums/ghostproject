import { api } from '../client';
import type { Plan, Subscription, Invoice } from '@ghostwriter/shared';

export interface BillingState {
  subscription: Subscription | null;
  plan: Plan | null;
  credit_balance: string;
}

export const billingApi = {
  // Returns plan, subscription, and credit balance in one call
  state: () => api<BillingState>('/api/billing/state'),
  
  invoices: () => api<Invoice[]>('/api/billing/invoices'),
  
  checkoutSubscription: (body: { planSlug: string; interval: 'monthly' | 'annual' }) =>
    api<{ url: string }>('/api/billing/checkout/subscription', { method: 'POST', body }),
  
  checkoutTopup: (body: { amountCents: number }) =>
    api<{ url: string }>('/api/billing/checkout/topup', { method: 'POST', body }),
  
  portal: () =>
    api<{ url: string }>('/api/billing/portal', { method: 'POST' }),
  
  cancel: () =>
    api<{ success: boolean }>('/api/billing/subscription/cancel', { method: 'POST' }),
};
