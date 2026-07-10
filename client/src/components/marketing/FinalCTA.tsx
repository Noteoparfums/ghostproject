import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import BrandMark from '../brand/BrandMark';

export function FinalCTA() {
  return (
    <section
      className="px-[var(--space-page)] py-[var(--space-section)]"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <BrandMark className="h-12 w-12" />

        <h2
          id="final-cta-heading"
          className="font-display mt-6 text-3xl leading-tight text-[var(--color-text-strong)] sm:text-4xl"
        >
          Make the whole campaign feel&nbsp;inevitable.
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-subtle)]">
          Start with one clear brief. Leave with a connected body of copy ready to refine,
          review, and&nbsp;launch.
        </p>

        <Link to="/signup" className="mt-8" tabIndex={-1}>
          <Button variant="primary" size="lg" className="gap-2">
            Start creating free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default FinalCTA;
