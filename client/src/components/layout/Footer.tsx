import { Link } from 'react-router-dom';
import { useConsent } from '../../contexts/ConsentContext';
import BrandLockup from '../brand/BrandLockup';
import { BRAND } from '../../config/brand';

export function Footer() {
  const { openPreferences } = useConsent();

  return (
    <footer className="shrink-0 select-none border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <BrandLockup className="text-[var(--color-text-strong)]" />
          <p className="max-w-[220px] text-xs leading-relaxed text-[var(--color-text-muted)]">
            {BRAND.positioning}
          </p>
        </div>

        {/* Product links */}
        <div className="flex flex-col gap-2">
          <h5 className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider mb-1">
            Product
          </h5>
          <Link to="/" className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors">Features</Link>
          <Link to="/pricing" className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors">Pricing</Link>
          <Link to="/changelog" className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors">Changelog</Link>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-2">
          <h5 className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider mb-1">
            Resources
          </h5>
          <Link to="/about" className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors">About Us</Link>
          <Link to="/blog" className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors">Blog</Link>
          <button
            onClick={openPreferences}
            className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors text-left"
          >
            Cookie Preferences
          </button>
        </div>

        {/* Legal links */}
        <div className="flex flex-col gap-2">
          <h5 className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider mb-1">
            Legal
          </h5>
          {BRAND.navigation.legal.map((link) => (
            <Link key={link.to} to={link.to} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] text-xs font-medium transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex justify-between items-center text-[11px] text-[var(--color-text-muted)]">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
      </div>
    </footer>
  );
}
export default Footer;
