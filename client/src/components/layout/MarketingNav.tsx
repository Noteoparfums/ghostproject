import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/cn';

export function MarketingNav() {
  const { status } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { to: '/', label: 'Features' }, // landing page segments
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/changelog', label: 'Changelog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-zinc-200/50 dark:border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all select-none">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
            Ghostwriter<span className="text-blue-600">OS</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 select-none">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-zinc-600 dark:text-zinc-400'
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
            className="p-2 rounded-xl border dark:border-zinc-800 border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
