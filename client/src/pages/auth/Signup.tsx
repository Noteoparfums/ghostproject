import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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
import { Sparkles, User, Mail, Lock } from 'lucide-react';
import { cn } from '../../lib/cn';

export function Signup() {
  useDocumentMeta({
    title: 'Create account',
    description: 'Create a free Briefloom account and build your first campaign.',
  });

  const { login } = useAuth(); // Log in user automatically on signup
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
        const response = await authApi.signup(signupData);
        
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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-zinc-50">
            Create your account
          </h1>
          <p className="text-xs text-zinc-500">
            Start writing direct-response copy funnels
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-xl flex flex-col gap-6">
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
            <Field 
              label="Full Name" 
              id="name" 
              error={form.touched.name ? form.errors.name : undefined}
            >
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-zinc-500">
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
              hint="Minimum 8 characters with upper, lower, number, and symbol."
            >
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-zinc-500">
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

            <div className="flex flex-col gap-2 mt-2">
              <Toggle
                label="I agree to the Terms of Service"
                checked={form.values.tos}
                onChange={(checked) => form.setValue('tos', checked)}
              />
              {form.touched.tos && form.errors.tos && (
                <p className="text-[11px] text-red-500 font-medium">{form.errors.tos}</p>
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
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Signup;
