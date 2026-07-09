import type { ReactNode } from 'react';
import { BRAND } from '../../config/brand';

interface EditorialLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  legal?: boolean;
}

export function EditorialLayout({ eyebrow, title, intro, children, legal = false }: EditorialLayoutProps) {
  return (
    <article className="bg-background px-6 py-16 text-foreground sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow text-[#b9573b]">{eyebrow}</p>
        <h1 className="font-display mt-4 text-5xl leading-[0.96] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{intro}</p>
        {legal && (
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-5 text-amber-900 dark:text-amber-200">
            {BRAND.legalReview}
          </div>
        )}
        <div className="prose-briefloom mt-12 space-y-10">{children}</div>
      </div>
    </article>
  );
}

export function EditorialSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default EditorialLayout;