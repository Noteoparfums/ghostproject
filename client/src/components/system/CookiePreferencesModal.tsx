import { useState, useEffect } from 'react';
import { useConsent } from '../../contexts/ConsentContext';
import Modal from '../ui/Modal';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';

export function CookiePreferencesModal() {
  const { isPreferencesOpen, closePreferences, categories, savePreferences } = useConsent();

  const [functional, setFunctional] = useState(categories.functional);
  const [analytics, setAnalytics] = useState(categories.analytics);

  useEffect(() => {
    if (isPreferencesOpen) {
      setFunctional(categories.functional);
      setAnalytics(categories.analytics);
    }
  }, [isPreferencesOpen, categories]);

  const handleSave = () => {
    savePreferences({ functional, analytics });
  };

  return (
    <Modal
      open={isPreferencesOpen}
      onClose={closePreferences}
      title="Cookie Preferences"
      size="sm"
    >
      <div className="flex flex-col gap-6">
        <p className="text-xs dark:text-zinc-400 text-zinc-500">
          Customize which types of cookies you allow us to store. Strictly essential cookies are required for user authentication and billing sessions.
        </p>

        <div className="divide-y dark:divide-zinc-900 divide-zinc-100 flex flex-col">
          {/* Essential Category */}
          <div className="flex justify-between items-start py-4 gap-4">
            <div className="flex-1">
              <h5 className="text-sm font-bold dark:text-zinc-200 text-zinc-800">
                Essential Cookies
              </h5>
              <p className="text-[11px] dark:text-zinc-500 text-zinc-400 mt-0.5">
                Required for security, core application features, and keeping you authenticated. Can not be disabled.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 select-none py-1.5">
              Always Active
            </span>
          </div>

          {/* Functional Category */}
          <div className="flex justify-between items-start py-4 gap-4">
            <div className="flex-1">
              <h5 className="text-sm font-bold dark:text-zinc-200 text-zinc-800">
                Functional Cookies
              </h5>
              <p className="text-[11px] dark:text-zinc-500 text-zinc-400 mt-0.5">
                Enable storage of personalization settings (like dark mode and layouts).
              </p>
            </div>
            <Toggle checked={functional} onChange={setFunctional} />
          </div>

          {/* Analytics Category */}
          <div className="flex justify-between items-start py-4 gap-4">
            <div className="flex-1">
              <h5 className="text-sm font-bold dark:text-zinc-200 text-zinc-800">
                Analytics Cookies
              </h5>
              <p className="text-[11px] dark:text-zinc-500 text-zinc-400 mt-0.5">
                Track pages visited and conversion channels. Drops all details if disabled.
              </p>
            </div>
            <Toggle checked={analytics} onChange={setAnalytics} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" size="sm" onClick={closePreferences}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default CookiePreferencesModal;
