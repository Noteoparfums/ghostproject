import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { resetPasswordSchema } from '@ghostwriter/shared';
import { evaluatePasswordStrength } from '../../lib/passwordStrength';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import { Lock, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/cn';

export function ResetPassword() {
  useDocumentMeta({
    title: 'Reset password',
    description: 'Set a new password for your account.',
  });

  const { token = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '', isBlocked: false });

  const handlePasswordChange = (val: string) => {
    form.setValue('password', val);
    const strength = evaluatePasswordStrength(val);
    setPasswordStrength(strength);
  };

  const form = useForm({
    schema: resetPasswordSchema,
    initial: {
      token,
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const { authApi } = await import('../../api/endpoints/auth');
        await authApi.resetPassword(values);
        toast.success('Password updated successfully. Please log in.');
        navigate('/login', { replace: true });
      } catch (err: any) {
        toast.error(err.message || 'Failed to reset password.', {
          requestId: err.requestId,
        });
      }
    },
  });

  const footer = (
    <Link to="/login" className="flex items-center justify-center gap-2 font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)]">
      <ArrowLeft className="w-4 h-4" />
      Back to Sign In
    </Link>
  );

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Define a secure password to finalize recovery"
      footer={footer}
    >
      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <Field
          label="New Password"
          id="password"
          error={form.touched.password ? form.errors.password : undefined}
        >
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[var(--color-text-muted)] pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <Input
              id="password"
              name="password"
              type="password"
              className="pl-10"
              value={form.values.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => form.handleBlur('password')}
            />
          </div>

          {form.values.password && (
            <div className="mt-2.5 flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-[var(--color-text-muted)]">Password Strength</span>
                <span
                  className={cn(
                    passwordStrength.score <= 1 && 'text-[var(--color-status-danger)]',
                    passwordStrength.score === 2 && 'text-[var(--color-status-warning)]',
                    passwordStrength.score === 3 && 'text-[var(--color-accent-primary)]',
                    passwordStrength.score === 4 && 'text-[var(--color-status-success)]'
                  )}
                >
                  {passwordStrength.feedback}
                </span>
              </div>
              <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-[var(--color-surface-sunken)] mt-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 h-full rounded-full transition-all duration-300',
                      i < passwordStrength.score
                        ? passwordStrength.score <= 1
                          ? 'bg-[var(--color-status-danger)]'
                          : passwordStrength.score === 2
                            ? 'bg-[var(--color-status-warning)]'
                            : passwordStrength.score === 3
                              ? 'bg-[var(--color-accent-primary)]'
                              : 'bg-[var(--color-status-success)]'
                        : 'bg-black/5 dark:bg-white/5'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </Field>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={form.submitting}
          disabled={passwordStrength.isBlocked}
        >
          Update Password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
