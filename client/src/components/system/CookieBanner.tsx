import { useConsent } from '../../contexts/ConsentContext';
import Button from '../ui/Button';

export function CookieBanner() {
  const { status, acceptAll, rejectNonEssential, openPreferences } = useConsent();

  if (status !== 'unset') return null;

  return (
    <div 
      className="fixed bottom-6 left-6 right-6 z-40 mx-auto flex max-w-4xl animate-slide-up flex-col items-center justify-between gap-4 rounded-2xl border border-[#d8cfc1] bg-[#fffdf8]/95 p-5 shadow-[0_24px_70px_rgba(46,37,28,0.18)] backdrop-blur-xl transition-all duration-300 dark:border-[#40564c] dark:bg-[#1e2c27]/95 md:flex-row"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold dark:text-zinc-100 text-zinc-800">
          Your privacy, your choice
        </h4>
        <p className="mt-1 text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed">
          We use optional analytics cookies to understand how Briefloom performs. Choose all cookies, essential only, or customize your preferences.
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
