import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { signupSchema } from '@ghostwriter/shared';
import { evaluatePasswordStrength } from '../../lib/passwordStrength';
import { readFirstTouchUtm, track } from '../../lib/analytics';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import AuthLayout from '../../components/layout/AuthLayout';
import { User, Mail, Lock } from 'lucide-react';
import { cn } from '../../lib/cn';
import { BRAND } from '../../config/brand';

export function Signup() {
  useDocumentMeta({
    title: 'Create account',
    description: `Create a free ${BRAND.name} account and build your first campaign.`,
  });

  const { login } = useAuth(); // Log in user automatically on signup
  const toast = useToast();
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '', isBlocked: false });

  // Evaluate password strength live
  const handlePasswordChange = (val: string) => {
    form.setValue('password', val);
    const strength = evaluatePasswordStrength(val);
    setPasswordStrength(strength);
  };

  const form = useForm({
    schema: signupSchema,
    initial: {
      name: '',
      email: '',
      password: '',
      marketing_opt_in: false,
      tos: false as any, // literal true in schema
      utm: undefined,
    },
    onSubmit: async (values) => {
      // First-touch UTM injection
      const utm = readFirstTouchUtm();
      const signupData = {
        ...values,
        utm: utm || undefined,
      };

      try {
        track('signup_started');
        // Call authApi.signup directly
        const { authApi } = await import('../../api/endpoints/auth');
        await authApi.signup(signupData);

        // Write access token and user info to AuthContext
        await login(values.email, values.password, false);

        toast.success('Account created successfully!');
        track('signup_completed', { utm });
        navigate('/app', { replace: true });
      } catch (err: any) {
        toast.error(err.message || 'Registration failed. Please check your inputs.', {
          requestId: err.requestId,
        });
      }
    },
  });

  const footer = (
    <>
      Already have an account?{' '}
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
      title="Create your account"
      subtitle="Start writing direct-response copy funnels"
      footer={footer}
    >
      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Full Name"
          id="name"
          error={form.touched.name ? form.errors.name : undefined}
        >
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[var(--color-text-muted)] pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="pl-10"
              value={form.values.name}
              onChange={(e) => form.setValue('name', e.target.value)}
              onBlur={() => form.handleBlur('name')}
            />
          </div>
        </Field>

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
              autoComplete="email"
              className="pl-10"
              value={form.values.email}
              onChange={(e) => form.setValue('email', e.target.value)}
              onBlur={() => form.handleBlur('email')}
            />
          </div>
        </Field>

        <Field
          label="Password"
          id="password"
          error={form.touched.password ? form.errors.password : undefined}
          hint="Minimum 8 characters with upper, lower, number, and symbol."
        >
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[var(--color-text-muted)] pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="pl-10"
              value={form.values.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => form.handleBlur('password')}
            />
          </div>

          {/* Password strength meter bar */}
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

        <div className="flex flex-col gap-3 mt-2">
          <Toggle
            label="I agree to the Terms of Service"
            checked={form.values.tos}
            onChange={(checked) => form.setValue('tos', checked)}
          />
          {form.touched.tos && form.errors.tos && (
            <p className="text-[11px] text-[var(--color-status-danger)] font-medium -mt-1">{form.errors.tos}</p>
          )}

          <Toggle
            label="Sign up for copywriting tips newsletter"
            checked={form.values.marketing_opt_in}
            onChange={(checked) => form.setValue('marketing_opt_in', checked)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          loading={form.submitting}
          disabled={passwordStrength.isBlocked}
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
