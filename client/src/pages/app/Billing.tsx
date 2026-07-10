import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useBilling } from '../../contexts/BillingContext';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';
import { billingApi } from '../../api/endpoints/billing';
import { TOPUP_PACKS, formatCents } from '@ghostwriter/shared';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../lib/date';
import { AlertCircle, ExternalLink, Plus } from 'lucide-react';
import { track } from '../../lib/analytics';
import { BRAND } from '../../config/brand';

export function Billing() {
  useDocumentMeta({ title: 'Billing' });
  const { plan, subscription, credits, refresh, isPastDue, inCancelGrace } = useBilling();
  const toast = useToast();
  const [topupOpen, setTopupOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data: invoicesData, loading: loadingInvoices } = useApi(() => billingApi.invoices());
  const invoices = invoicesData || [];

  const openProvider = async () => {
    try {
      const response = await billingApi.portal();
      if (!response.url) throw new Error('The billing provider did not return a portal URL.');
      window.location.href = response.url;
    } catch (error: any) {
      toast.error(error?.message || 'The billing portal is unavailable.');
    }
  };

  const handleTopup = async (packSlug: keyof typeof TOPUP_PACKS) => {
    try {
      const pack = TOPUP_PACKS[packSlug];
      const response = await billingApi.checkoutTopup({ amountCents: pack.price_cents });
      if (!response.url) throw new Error('The payment provider did not return a checkout URL.');
      track('topup_purchased', { pack: packSlug });
      window.location.href = response.url;
    } catch (error: any) {
      toast.error(error?.message || 'Top-up checkout is unavailable.');
    }
  };

  const handleCancel = async () => {
    try {
      await billingApi.cancel();
      setCancelOpen(false);
      await refresh();
      track('subscription_cancelled');
      toast.success('Your subscription will stop renewing at the end of the current period.');
    } catch (error: any) {
      toast.error(error?.message || 'Cancellation could not be completed.');
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <header>
        <p className="eyebrow text-[var(--color-accent-primary)]">Plan and usage</p>
        <h1 className="font-display mt-2 text-4xl text-[var(--color-text-strong)]">Billing</h1>
        <p className="mt-2 text-sm text-[var(--color-text-subtle)]">Manage your real provider subscription, invoices, and one-time credit packs.</p>
      </header>

      {isPastDue && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-status-danger)]/30 bg-[var(--color-status-danger)]/10 p-4 text-[var(--color-status-danger)]" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-xs font-semibold">Your payment is past due. Open the billing provider to update your payment method.</p>
        </div>
      )}
      {inCancelGrace && (
        <div className="rounded-xl border border-[var(--color-status-warning)]/30 bg-[var(--color-status-warning)]/10 p-4 text-xs leading-5 text-[var(--color-status-warning)]">
          This plan is set to stop renewing. Reactivation is not supported in this workspace; use the provider portal or {BRAND.support.contactLabel.toLowerCase()}.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-[var(--color-text-subtle)]">Current subscription</p>
              <h2 className="mt-2 text-xl font-extrabold text-[var(--color-text-strong)]">{plan?.name || 'Starter'}</h2>
              <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                {subscription ? `Billed ${subscription.interval} · Current period ends ${formatDate(subscription.current_period_end)}` : 'No paid subscription is active.'}
              </p>
            </div>
            <Badge tone={subscription?.status === 'active' ? 'success' : subscription?.status === 'past_due' ? 'warning' : 'default'}>
              {subscription?.status || 'Free'}
            </Badge>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => setTopupOpen(true)} size="sm"><Plus className="h-4 w-4" /> Buy credits</Button>
            {subscription && <Button onClick={openProvider} variant="secondary" size="sm">Provider portal <ExternalLink className="h-4 w-4" /></Button>}
            {subscription && !subscription.cancel_at_period_end && (
              <Button onClick={() => setCancelOpen(true)} variant="danger" size="sm">Cancel renewal</Button>
            )}
          </div>
        </section>

        <section className="bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6">
          <p className="eyebrow text-[var(--color-text-subtle)]">Credit balance</p>
          <p className="mt-3 text-4xl font-extrabold text-[var(--color-text-strong)]">{credits}</p>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-subtle)]">Available for full campaign generation and supported section regeneration.</p>
        </section>
      </div>

      <section className="bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-[var(--color-text-strong)]">Invoices</h2>
        <p className="mt-1 text-xs text-[var(--color-text-subtle)]">Invoice PDF downloads and refund submission are not exposed by the current service.</p>
        <div className="mt-5">
          {loadingInvoices ? (
            <p className="text-xs text-[var(--color-text-subtle)]" aria-live="polite">Loading invoices…</p>
          ) : invoices.length === 0 ? (
            <p className="rounded-xl bg-[var(--color-surface-sunken)] p-4 text-xs text-[var(--color-text-subtle)]">No invoices are available for this account.</p>
          ) : (
            <DataTable
              columns={[
                { key: 'number', label: 'Invoice' },
                { key: 'created_at', label: 'Date', render: (row: any) => formatDate(row.created_at) },
                { key: 'total_cents', label: 'Amount', render: (row: any) => formatCents(row.total_cents) },
                { key: 'status', label: 'Status', render: (row: any) => <Badge tone={row.status === 'paid' ? 'success' : 'warning'}>{row.status}</Badge> },
              ]}
              rows={invoices.map((invoice: any) => ({ ...invoice, id: String(invoice.id) })) as any}
            />
          )}
        </div>
      </section>

      <section className="bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-[var(--color-text-strong)]">Billing details and support</h2>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-[var(--color-text-subtle)]">
          Billing-detail changes, credit-ledger history, refund requests, and subscription reactivation are not available through the current Briefloom API. {BRAND.support.availability}
        </p>
      </section>

      <Modal open={topupOpen} onClose={() => setTopupOpen(false)} title="Purchase credits" size="sm">
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.entries(TOPUP_PACKS) as Array<[keyof typeof TOPUP_PACKS, (typeof TOPUP_PACKS)[keyof typeof TOPUP_PACKS]]>).map(([slug, pack]) => (
            <button
              key={slug}
              type="button"
              onClick={() => handleTopup(slug)}
              className="min-h-32 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-5 text-left transition hover:border-[var(--color-accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-xs font-bold capitalize text-[var(--color-text-strong)]">{slug} pack</span>
              <span className="mt-2 block text-2xl font-extrabold text-[var(--color-text-strong)]">{pack.credits} credits</span>
              <span className="mt-1 block text-xs text-[var(--color-text-subtle)]">{formatCents(pack.price_cents)}</span>
            </button>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel subscription renewal?"
        body="Your existing plan benefits remain available through the current billing period. Reactivation is not available in this workspace."
        confirmLabel="Cancel renewal"
      />
    </div>
  );
}

export default Billing;