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
    <div className="flex h-full flex-col border-r border-[#ddd3c5] bg-[#fffdf8] selection:bg-[#d8795c] dark:border-[#374a42] dark:bg-[#17211d]">
      {/* Brand logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-[#e4dcd0] px-6 dark:border-[#374a42]">
        <Link to="/app" className="flex items-center gap-2">
          <BrandLockup className="text-zinc-900 dark:text-zinc-50" />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-6">
        <span className="eyebrow mb-2 px-4 text-[#9a8978] dark:text-[#a89a8a]">Workspace</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-[#efe2d9] text-[#a94c34] dark:bg-[#53372f] dark:text-[#ef9a7f]'
                  : 'text-[#627069] hover:bg-[#f2ece3] hover:text-[#263b33] dark:text-[#aeb8b2] dark:hover:bg-[#263730] dark:hover:text-[#f8f3e9]'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="flex shrink-0 flex-col gap-4 border-t border-[#e4dcd0] bg-[#f7f3eb] p-4 dark:border-[#374a42] dark:bg-[#15201b]">
        {/* Credits usage widget */}
        <div className="flex items-center gap-3 rounded-xl border border-[#ded4c6] bg-[#fffdf8] p-3 dark:border-[#374a42] dark:bg-[#1e2c27]">
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
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-[#b9573b] text-xs font-bold uppercase text-white">
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
    <div className="flex min-h-screen overflow-hidden bg-[#f7f3eb] dark:bg-[#17211d]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="w-64 shrink-0 max-md:hidden h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#ddd3c5] bg-[#f7f3eb]/90 px-6 backdrop-blur-xl dark:border-[#374a42] dark:bg-[#17211d]/90">
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
              className="rounded-full border border-[#d7ccbd] p-2 text-[#657169] transition-colors hover:bg-[#eee8de] dark:border-[#40564c] dark:text-[#b7c0ba] dark:hover:bg-[#263730]"
              title={`Theme: ${theme}. Activate to change.`}
              aria-label={`Theme preference: ${theme}`}
            >
              {theme === 'system' ? <Monitor className="w-4 h-4" /> : resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="rounded-full bg-[#e9e2d6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#657169] dark:bg-[#263730] dark:text-[#b7c0ba]">
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
