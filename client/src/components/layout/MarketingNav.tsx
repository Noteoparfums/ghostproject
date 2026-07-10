import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Monitor, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/cn';
import BrandLockup from '../brand/BrandLockup';
import { BRAND } from '../../config/brand';

export function MarketingNav() {
  const { status } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system');
  };

  const closeMobile = () => setMobileOpen(false);

  const ThemeIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all select-none">
          <BrandLockup className="text-[var(--color-text-strong)]" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 select-none">
          {BRAND.navigation.marketing.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-[var(--color-accent-primary)]'
                    : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 shrink-0 select-none">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-[var(--color-border-subtle)] p-2 text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-surface-sunken)]"
            title={`Theme: ${theme}. Activate to change.`}
            aria-label={`Theme preference: ${theme}`}
          >
            <ThemeIcon className="w-4 h-4" />
          </button>

          {/* Auth CTA – desktop */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-20 h-9 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)] animate-pulse" />
            ) : status === 'authed' ? (
              <Link to="/app">
                <Button size="sm" variant="primary">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-[var(--color-text-default)] hover:text-[var(--color-text-strong)] transition-colors">
                  Log In
                </Link>
                <Link to="/signup">
                  <Button size="sm" variant="primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden min-w-11 min-h-11 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-sunken)] transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav"
        className={cn(
          'md:hidden overflow-hidden border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] transition-[max-height,opacity] duration-300 ease-in-out',
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-b-0'
        )}
      >
        <nav className="flex flex-col px-6 py-4 gap-1 select-none">
          {BRAND.navigation.marketing.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                cn(
                  'min-h-11 flex items-center text-sm font-semibold rounded-[var(--radius-md)] px-3 transition-colors',
                  isActive
                    ? 'text-[var(--color-accent-primary)]'
                    : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Mobile theme selector */}
          <button
            onClick={toggleTheme}
            className="min-h-11 flex items-center gap-2 text-sm font-semibold rounded-[var(--radius-md)] px-3 text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] transition-colors"
          >
            <ThemeIcon className="w-4 h-4" />
            <span>Theme: {theme}</span>
          </button>

          {/* Mobile auth CTA */}
          <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-border-subtle)] mt-2">
            {status === 'loading' ? (
              <div className="w-full h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)] animate-pulse" />
            ) : status === 'authed' ? (
              <Link to="/app" onClick={closeMobile}>
                <Button size="sm" variant="primary" className="w-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="min-h-11 flex items-center justify-center text-sm font-semibold text-[var(--color-text-default)] hover:text-[var(--color-text-strong)] transition-colors"
                >
                  Log In
                </Link>
                <Link to="/signup" onClick={closeMobile}>
                  <Button size="sm" variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
export default MarketingNav;
