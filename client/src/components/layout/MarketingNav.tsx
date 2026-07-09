import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/cn';
import BrandLockup from '../brand/BrandLockup';
import { BRAND } from '../../config/brand';

export function MarketingNav() {
  const { status } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ddd3c5]/80 bg-[#fffdf8]/85 backdrop-blur-xl dark:border-[#374a42] dark:bg-[#17211d]/85">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all select-none">
          <BrandLockup className="text-zinc-900 dark:text-zinc-50" />
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 select-none">
          {BRAND.navigation.marketing.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                  isActive 
                    ? 'text-[#b9573b] dark:text-[#e58b70]'
                    : 'text-[#657169] dark:text-[#aeb8b2]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4 shrink-0 select-none">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-[#d7ccbd] p-2 text-[#657169] transition-colors hover:bg-[#eee8de] dark:border-[#40564c] dark:text-[#b7c0ba] dark:hover:bg-[#263730]"
            title={`Theme: ${theme}. Activate to change.`}
            aria-label={`Theme preference: ${theme}`}
          >
            {theme === 'system' ? <Monitor className="w-4 h-4" /> : resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {status === 'loading' ? (
            <div className="w-20 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ) : status === 'authed' ? (
            <Link to="/app">
              <Button size="sm" variant="primary">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hidden sm:block">
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
      </div>
    </header>
  );
}
export default MarketingNav;
