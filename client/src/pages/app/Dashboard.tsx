import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { useBilling } from '../../contexts/BillingContext';
import { useApi } from '../../hooks/useApi';
import { projectsApi } from '../../api/endpoints/projects';
import { generationsApi } from '../../api/endpoints/generations';
import ProgressRing from '../../components/ui/ProgressRing';
import Button from '../../components/ui/Button';
import { Sparkles, FolderOpen, Volume2, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  useDocumentMeta({
    title: 'Dashboard',
  });

  const { user } = useAuth();
  const { plan, credits } = useBilling();

  // Load project count
  const { data: projectsData } = useApi(() => projectsApi.list(1));
  const projectCount = projectsData?.meta?.total || 0;

  // Load generations history count
  const { data: generationsData } = useApi(() => generationsApi.list(1));
  const generationCount = generationsData?.meta?.total || 0;

  const parsedCredits = parseFloat(credits) || 0.00;

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] relative overflow-hidden">
        <div className="flex flex-col gap-2 min-w-0 z-10">
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--color-text-strong)]">
            Welcome back, {user?.name || 'Copywriter'}
          </h1>
          <p className="text-sm text-[var(--color-text-subtle)] max-w-md leading-relaxed">
            Your workspace is active. Create copy funnels that target cold traffic pain points using Direct Response engines.
          </p>
        </div>
        <Link to="/app/generate" className="z-10 shrink-0">
          <Button variant="primary" size="sm" className="group">
            Generate Funnel
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits */}
        <div className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Credits Available
            </span>
            <span className="text-2xl font-extrabold text-[var(--color-text-strong)]">
              {credits}
            </span>
            <span className="text-xs text-[var(--color-text-subtle)] mt-1">
              Active plan: {plan?.name || 'Free Tier'}
            </span>
          </div>
          <ProgressRing value={parsedCredits} max={Number(plan?.monthly_credits) || Math.max(parsedCredits, 1)} size={72} strokeWidth={5} />
        </div>

        {/* Projects */}
        <div className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Projects
            </span>
            <span className="text-2xl font-extrabold text-[var(--color-text-strong)]">
              {projectCount}
            </span>
            <Link
              to="/app/projects"
              className="text-xs font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)] mt-2.5 flex items-center gap-1"
            >
              View Projects
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Generations */}
        <div className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Campaigns Generated
            </span>
            <span className="text-2xl font-extrabold text-[var(--color-text-strong)]">
              {generationCount}
            </span>
            <Link
              to="/app/generate"
              className="text-xs font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)] mt-2.5 flex items-center gap-1"
            >
              Open Workspace
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Links Menu */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          Quick Start Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/app/brand-voice"
            className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] transition-colors flex flex-col gap-3 group"
          >
            <Volume2 className="w-5 h-5 text-[var(--color-accent-primary)]" />
            <h4 className="font-bold text-sm text-[var(--color-text-strong)] group-hover:text-[var(--color-accent-primary)] transition-colors">
              Configure Brand Voice
            </h4>
            <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
              Upload writing samples to configure custom copywriting guidelines and banned keywords.
            </p>
          </Link>

          <Link
            to="/app/generate"
            className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] transition-colors flex flex-col gap-3 group"
          >
            <Sparkles className="w-5 h-5 text-[var(--color-accent-primary)]" />
            <h4 className="font-bold text-sm text-[var(--color-text-strong)] group-hover:text-[var(--color-accent-primary)] transition-colors">
              VSL Funnel Builder
            </h4>
            <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
              Compile full marketing paths: Facebook hooks, script pitches, registration pages, and followups.
            </p>
          </Link>

          <Link
            to="/app/billing"
            className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-sunken)] transition-colors flex flex-col gap-3 group"
          >
            <CreditCard className="w-5 h-5 text-[var(--color-accent-primary)]" />
            <h4 className="font-bold text-sm text-[var(--color-text-strong)] group-hover:text-[var(--color-accent-primary)] transition-colors">
              Manage Subscription
            </h4>
            <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
              View active plan details, invoice receipts, purchase top-up credits, and provider options.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
