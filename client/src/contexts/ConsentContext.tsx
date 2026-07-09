import {  createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getAnonymousId, deleteAnonymousId } from '../lib/analytics';

interface ConsentCategories {
  essential: true;
  functional: boolean;
  analytics: boolean;
}

interface ConsentContextType {
  status: 'unset' | 'decided';
  categories: ConsentCategories;
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (p: { functional: boolean; analytics: boolean }) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const defaultCategories: ConsentCategories = {
  essential: true,
  functional: false,
  analytics: false,
};

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'unset' | 'decided'>('unset');
  const [categories, setCategories] = useState<ConsentCategories>(defaultCategories);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gw_consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.status === 'decided') {
          setStatus('decided');
          setCategories(parsed.categories);
          
          if (parsed.categories.analytics) {
            getAnonymousId(); // Generate if needed
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse gw_consent from localStorage', e);
    }
  }, []);

  const save = (newCategories: ConsentCategories) => {
    setStatus('decided');
    setCategories(newCategories);
    
    // Save to localStorage
    const consentPayload = { status: 'decided', categories: newCategories };
    localStorage.setItem('gw_consent', JSON.stringify(consentPayload));

    // Save to server-readable cookie
    document.cookie = `gw_consent=${JSON.stringify(newCategories)};path=/;max-age=31536000;SameSite=Lax;Secure`;

    if (newCategories.analytics) {
      getAnonymousId(); // Initialize anon id
    } else {
      deleteAnonymousId(); // Remove anon id
    }
  };

  const acceptAll = () => {
    save({ essential: true, functional: true, analytics: true });
  };

  const rejectNonEssential = () => {
    save({ essential: true, functional: false, analytics: false });
  };

  const savePreferences = (prefs: { functional: boolean; analytics: boolean }) => {
    save({ essential: true, ...prefs });
    setIsPreferencesOpen(false);
  };

  const openPreferences = () => setIsPreferencesOpen(true);
  const closePreferences = () => setIsPreferencesOpen(false);

  return (
    <ConsentContext.Provider
      value={{
        status,
        categories,
        isPreferencesOpen,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
