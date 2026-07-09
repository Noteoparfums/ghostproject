import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { forgotPasswordSchema } from '@ghostwriter/shared';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, Sparkles, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-zinc-50">
            Forgot Password
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Retrieve access to your campaign copy records
          </p>
        </div>

        <div className="p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-xl flex flex-col gap-6">
          {submitted ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="p-3 bg-blue-600/10 text-blue-400 font-semibold rounded-xl text-xs border border-blue-500/20">
                ✓ Check your inbox. If the account exists, we have sent a reset link.
              </div>
              <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-90 mt-2">
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
                  <span className="absolute left-3.5 top-3 text-zinc-500">
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
        </div>

        {!submitted && (
          <p className="text-center text-xs text-zinc-500">
            Remembered your password?{' '}
            <Link 
              to="/login" 
              className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
export default ForgotPassword;
