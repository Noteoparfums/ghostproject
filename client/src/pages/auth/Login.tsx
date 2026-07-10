import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { loginSchema } from '@ghostwriter/shared';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import AuthLayout from '../../components/layout/AuthLayout';
import { BRAND } from '../../config/brand';
import { Mail, Lock } from 'lucide-react';

export function Login() {
  useDocumentMeta({
    title: 'Sign in',
    description: `Sign in to your ${BRAND.name} account.`,
  });

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Validate redirect path is same-origin (starts with / and not absolute)
  const getRedirectPath = () => {
    const returnUrl = searchParams.get('return');
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return '/app';
  };

  const form = useForm({
    schema: loginSchema,
    initial: {
      email: '',
      password: '',
      remember: false,
    },
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password, values.remember);
        toast.success('Signed in successfully.');
        navigate(getRedirectPath(), { replace: true });
      } catch (err: any) {
        toast.error(err.message || 'Invalid credentials. Please try again.', {
          requestId: err.requestId,
        });
      }
    },
  });

  const footer = (
    <>
      New to {BRAND.name}?{' '}
      <Link
        to="/signup"
        className="font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)]"
      >
        Create an account
      </Link>
    </>
  );

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to resume your campaigns"
      footer={footer}
    >
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
        >
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[var(--color-text-muted)] pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="pl-10"
              value={form.values.password}
              onChange={(e) => form.setValue('password', e.target.value)}
              onBlur={() => form.handleBlur('password')}
            />
          </div>
        </Field>

        <div className="flex items-center justify-between gap-4 mt-2">
          <Toggle
            label="Remember me"
            checked={form.values.remember}
            onChange={(checked) => form.setValue('remember', checked)}
          />
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)]"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          loading={form.submitting}
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;
