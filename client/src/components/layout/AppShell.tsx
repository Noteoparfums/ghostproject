import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBilling } from '../../contexts/BillingContext';
import { useTheme } from '../../contexts/ThemeContext';
import ProgressRing from '../ui/ProgressRing';
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Volume2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { cn } from '../../lib/cn';
import BrandLockup from '../brand/BrandLockup';

export function AppShell() {
  const { user, logout } = useAuth();
  const { credits } = useBilling();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system');
  };

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/projects', label: 'Projects', icon: FolderOpen },
    { to: '/app/generate', label: 'Generate Workspace', icon: Sparkles },
    { to: '/app/brand-voice', label: 'Brand Voice', icon: Volume2 },
    { to: '/app/billing', label: 'Billing Center', icon: CreditCard },
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ];

  const parsedCredits = parseFloat(credits) || 0.00;

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] selection:bg-[var(--color-accent-primary)]/30">
      {/* Brand logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--color-border-subtle)] px-6">
        <Link to="/app" className="flex items-center gap-2">
          <BrandLockup className="text-[var(--color-text-strong)]" />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-6">
        <span className="mb-2 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">Workspace</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                  : 'text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="flex shrink-0 flex-col gap-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] p-4">
        {/* Credits usage widget */}
        <div className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-3">
          <ProgressRing value={parsedCredits} max={100} size={44} strokeWidth={4} />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Credits Remaining
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-strong)] mt-0.5 truncate">
              {credits} credits
            </span>
          </div>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-xs font-bold uppercase text-white">
              {user?.name.slice(0, 2) || 'Me'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--color-text-strong)] truncate">
                {user?.name || 'My Account'}
              </span>
              <span className="text-[10px] text-[var(--color-text-subtle)] truncate">
                {user?.email || ''}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger)]/10 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen overflow-hidden bg-[var(--color-canvas)]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="w-64 shrink-0 max-md:hidden h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/90 px-6 backdrop-blur-xl">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-[var(--radius-lg)] text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-sunken)] md:hidden"
            title="Toggle Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="max-md:hidden" />

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full border border-[var(--color-border-subtle)] p-2 text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-strong)]"
              title={`Theme: ${theme}. Activate to change.`}
              aria-label={`Theme preference: ${theme}`}
            >
              {theme === 'system' ? <Monitor className="w-4 h-4" /> : resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="h-4 w-px bg-[var(--color-border-subtle)]" />
            <span className="rounded-full bg-[var(--color-surface-sunken)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
              {user?.role || 'user'}
            </span>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-8 max-sm:p-4 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="mobile-nav">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Drawer sheet container */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-[var(--color-surface-raised)] shadow-[var(--shadow-lg)] z-10">
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-sunken)] z-20"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>

            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppShell;
