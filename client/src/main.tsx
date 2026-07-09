import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConsentProvider } from './contexts/ConsentContext';
import { AuthProvider } from './contexts/AuthContext';
import { BillingProvider } from './contexts/BillingContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ConsentProvider>
          <AuthProvider>
            <BillingProvider>
              <App />
            </BillingProvider>
          </AuthProvider>
        </ConsentProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
