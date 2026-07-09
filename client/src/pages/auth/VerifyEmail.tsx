import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import { Sparkles, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { track } from '../../lib/analytics';

export function VerifyEmail() {
  useDocumentMeta({
    title: 'Verify email',
    description: 'Verify your email address.',
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-zinc-50">
            Email Verification
          </h1>
        </div>

        <div className="p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-xl flex flex-col gap-6 text-center items-center">
          {status === 'pending' && (
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm dark:text-zinc-300 text-zinc-600">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              <h2 className="text-lg font-bold dark:text-zinc-200 text-zinc-800">Email Verified!</h2>
              <p className="text-xs dark:text-zinc-400 text-zinc-500">
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
                <AlertCircle className="w-12 h-12 text-red-500" />
              ) : (
                <Mail className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
              )}
              <h2 className="text-lg font-bold dark:text-zinc-200 text-zinc-800">
                {token ? 'Verification Failed' : 'Check Your Inbox'}
              </h2>
              <p className="text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed">
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
      </div>
    </div>
  );
}
export default VerifyEmail;
