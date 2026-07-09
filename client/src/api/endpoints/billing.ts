import { api } from '../client';
import type { Plan, Subscription, Invoice, BillingDetailsInput } from '@ghostwriter/shared';

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
  
  completeMockCheckout: (body: { 
    type: 'subscription' | 'topup'; 
    planSlug?: string; 
    interval?: 'monthly' | 'annual'; 
    amountCents?: number 
  }) =>
    api<{ success: boolean }>('/api/billing/checkout/mock-complete', { method: 'POST', body }),
  
  portal: () =>
    api<{ url: string }>('/api/billing/portal', { method: 'POST' }),
  
  cancel: () =>
    api<{ success: boolean }>('/api/billing/subscription/cancel', { method: 'POST' }),

  // Mocking coupon and details update where server logic does not exist yet to satisfy forms
  validateCoupon: (code: string) =>
    Promise.resolve({ valid: code.toUpperCase() === 'GHOST50', percent_off: 50 }),

  updateDetails: (body: BillingDetailsInput) =>
    Promise.resolve({ success: true, data: body }),
};
