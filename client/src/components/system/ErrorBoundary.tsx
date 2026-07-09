import {   Component } from 'react';
import type { ErrorInfo } from 'react';
import type { ReactNode } from 'react';
import { track } from '../../lib/analytics';
import { ApiError } from '../../api/client';
import Button from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props & { children: ReactNode }, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React boundary error:', error, errorInfo);
    
    // Log error to analytics (consent-exempt essential telemetry)
    track('client_error', {
      message: `${error.name}: ${error.message}. Stack: ${errorInfo.componentStack?.slice(0, 500) || ''}`,
      route: window.location.pathname,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isApiError = this.state.error instanceof ApiError;
      const requestId = isApiError ? (this.state.error as ApiError).requestId : undefined;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center dark:bg-zinc-950 bg-zinc-50">
          <div className="max-w-md w-full p-8 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950 shadow-xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-red-500 mb-2">500</h1>
            <h2 className="text-xl font-bold dark:text-zinc-100 text-zinc-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-sm dark:text-zinc-400 text-zinc-500 mb-6">
              An unexpected application error has occurred. Our engineers have been notified.
            </p>
            
            {requestId && (
              <div className="mb-6 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl font-mono text-xs text-zinc-500 select-all">
                Reference ID: {requestId}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={this.handleReload} variant="primary">
                Reload Page
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="secondary">
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
