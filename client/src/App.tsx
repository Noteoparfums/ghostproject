import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/system/ErrorBoundary';
import CookieBanner from './components/system/CookieBanner';
import CookiePreferencesModal from './components/system/CookiePreferencesModal';
import MarketingNav from './components/layout/MarketingNav';
import Footer from './components/layout/Footer';
import AppShell from './components/layout/AppShell';
import { BRAND } from './config/brand';

// Lazy load pages for chunk budget optimization
const Landing = lazy(() => import('./pages/marketing/LandingRedesign'));
const Pricing = lazy(() => import('./pages/marketing/Pricing'));
const About = lazy(() => import('./pages/marketing/About'));
const Blog = lazy(() => import('./pages/marketing/Blog'));
const Changelog = lazy(() => import('./pages/marketing/Changelog'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const Refund = lazy(() => import('./pages/legal/Refund'));
const StatusPage = lazy(() => import('./pages/marketing/StatusPage'));
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
  return <StatusPage code="403" {...BRAND.statusPages.forbidden} />;
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

// ─── Routing Router definition ───────────────────────────────────────────────

const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/changelog', element: <Changelog /> },
      { path: '/legal/privacy', element: <Privacy /> },
      { path: '/legal/terms', element: <Terms /> },
      { path: '/legal/refund', element: <Refund /> },
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
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/404', element: <StatusPage code="404" {...BRAND.statusPages.notFound} /> },
  {
    path: '*',
    element: <StatusPage code="404" {...BRAND.statusPages.notFound} />,
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
