import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import BrandMark from '../../components/brand/BrandMark';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function StatusPage({ code, title, body }: { code: '403' | '404'; title: string; body: string }) {
  useDocumentMeta({ title, canonical: `/${code}` });
  return (
    <main className="paper-grid flex min-h-screen items-center justify-center bg-background px-6 py-20 text-center text-foreground">
      <div className="max-w-lg">
        <BrandMark className="mx-auto h-12 w-12" />
        <p className="font-display mt-8 text-7xl italic text-[#b9573b]">{code}</p>
        <h1 className="font-display mt-4 text-4xl">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
        <Link to="/" className="mt-8 inline-block"><Button>Return home</Button></Link>
      </div>
    </main>
  );
}

export default StatusPage;