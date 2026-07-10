import type { ReactNode } from 'react';
import BrandMark from '../brand/BrandMark';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <BrandMark className="h-10 w-10" />
          <h1 className="font-display mt-2 text-2xl tracking-tight text-[var(--color-text-strong)]">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-subtle)]">
            {subtitle}
          </p>
        </div>

        <div className="p-8 border rounded-[var(--radius-2xl)] border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-lg)] flex flex-col gap-6">
          {children}
        </div>

        {footer && (
          <div className="text-center text-sm text-[var(--color-text-subtle)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;
