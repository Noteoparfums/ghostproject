import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useBilling } from '../../contexts/BillingContext';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { billingApi } from '../../api/endpoints/billing';
import { billingDetailsSchema, TOPUP_PACKS, formatCents } from '@ghostwriter/shared';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../lib/date';
import { Plus, AlertCircle } from 'lucide-react';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';

export function Billing() {
  useDocumentMeta({
    title: 'Billing Center — Ghostwriter OS',
  });

  const { plan, subscription, refresh, isPastDue, inCancelGrace } = useBilling();
  const toast = useToast();

  const [topupOpen, setTopupOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundInvoiceId, setRefundInvoiceId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  // Load Invoices
  const { data: invoicesData, loading: loadingInvoices, refetch: refetchInvoices } = useApi(
    () => billingApi.invoices()
  );
  const invoices = invoicesData || [];

  // Mock Ledger Entries (credits log)
  const ledger = [
    { id: '1', delta: '+50.00', balance_after: '50.00', source: 'plan_grant', created_at: new Date().toISOString() },
    { id: '2', delta: '-1.00', balance_after: '49.00', source: 'generation', created_at: new Date().toISOString() },
  ];

  // Address Details Form
  const detailsForm = useForm({
    schema: billingDetailsSchema,
    initial: {
      company: '',
      billing_email: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: 'DE',
      vat_id: '',
    },
    onSubmit: async (values) => {
      try {
        await billingApi.updateDetails(values);
        toast.success('Billing details updated successfully.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to update billing details.');
      }
    },
  });

  // Handle billing topups
  const handleTopup = async (packSlug: 'small' | 'large') => {
    try {
      toast.info('Initializing checkout session...');
      const pack = TOPUP_PACKS[packSlug];
      const response = await billingApi.checkoutTopup({
        amountCents: pack.price_cents,
      });

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        // Complete mock checkout
        await billingApi.completeMockCheckout({
          type: 'topup',
          amountCents: pack.price_cents,
        });
        toast.success(`Mock top-up added: ${pack.credits} credits!`);
        setTopupOpen(false);
        refresh();
        track('topup_purchased', { pack: packSlug });
      }
    } catch (err: any) {
      toast.error(`Checkout failed: ${err.message}`);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      await billingApi.cancel();
      toast.success('Your subscription cancellation is processed.');
      setCancelOpen(false);
      refresh();
      track('subscription_cancelled');
    } catch (err: any) {
      toast.error(`Cancellation failed: ${err.message}`);
    }
  };

  // Handle invoice refund requests
  const handleRefundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundInvoiceId) return;
    setRefunding(true);
    try {
      // Mock refund request
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Refund requested successfully. We will notify you in 24 hours.');
      setRefundInvoiceId(null);
      setRefundReason('');
      refetchInvoices();
      track('refund_requested');
    } catch (err: any) {
      toast.error(`Refund request failed: ${err.message}`);
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 select-none min-w-0">
      {/* Notifications Banners */}
      {isPastDue && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-semibold">Your payment has failed. Update your card details to prevent interruption.</p>
        </div>
      )}

      {inCancelGrace && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold">Your plan is set to cancel at the end of the billing period. Keep your plan active?</p>
          </div>
          <Button onClick={async () => {
            await billingApi.completeMockCheckout({ type: 'subscription', planSlug: subscription?.plan_slug || 'pro', interval: subscription?.interval || 'monthly' });
            toast.success('Subscription reactivated!');
            refresh();
          }} variant="primary" size="sm">
            Reactivate Plan
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="flex flex-col gap-8 min-w-0">
          {/* Plan Card */}
          <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Current subscription
                </span>
                <h3 className="font-extrabold text-lg dark:text-zinc-200 text-zinc-800 mt-1">
                  {plan?.name || 'Starter Plan (Free)'}
                </h3>
                {subscription && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Billed {subscription.interval} — next cycle: {formatDate(subscription.current_period_end)}
                  </p>
                )}
              </div>
              <Badge tone={subscription?.status === 'active' ? 'success' : 'default'}>
                {subscription?.status || 'Free'}
              </Badge>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setTopupOpen(true)} variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Buy credits
              </Button>
              {subscription && subscription.status !== 'cancelled' && (
                <Button onClick={() => setCancelOpen(true)} variant="danger" size="sm">
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>

          {/* Invoices logs */}
          <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-4">
            <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
              Receipt History
            </h3>
            {loadingInvoices ? (
              <p className="text-xs text-zinc-500">Loading invoices...</p>
            ) : !invoices || invoices.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No invoices found.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'number', label: 'Invoice No.' },
                  { key: 'created_at', label: 'Billing Date', render: (row: any) => formatDate(row.created_at) },
                  { key: 'total_cents', label: 'Amount Paid', render: (row: any) => formatCents(row.total_cents) },
                  { key: 'status', label: 'Status', render: (row: any) => <Badge tone={row.status === 'paid' ? 'success' : 'warning'}>{row.status}</Badge> },
                  { 
                    key: 'actions', 
                    label: 'Actions', 
                    render: (row: any) => {
                      const isEligible = row.status === 'paid';
                      return (
                        <div className="flex gap-2">
                          <a 
                            href={`/api/billing/invoices/${row.id}/pdf`} 
                            download 
                            className="text-xs font-semibold text-blue-600 hover:text-blue-500"
                          >
                            PDF Download
                          </a>
                          {isEligible && (
                            <button
                              type="button"
                              onClick={() => setRefundInvoiceId(String(row.id))}
                              className="text-xs font-semibold text-red-500 hover:text-red-600"
                            >
                              Request Refund
                            </button>
                          )}
                        </div>
                      );
                    }
                  },
                ]}
                rows={invoices.map(i => ({ ...i, id: String(i.id) })) as any}
              />
            )}
          </div>

          {/* Ledger logs */}
          <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-4">
            <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
              Credits Activity Log
            </h3>
            <DataTable
              columns={[
                { key: 'delta', label: 'Delta', render: (row: any) => <span className={cn('font-bold', row.delta.startsWith('+') ? 'text-emerald-500' : 'text-zinc-500')}>{row.delta}</span> },
                { key: 'balance_after', label: 'Balance After', render: (row: any) => <span className="font-mono text-xs">{row.balance_after} cr</span> },
                { key: 'source', label: 'Source', render: (row: any) => <Badge tone="default">{row.source.replace('_', ' ')}</Badge> },
                { key: 'created_at', label: 'Date', render: (row: any) => formatDate(row.created_at) },
              ]}
              rows={ledger}
            />
          </div>
        </div>

        {/* Address details form */}
        <form onSubmit={detailsForm.handleSubmit} className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
            Billing Details
          </h3>

          <Field label="Company Name" id="company">
            <Input
              id="company"
              value={detailsForm.values.company}
              onChange={(e) => detailsForm.setValue('company', e.target.value)}
            />
          </Field>

          <Field label="Billing Email" id="billing_email" error={detailsForm.touched.billing_email ? detailsForm.errors.billing_email : undefined}>
            <Input
              id="billing_email"
              type="email"
              value={detailsForm.values.billing_email}
              onChange={(e) => detailsForm.setValue('billing_email', e.target.value)}
              onBlur={() => detailsForm.handleBlur('billing_email')}
            />
          </Field>

          <Field label="Address Line 1" id="address_line1">
            <Input
              id="address_line1"
              value={detailsForm.values.address_line1}
              onChange={(e) => detailsForm.setValue('address_line1', e.target.value)}
            />
          </Field>

          <Field label="Country Code" id="country" error={detailsForm.touched.country ? detailsForm.errors.country : undefined}>
            <Select
              id="country"
              value={detailsForm.values.country}
              onChange={(e) => detailsForm.setValue('country', e.target.value)}
            >
              <option value="DE">Germany (DE)</option>
              <option value="FR">France (FR)</option>
              <option value="IT">Italy (IT)</option>
              <option value="US">United States (US)</option>
            </Select>
          </Field>

          <Field label="EU VAT ID" id="vat_id" error={detailsForm.touched.vat_id ? detailsForm.errors.vat_id : undefined} hint="reverse-charge applies with valid EU VAT ID">
            <Input
              id="vat_id"
              value={detailsForm.values.vat_id || ''}
              onChange={(e) => detailsForm.setValue('vat_id', e.target.value)}
              onBlur={() => detailsForm.handleBlur('vat_id')}
            />
          </Field>

          <Button type="submit" variant="primary" size="sm" className="w-full mt-2" loading={detailsForm.submitting}>
            Save Details
          </Button>
        </form>
      </div>

      {/* Topup modal */}
      <Modal open={topupOpen} onClose={() => setTopupOpen(false)} title="Purchase Credit Packs" size="sm">
        <div className="flex flex-col gap-4">
          <p className="text-xs dark:text-zinc-400 text-zinc-500">
            Select one-time top-up packs. Credits never expire and are added instantly.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleTopup('small')}
              className="p-5 border dark:border-zinc-900 border-zinc-200 rounded-2xl text-left bg-zinc-50/50 dark:bg-zinc-900/10 hover:border-blue-500 transition-all flex flex-col gap-2"
            >
              <h4 className="font-bold text-sm text-zinc-100">Small Pack</h4>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">25 credits</span>
              <span className="text-xs text-zinc-400">$15.00</span>
            </button>
            
            <button
              onClick={() => handleTopup('large')}
              className="p-5 border border-blue-600/50 dark:border-blue-500/30 rounded-2xl text-left bg-blue-600/5 hover:border-blue-500 transition-all flex flex-col gap-2 relative"
            >
              <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded">Best value</span>
              <h4 className="font-bold text-sm text-zinc-100">Large Pack</h4>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">100 credits</span>
              <span className="text-xs text-zinc-400">$49.00</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel confirm */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription?"
        body="This will stop your subscription renewal. You will retain all plan benefits (monthly grant) until the end of the current billing cycle."
        confirmLabel="Cancel Subscription"
      />

      {/* Refund request modal */}
      <Modal open={!!refundInvoiceId} onClose={() => setRefundInvoiceId(null)} title="Request Invoice Refund" size="sm">
        <form onSubmit={handleRefundRequest} className="flex flex-col gap-4">
          <Field label="Reason for Refund" id="reason">
            <Input
              id="reason"
              multiline
              rows={4}
              required
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Why are you requesting a refund?"
            />
          </Field>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setRefundInvoiceId(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" loading={refunding}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
export default Billing;
