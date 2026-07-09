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
import { Sparkles, Mail, Lock } from 'lucide-react';

export function Login() {
  useDocumentMeta({
    title: 'Sign in',
    description: 'Sign in to your Briefloom account.',
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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Logo banner */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-zinc-50">
            Welcome back
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to resume copywriting campaigns
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-xl flex flex-col gap-6">
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
                <span className="absolute left-3.5 top-3 text-zinc-500">
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
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
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
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500">
          New to Ghostwriter?{' '}
          <Link 
            to="/signup" 
            className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
