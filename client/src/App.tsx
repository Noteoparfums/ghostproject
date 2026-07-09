import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/system/ErrorBoundary';
import CookieBanner from './components/system/CookieBanner';
import CookiePreferencesModal from './components/system/CookiePreferencesModal';
import MarketingNav from './components/layout/MarketingNav';
import Footer from './components/layout/Footer';
import AppShell from './components/layout/AppShell';
import Button from './components/ui/Button';

// Lazy load pages for chunk budget optimization
const Landing = lazy(() => import('./pages/marketing/Landing'));
const Pricing = lazy(() => import('./pages/marketing/Pricing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

const Dashboard = lazy(() => import('./pages/app/Dashboard'));
const Projects = lazy(() => import('./pages/app/Projects'));
const Generate = lazy(() => import('./pages/app/Generate'));
const BrandVoices = lazy(() => import('./pages/app/BrandVoices'));
const Settings = lazy(() => import('./pages/app/Settings'));
const Billing = lazy(() => import('./pages/app/Billing'));
const BillingSuccess = lazy(() => import('./pages/app/BillingSuccess'));

// ─── Loading Fallback Skeletons ──────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span className="text-xs text-zinc-500 font-medium animate-pulse">Loading campaign view...</span>
    </div>
  );
}

function FullPageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <PageSkeleton />
    </div>
  );
}

// Branded Forbidden Page (403)
function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-3xl font-extrabold text-red-500">403</h2>
      <h3 className="text-base font-bold text-zinc-200 mt-2">Access Denied</h3>
      <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
        You do not have administrative permissions to view this secure panel.
      </p>
      <Link to="/app" className="mt-4">
        <Button variant="secondary" size="sm">Go to Dashboard</Button>
      </Link>
    </div>
  );
}

// ─── Layout wrappers ─────────────────────────────────────────────────────────

function MarketingLayout() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-zinc-950 bg-white">
      <MarketingNav />
      <main className="flex-grow">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  const { status } = useAuth();
  if (status === 'authed') return <Navigate to="/app" replace />;

  return (
    <div className="min-h-screen dark:bg-zinc-950 bg-white flex flex-col justify-center">
      <Suspense fallback={<FullPageSkeleton />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

// Auth Router Guard
function RequireAuth({ role, children }: { role?: 'admin'; children: ReactNode }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <FullPageSkeleton />;
  }

  if (status === 'guest') {
    return (
      <Navigate 
        to={`/login?return=${encodeURIComponent(location.pathname + location.search)}`} 
        replace 
      />
    );
  }

  if (role === 'admin' && user?.role !== 'admin') {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}

// Mock pages for general navigation routes
function MockMarketingPage({ title }: { title: string }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center select-none">
      <h1 className="text-3xl font-extrabold dark:text-zinc-50 text-zinc-900">{title}</h1>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-4 leading-relaxed">
        This is a mock page representing the marketing portal segment. Full content will be populated in production.
      </p>
    </div>
  );
}

// ─── Routing Router definition ───────────────────────────────────────────────

const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/about', element: <MockMarketingPage title="About Us" /> },
      { path: '/blog', element: <MockMarketingPage title="Marketing Blog" /> },
      { path: '/changelog', element: <MockMarketingPage title="Product Changelog" /> },
      { path: '/legal/privacy', element: <MockMarketingPage title="Privacy Policy" /> },
      { path: '/legal/terms', element: <MockMarketingPage title="Terms of Service" /> },
      { path: '/legal/refund', element: <MockMarketingPage title="Refund Policy" /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
      { path: '/verify-email', element: <VerifyEmail /> },
    ],
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: '/app', element: <Dashboard /> },
      { path: '/app/projects', element: <Projects /> },
      { path: '/app/generate', element: <Generate /> },
      { path: '/app/brand-voice', element: <BrandVoices /> },
      { path: '/app/settings', element: <Settings /> },
      { path: '/app/billing', element: <Billing /> },
      { path: '/app/billing/success', element: <BillingSuccess /> },
      { 
        path: '/app/billing/cancelled', 
        element: <Navigate to="/app/billing?cancelled=true" replace /> 
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-zinc-950 text-zinc-100">
        <h1 className="text-4xl font-extrabold text-zinc-400">404</h1>
        <h2 className="text-base font-bold mt-2">Page Not Found</h2>
        <a href="/" className="mt-4 text-xs font-semibold text-blue-400 hover:underline">
          Return to Homepage
        </a>
      </div>
    ),
  },
]);

export function App() {
  return (
    <ErrorBoundary key={window.location.pathname}>
      <RouterProvider router={router} />
      
      {/* Cookies Consent widgets */}
      <CookieBanner />
      <CookiePreferencesModal />
    </ErrorBoundary>
  );
}
export default App;
