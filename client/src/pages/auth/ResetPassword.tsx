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
import { Sparkles, Lock, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/cn';

export function ResetPassword() {
  useDocumentMeta({
    title: 'Reset Password — Ghostwriter OS',
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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-zinc-50">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Define a secure password to finalize recovery
          </p>
        </div>

        <div className="p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-xl flex flex-col gap-6">
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
            <Field 
              label="New Password" 
              id="password" 
              error={form.touched.password ? form.errors.password : undefined}
            >
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-zinc-500">
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
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="dark:text-zinc-500 text-zinc-400">Password Strength</span>
                    <span 
                      className={cn(
                        passwordStrength.score <= 1 && 'text-red-500',
                        passwordStrength.score === 2 && 'text-amber-500',
                        passwordStrength.score === 3 && 'text-blue-500',
                        passwordStrength.score === 4 && 'text-emerald-500'
                      )}
                    >
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 mt-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex-1 h-full rounded-full transition-all duration-300',
                          i < passwordStrength.score 
                            ? passwordStrength.score <= 1 
                              ? 'bg-red-500' 
                              : passwordStrength.score === 2 
                                ? 'bg-amber-500' 
                                : passwordStrength.score === 3
                                  ? 'bg-blue-500'
                                  : 'bg-emerald-500'
                            : 'bg-zinc-200 dark:bg-zinc-800'
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
        </div>

        <p className="text-center text-xs text-zinc-500">
          <Link to="/login" className="flex items-center justify-center gap-2 font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
export default ResetPassword;
