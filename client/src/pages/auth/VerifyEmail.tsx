import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { track } from '../../lib/analytics';

export function VerifyEmail() {
  useDocumentMeta({
    title: 'Verify email',
    description: 'Verify your email address.',
  });

  const [searchParams] = useSearchParams();
  const toast = useToast();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    token ? 'pending' : 'error'
  );

  const verify = async (t: string) => {
    try {
      const { authApi } = await import('../../api/endpoints/auth');
      await authApi.verifyEmail(t);
      setStatus('success');
      toast.success('Email verified successfully!');
      track('email_verified');
    } catch (e: any) {
      setStatus('error');
      toast.error(e.message || 'Verification failed. The token may be expired.');
    }
  };

  useEffect(() => {
    if (token) {
      verify(token);
    }
  }, [token]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={
        status === 'success' ? 'Your account is now verified' :
        status === 'pending' ? 'Verifying your account' :
        'Verification status'
      }
    >
      <div className="text-center flex flex-col items-center gap-6">
        {status === 'pending' && (
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-[var(--color-accent-primary)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-[var(--color-text-subtle)]">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-[var(--color-status-success)] animate-bounce" />
            <h2 className="text-lg font-bold text-[var(--color-text-strong)]">Email Verified!</h2>
            <p className="text-sm text-[var(--color-text-subtle)]">
              Thank you for verifying your address. You can now use all platform features.
            </p>
            <Link to="/app" className="w-full mt-2">
              <Button variant="primary" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            {token ? (
              <AlertCircle className="w-12 h-12 text-[var(--color-status-danger)]" />
            ) : (
              <Mail className="w-12 h-12 text-[var(--color-text-muted)]" />
            )}
            <h2 className="text-lg font-bold text-[var(--color-text-strong)]">
              {token ? 'Verification Failed' : 'Check Your Inbox'}
            </h2>
            <p className="text-sm text-[var(--color-text-subtle)] leading-relaxed">
              {token
                ? 'The verification token is invalid or has expired. Please request a new verification link.'
                : 'We have sent a verification link to your email. Click the link to verify your account.'}
            </p>
            <Link to="/login" className="w-full mt-2">
              <Button variant="secondary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
