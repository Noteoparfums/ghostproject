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
    title: 'Dashboard — Ghostwriter OS',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-indigo-950/20 border border-zinc-200/20 dark:border-zinc-900 relative overflow-hidden">
        <div className="flex flex-col gap-2 min-w-0 z-10">
          <h1 className="text-xl font-extrabold tracking-tight dark:text-zinc-50 text-zinc-900">
            Welcome back, {user?.name || 'Copywriter'}
          </h1>
          <p className="text-xs dark:text-zinc-400 text-zinc-500 max-w-md leading-relaxed">
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
        <div className="p-6 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Credits Available
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {credits}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Active plan: {plan?.name || 'Free Tier'}
            </span>
          </div>
          <ProgressRing value={parsedCredits} max={100} size={72} strokeWidth={5} />
        </div>

        {/* Projects */}
        <div className="p-6 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Total Projects
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {projectCount}
            </span>
            <Link 
              to="/app/projects" 
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mt-2.5 flex items-center gap-1"
            >
              View Projects
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-full bg-blue-600/5 text-blue-500 shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Generations */}
        <div className="p-6 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Campaigns Generated
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {generationCount}
            </span>
            <Link 
              to="/app/generate" 
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mt-2.5 flex items-center gap-1"
            >
              Open Workspace
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 rounded-full bg-indigo-600/5 text-indigo-500 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Links Menu */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Quick Start Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link 
            to="/app/brand-voice" 
            className="p-6 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors flex flex-col gap-3 group"
          >
            <Volume2 className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Configure Brand Voice
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Upload writing samples to configure custom copywriting guidelines and banned keywords.
            </p>
          </Link>

          <Link 
            to="/app/generate" 
            className="p-6 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors flex flex-col gap-3 group"
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              VSL Funnel Builder
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Compile full marketing paths: Facebook hooks, script pitches, registration pages, and followups.
            </p>
          </Link>

          <Link 
            to="/app/billing" 
            className="p-6 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors flex flex-col gap-3 group"
          >
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Manage Subscription
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              View active plan details, invoice receipts, purchase top-up credits, and request refunds.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
