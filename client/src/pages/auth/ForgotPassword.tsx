import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { forgotPasswordSchema } from '@ghostwriter/shared';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
  useDocumentMeta({
    title: 'Recover password',
    description: 'Request a password reset link.',
  });

  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    schema: forgotPasswordSchema,
    initial: { email: '' },
    onSubmit: async (values) => {
      try {
        const { authApi } = await import('../../api/endpoints/auth');
        await authApi.forgotPassword(values.email);
        setSubmitted(true);
        toast.success('Password reset link sent to your email.');
      } catch (err: any) {
        toast.error(err.message || 'Request failed. Please try again.', {
          requestId: err.requestId,
        });
      }
    },
  });

  const footer = !submitted && (
    <>
      Remembered your password?{' '}
      <Link
        to="/login"
        className="font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)]"
      >
        Sign In
      </Link>
    </>
  );

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Retrieve access to your campaign copy records"
      footer={footer}
    >
      {submitted ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="p-4 bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] font-medium rounded-[var(--radius-lg)] text-sm border border-[var(--color-status-success)]/20">
            ✓ Check your inbox. If the account exists, we have sent a reset link.
          </div>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)] mt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
          <Field
            label="Email Address"
            id="email"
            error={form.touched.email ? form.errors.email : undefined}
          >
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[var(--color-text-muted)] pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                className="pl-10"
                value={form.values.email}
                onChange={(e) => form.setValue('email', e.target.value)}
                onBlur={() => form.handleBlur('email')}
              />
            </div>
          </Field>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={form.submitting}
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
