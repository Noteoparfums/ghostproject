import { Link } from 'react-router-dom';
import { useConsent } from '../../contexts/ConsentContext';
import BrandLockup from '../brand/BrandLockup';
import { BRAND } from '../../config/brand';

export function Footer() {
  const { openPreferences } = useConsent();

  return (
    <footer className="border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50 dark:bg-zinc-950/20 py-12 shrink-0 select-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <BrandLockup className="text-zinc-900 dark:text-zinc-50" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[200px] leading-relaxed">
            {BRAND.positioning}
          </p>
        </div>

        {/* Product links */}
        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
            Product
          </h5>
          <Link to="/" className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">Features</Link>
          <Link to="/pricing" className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">Pricing</Link>
          <Link to="/changelog" className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">Changelog</Link>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
            Resources
          </h5>
          <Link to="/about" className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">About Us</Link>
          <Link to="/blog" className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">Blog</Link>
          <button 
            onClick={openPreferences}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors text-left"
          >
            Cookie Preferences
          </button>
        </div>

        {/* Legal links */}
        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
            Legal
          </h5>
          {BRAND.navigation.legal.map((link) => (
            <Link key={link.to} to={link.to} className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-zinc-200/30 dark:border-zinc-900/30 flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
      </div>
    </footer>
  );
}
export default Footer;
