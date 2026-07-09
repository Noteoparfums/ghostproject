import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
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
  Moon
} from 'lucide-react';
import { cn } from '../../lib/cn';
import BrandLockup from '../brand/BrandLockup';

export function AppShell() {
  const { user, logout } = useAuth();
  const { credits } = useBilling();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-900 select-none">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
        <Link to="/app" className="flex items-center gap-2">
          <BrandLockup className="text-zinc-900 dark:text-zinc-50" />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-zinc-100'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-4 shrink-0 bg-zinc-50/30 dark:bg-zinc-950/40">
        {/* Credits usage widget */}
        <div className="flex items-center gap-3 p-3 rounded-xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/50">
          <ProgressRing value={parsedCredits} max={100} size={44} strokeWidth={4} />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Credits Remaining
            </span>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">
              {credits} credits
            </span>
          </div>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none uppercase">
              {user?.name.slice(0, 2) || 'Me'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {user?.name || 'My Account'}
              </span>
              <span className="text-[10px] text-zinc-500 truncate">
                {user?.email || ''}
              </span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen dark:bg-zinc-950 bg-zinc-50 overflow-hidden">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="w-64 shrink-0 max-md:hidden h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200/50 dark:border-zinc-900 shrink-0 sticky top-0 z-30 select-none">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="max-md:hidden" />

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border dark:border-zinc-800 border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-semibold dark:text-zinc-300 text-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full uppercase tracking-wider">
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
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          {/* Drawer sheet container */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-white dark:bg-zinc-950 shadow-2xl z-10 animate-slide-right">
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
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
