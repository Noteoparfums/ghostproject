import type { ReactNode } from 'react';
import { BRAND } from '../../config/brand';
import { AlertTriangle } from 'lucide-react';

interface EditorialLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  legal?: boolean;
}

export function EditorialLayout({ eyebrow, title, intro, children, legal = false }: EditorialLayoutProps) {
  return (
    <article className="bg-[var(--color-canvas)] px-6 py-16 text-[var(--color-text-default)] sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-primary)]">
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 text-4xl leading-[0.96] text-[var(--color-text-strong)] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-text-subtle)]">{intro}</p>
        {legal && (
          <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-xl)] border border-[var(--color-status-warning)]/30 bg-[var(--color-status-warning)]/10 p-4 text-xs leading-5 text-[var(--color-status-warning)]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{BRAND.legalReview}</span>
          </div>
        )}
        <div className="mt-12 space-y-10">{children}</div>
      </div>
    </article>
  );
}

export function EditorialSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-[var(--color-text-strong)] sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-text-subtle)]">{children}</div>
    </section>
  );
}

export default EditorialLayout;