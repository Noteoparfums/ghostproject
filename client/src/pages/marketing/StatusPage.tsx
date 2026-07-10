import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import BrandMark from '../../components/brand/BrandMark';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function StatusPage({ code, title, body }: { code: '403' | '404'; title: string; body: string }) {
  useDocumentMeta({ title, canonical: `/${code}` });
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-6 py-20 text-center text-[var(--color-text-default)]">
      <div className="max-w-lg">
        <BrandMark className="mx-auto h-12 w-12" />
        <p className="font-display mt-8 text-7xl italic text-[var(--color-accent-primary)]">{code}</p>
        <h1 className="font-display mt-4 text-4xl text-[var(--color-text-strong)]">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-text-subtle)]">{body}</p>
        <Link to="/" className="mt-8 inline-block" tabIndex={-1}>
          <Button>Return home</Button>
        </Link>
      </div>
    </main>
  );
}

export default StatusPage;