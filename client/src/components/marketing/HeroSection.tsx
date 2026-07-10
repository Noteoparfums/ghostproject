import React, { lazy, Suspense, useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { ArrowRight, Check, Play } from 'lucide-react';
import HeroFallback from './hero/HeroFallback';

const LoomSculpture = lazy(() => import('./hero/LoomSculpture'));

/* ------------------------------------------------------------------ */
/*  WebGL detection                                                   */
/* ------------------------------------------------------------------ */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Error boundary for the 3D canvas                                  */
/* ------------------------------------------------------------------ */
interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
}
interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.warn('[HeroSection] WebGL canvas error, falling back:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <HeroFallback />;
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Trust badges                                                      */
/* ------------------------------------------------------------------ */
const TRUST_BADGES = [
  'No card required',
  '5 free credits',
  'Cancel anytime',
] as const;

/* ------------------------------------------------------------------ */
/*  HeroSection                                                       */
/* ------------------------------------------------------------------ */
export function HeroSection() {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setWebglSupported(supportsWebGL());
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        borderBottom: '1px solid var(--color-border-subtle)',
        paddingLeft: 'var(--space-5)',
        paddingRight: 'var(--space-5)',
        paddingTop: 'clamp(5rem, 8vw, 7rem)',
        paddingBottom: 'clamp(5rem, 8vw, 7rem)',
        overflow: 'hidden',
      }}
    >
      {/* ---- Background decorations ---- */}
      <div className="paper-grid" aria-hidden="true" />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50%',
          height: '60%',
          background:
            'radial-gradient(ellipse at center, var(--color-accent-primary-muted, rgba(190,90,60,0.08)) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '45%',
          height: '55%',
          background:
            'radial-gradient(ellipse at center, var(--color-accent-secondary-muted, rgba(214,168,75,0.06)) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* ---- Content grid ---- */}
      <div
        style={{
          position: 'relative',
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-8, 2rem)',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* ==== LEFT — copy column ==== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5, 1.25rem)' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3, 0.75rem)',
              color: 'var(--color-accent-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs, 0.75rem)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                height: '1px',
                width: '1.75rem',
                backgroundColor: 'var(--color-accent-primary)',
              }}
            />
            Direct-response copy intelligence
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--color-text-strong)',
              margin: 0,
            }}
          >
            One clear brief.
            <br />
            <em
              style={{
                fontStyle: 'italic',
                color: 'var(--color-accent-primary)',
              }}
            >
              A campaign that holds.
            </em>
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-lg, 1.125rem)',
              lineHeight: 1.65,
              color: 'var(--color-text-default)',
              maxWidth: '38rem',
              margin: 0,
            }}
          >
            Briefloom turns campaign context into coordinated ads, sales pages, scripts, and emails—so every asset pulls in the same direction.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4, 1rem)', flexWrap: 'wrap', paddingTop: 'var(--space-2, 0.5rem)' }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button size="lg">
                Weave your first campaign
                <ArrowRight size={18} style={{ marginLeft: '0.35rem' }} />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play size={18} style={{ fill: 'currentColor', marginLeft: '-0.2rem', marginRight: '0.1rem' }} />
              See the workflow
            </Button>
          </div>

          {/* Trust badges */}
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-4, 1rem)',
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {TRUST_BADGES.map((badge) => (
              <li
                key={badge}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm, 0.875rem)',
                  color: 'var(--color-text-subtle)',
                }}
              >
                <Check
                  size={15}
                  style={{ color: 'var(--color-status-success)', flexShrink: 0 }}
                />
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {/* ==== RIGHT — 3D / fallback column ==== */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '4 / 3',
            minHeight: '300px',
          }}
          className="hero-visual"
        >
          {/* Decorative tilted background */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-8%',
              background:
                'linear-gradient(135deg, var(--color-surface-raised, rgba(38,59,51,0.06)) 0%, transparent 60%)',
              borderRadius: 'var(--radius-xl, 1.5rem)',
              transform: 'rotate(-3deg)',
              zIndex: 0,
            }}
          />

          {/* Canvas / Fallback */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            {webglSupported ? (
              <WebGLErrorBoundary>
                <Suspense fallback={<HeroFallback />}>
                  <LoomSculpture />
                </Suspense>
              </WebGLErrorBoundary>
            ) : (
              <HeroFallback />
            )}
          </div>
        </div>
      </div>

      {/* ---- Responsive grid style ---- */}
      <style>{`
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.05fr 0.95fr !important;
          }
          .hero-visual {
            min-height: 400px !important;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
