import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { api, tokens } from '../api/client';
import { authApi } from '../api/endpoints/auth';
import type { Me } from '../api/endpoints/auth';
import { track } from '../lib/analytics';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: Me | null;
  status: 'loading' | 'authed' | 'guest';
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [status, setStatus] = useState<'loading' | 'authed' | 'guest'>('loading');
  const refreshTimeoutRef = useRef<number | null>(null);
  const toast = useToast();

  const scheduleTokenRefresh = () => {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
    }
    // Access token is valid for 15 mins (900,000 ms). We refresh at 12 mins (720,000 ms).
    refreshTimeoutRef.current = window.setTimeout(async () => {
      try {
        const data = await api<{ access_token: string; user: Me }>('/api/auth/refresh', { method: 'POST' });
        tokens.setAccess(data.access_token);
        setUser(data.user);
        scheduleTokenRefresh();
      } catch (e) {
        console.error('Failed to perform background token refresh', e);
      }
    }, 720000);
  };

  const initAuth = async () => {
    try {
      const response = await authApi.refresh();
      tokens.setAccess(response.access_token);
      setUser(response.user);
      setStatus('authed');
      scheduleTokenRefresh();
    } catch (e) {
      tokens.setAccess(null);
      setUser(null);
      setStatus('guest');
    }
  };

  useEffect(() => {
    initAuth();

    // Subscribe to session-expired events from the api client
    const handleSessionExpired = () => {
      tokens.setAccess(null);
      setUser(null);
      setStatus('guest');
      toast.error('Your session has expired. Please log in again.');
      
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/' && !currentPath.startsWith('/login') && !currentPath.startsWith('/signup')) {
        window.location.href = `/login?return=${encodeURIComponent(currentPath)}`;
      }
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    const response = await authApi.login({ email, password, remember });
    tokens.setAccess(response.access_token);
    setUser(response.user);
    setStatus('authed');
    scheduleTokenRefresh();
    
    // Analytics
    track('identify', { user_id: response.user.id });
    track('login_succeeded');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore
    } finally {
      tokens.setAccess(null);
      setUser(null);
      setStatus('guest');
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
      toast.info('Logged out successfully.');
    };
  };

  const refreshMe = async () => {
    try {
      const response = await authApi.refresh();
      tokens.setAccess(response.access_token);
      setUser(response.user);
    } catch (e) {
      console.error('Failed to refresh user info', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
