import { useConsent } from '../../contexts/ConsentContext';
import Button from '../ui/Button';

export function CookieBanner() {
  const { status, acceptAll, rejectNonEssential, openPreferences } = useConsent();

  if (status !== 'unset') return null;

  return (
    <div 
      className="fixed bottom-6 left-6 right-6 z-40 mx-auto max-w-4xl p-5 rounded-2xl border shadow-2xl backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 animate-slide-up"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold dark:text-zinc-100 text-zinc-800">
          Cookie Consent
        </h4>
        <p className="mt-1 text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed">
          We use cookies to optimize platform performance and analyze traffic to improve our AI copy engine. You can accept all cookies, proceed with only essential cookies, or configure preferences.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 max-sm:w-full max-sm:flex-col">
        <button
          onClick={openPreferences}
          className="text-xs font-semibold dark:text-zinc-400 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-3 py-2"
        >
          Manage Preferences
        </button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={rejectNonEssential}
          className="max-sm:w-full"
        >
          Reject Non-Essential
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={acceptAll}
          className="max-sm:w-full"
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}
export default CookieBanner;
