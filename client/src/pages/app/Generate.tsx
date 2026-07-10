import { useState, useEffect } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useBilling } from '../../contexts/BillingContext';
import { useToast } from '../../contexts/ToastContext';
import { useApi } from '../../hooks/useApi';
import { EmptyState } from '../../components/ui/EmptyState';
import { useGenerationStream } from '../../hooks/useGenerationStream';
import type { StageId } from '../../hooks/useGenerationStream';
import { projectsApi } from '../../api/endpoints/projects';
import { brandVoicesApi } from '../../api/endpoints/brandVoices';
import { generationsApi } from '../../api/endpoints/generations';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  Sparkles,
  Layers,
  RotateCw,
  Copy,
  History,
} from 'lucide-react';
import { cn } from '../../lib/cn';

export function Generate() {
  useDocumentMeta({
    title: 'Generation workspace',
  });

  const { credits } = useBilling();
  const toast = useToast();

  // Stream state hook
  const {
    state,
    start,
    regenerateSection,
    reset
  } = useGenerationStream();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(null);
  const [funnelType, setFunnelType] = useState<'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp'>('vsl');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [tone] = useState('');

  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load projects & voices
  const { data: projectsPayload } = useApi(() => projectsApi.list(1));
  const projects = projectsPayload?.data || [];

  const { data: voices = [] } = useApi(() => brandVoicesApi.list());

  // Load history list
  const { data: historyPayload } = useApi(
    () => generationsApi.list(1)
  );
  const history = historyPayload?.data || [];

  const handleGenerate = () => {
    start({
      project_id: selectedProjectId,
      brand_voice_id: selectedVoiceId,
      funnel_type: funnelType,
      product,
      audience,
      tone,
    });
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copy text copied to clipboard!');
  };

  // Local override state for asset changes
  const [stateAssets, setStateAssets] = useState(state.assets);
  useEffect(() => {
    setStateAssets(state.assets);
  }, [state.assets]);

  const parsedCredits = parseFloat(credits) || 0;
  const isGenerateDisabled =
    product.length < 20 ||
    !audience.trim() ||
    parsedCredits < 1.0 ||
    state.status === 'running';

  return (
    <div className="flex flex-col gap-6 h-full min-w-0 select-none">
      {/* Top action bar */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--color-text-strong)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-accent-primary)]" />
            Generate Workspace
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsHistoryOpen(true)} variant="secondary" size="sm">
            <History className="w-4 h-4 mr-1.5" />
            History
          </Button>
          {state.status === 'complete' && (
            <Button onClick={reset} variant="ghost" size="sm">
              Clear Workspace
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start flex-1 min-h-0">
        {/* Input Panel (Left Column) */}
        <div className="flex flex-col gap-5 border rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-6 max-h-[85vh] overflow-y-auto">
          <h3 className="font-bold text-sm text-[var(--color-text-strong)]">
            Funnel Inputs
          </h3>

          {/* Project association */}
          <Field label="Associate with Project" id="project">
            <Select
              id="project"
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(parseInt(e.target.value, 10) || null)}
            >
              <option value="">No Project (Standalone)</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* Funnel Type Radio Options */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
              Funnel Strategy
            </span>
            <div className="flex flex-col gap-2">
              {[
                { type: 'vsl', label: 'Video Sales Letter (VSL)', count: 7 },
                { type: 'lead_magnet', label: 'Lead Magnet Funnel', count: 8 },
                { type: 'product_launch', label: 'Product Launch Funnel', count: 6 },
                { type: 'webinar', label: 'Webinar Campaign', count: 6 },
                { type: 'ecom_pdp', label: 'eCom Product Page (PDP)', count: 5 },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setFunnelType(item.type as any)}
                  className={cn(
                    'p-3.5 border rounded-xl text-left transition-all flex items-center justify-between gap-4',
                    funnelType === item.type
                      ? 'border-[var(--color-accent-primary)]/50 bg-[var(--color-accent-primary)]/5'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-overlay)]'
                  )}
                >
                  <div>
                    <h4 className="font-bold text-xs text-[var(--color-text-strong)]">
                      {item.label}
                    </h4>
                    <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                      {item.count} campaign deliverables
                    </span>
                  </div>
                  <Layers className={cn('w-4 h-4', funnelType === item.type ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-subtle)]')} />
                </button>
              ))}
            </div>
          </div>

          {/* Product description */}
          <Field
            label="Product description"
            id="product"
            hint={`${product.length} chars (minimum 20)`}
          >
            <Input
              id="product"
              multiline
              rows={4}
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Describe your product core mechanism and offer..."
            />
          </Field>

          {/* Target Audience */}
          <Field label="Target Audience" id="audience">
            <Input
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Agency owners scaling ads"
            />
          </Field>

          {/* Tone & Brand Voice Selector */}
          <Field label="Tuning Tone / Voice" id="voice">
            <Select
              id="voice"
              value={selectedVoiceId || ''}
              onChange={(e) => setSelectedVoiceId(parseInt(e.target.value, 10) || null)}
            >
              <option value="">Default AI copywriter</option>
              {voices && voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* Credits notice */}
          <div className="p-3 bg-[var(--color-surface-sunken)] border border-[var(--color-border-subtle)] rounded-xl text-[11px] font-semibold text-[var(--color-text-subtle)]">
            This will charge <span className="text-[var(--color-accent-primary)]">1.00 credit</span>. You have {credits} credits.
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            loading={state.status === 'running' || state.status === 'queued'}
            variant="primary"
            className="w-full mt-2"
          >
            Generate Campaign
          </Button>
        </div>

        {/* Assets Output Pane (Right Column) */}
        <div className="flex flex-col gap-6 min-w-0 flex-1 overflow-y-auto max-h-[85vh] pr-1">
          {state.status === 'idle' && (
            <EmptyState
              illustration={<Sparkles className="w-12 h-12 stroke-1" />}
              title=" funnel compiler workspace ready"
              body="Configure parameters on the left to begin compiling copywriting assets side-by-side."
            />
          )}

          {/* Status Pipeline Tracker */}
          {(state.status === 'running' || state.status === 'queued' || state.status === 'complete') && (
            <div className="p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex flex-col gap-4 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Funnel Compiler Pipeline
                </span>
                <span className="text-xs font-bold text-[var(--color-accent-primary)] font-mono" aria-live="polite">
                  {state.status === 'complete' ? 'Complete' : state.currentStage?.replace('_', ' ') || 'Starting'}
                </span>
              </div>

              {/* Steps indicators */}
              <div className="grid grid-cols-4 gap-2 text-[10px] font-bold uppercase tracking-wider text-center select-none max-sm:grid-cols-2">
                {[
                  { id: 'analysis', label: 'Brief Analysis' },
                  { id: 'angles', label: 'Tuning Angles' },
                  { id: 'draft', label: 'Drafting Copy' },
                  { id: 'polish', label: 'Polishing Copy' },
                ].map((step) => {
                  const s = state.stages[step.id as StageId];
                  const isRunning = s?.status === 'running';
                  const isComplete = s?.status === 'complete';
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'p-2 rounded-lg border flex items-center justify-center gap-1.5',
                        isComplete && 'border-[var(--color-status-success)]/30 bg-[var(--color-status-success)]/10 text-[var(--color-status-success)]',
                        isRunning && 'border-[var(--color-accent-primary)]/30 bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] animate-pulse',
                        !isComplete && !isRunning && 'border-[var(--color-border-subtle)] text-[var(--color-text-subtle)]'
                      )}
                    >
                      {isComplete && '✓'}
                      {step.label}
                    </div>
                  );
                })}
              </div>

              {state.status === 'running' && (
                <div className="flex justify-end mt-1 select-none">
                  <span className="text-xs text-[var(--color-text-muted)]">This run continues if you leave the page.</span>
                </div>
              )}
            </div>
          )}

          {/* Autoplay briefs card */}
          {state.brief && (
            <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-primary)]">
                {state.brief.title}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">Schwartz Awareness Stage</span>
                  <p className="font-bold text-[var(--color-text-strong)] mt-0.5">Stage {state.brief.awareness_stage} (Solution-Aware)</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">Core Marketing Hook</span>
                  <p className="font-bold text-[var(--color-text-strong)] mt-0.5">{state.brief.core_hook}</p>
                </div>
              </div>
            </div>
          )}

          {/* Streaming Assets List */}
          {stateAssets.map((asset) => {
            const hasScore = asset.copy_score !== null;

            return (
              <div
                key={asset.id}
                className="border rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] overflow-hidden flex flex-col shadow-[var(--shadow-sm)]"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)]">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-[var(--color-text-strong)] capitalize">
                      {asset.asset_type.replace('_', ' ')}
                    </span>
                    {asset.framework_note && (
                      <Badge tone="info">{asset.framework_note}</Badge>
                    )}
                  </div>
                  {hasScore && (
                    <Badge
                      tone={
                        asset.copy_score! >= 80
                          ? 'success'
                          : asset.copy_score! >= 60
                            ? 'warning'
                            : 'danger'
                      }
                      className="font-mono"
                    >
                      CopyScore: {asset.copy_score}
                    </Badge>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 text-sm text-[var(--color-text-default)] leading-relaxed font-normal whitespace-pre-wrap select-text">
                  {asset.content || <span className="text-[var(--color-text-subtle)] italic">Writing draft...</span>}
                </div>

                {/* Footer Controls */}
                {state.status === 'complete' && (
                  <div className="flex justify-between items-center px-6 py-3.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] select-none">
                    <div className="flex gap-2">
                      <>
                        <button
                          onClick={() => handleCopyText(asset.content)}
                          className="p-2 hover:bg-[var(--color-surface-overlay)] rounded-[var(--radius-md)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {asset.id > 0 && (
                          <button
                            onClick={() => regenerateSection(asset.id)}
                            className="p-2 hover:bg-[var(--color-surface-overlay)] rounded-[var(--radius-md)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)] transition-colors"
                            title="Regenerate Section (0.25 credit)"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    </div>

                    {asset.variants && asset.variants.length > 1 && (
                      <div className="flex gap-1 items-center bg-[var(--color-surface-overlay)] p-0.5 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
                        {asset.variants.map((v, vIdx) => (
                          <button
                            key={v.id}
                            onClick={() => {
                              // Switch active variant content
                              setStateAssets((prev) =>
                                prev.map((a) => a.id === asset.id ? {
                                  ...a,
                                  activeVariantIndex: vIdx,
                                  content: v.content
                                } : a)
                              );
                            }}
                            className={cn(
                              'px-2.5 py-1 text-[10px] font-bold rounded-[var(--radius-sm)] transition-all',
                              asset.activeVariantIndex === vIdx
                                ? 'bg-[var(--color-surface-raised)] shadow-[var(--shadow-sm)] text-[var(--color-text-strong)]'
                                : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-strong)]'
                            )}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* History Slide Drawer */}
      <Modal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Generation History"
        size="md"
      >
        <div className="flex flex-col gap-4 select-none">
          <p className="text-xs text-[var(--color-text-subtle)]">
            View details of previously generated campaign sequences.
          </p>

          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs italic text-[var(--color-text-subtle)] text-center py-8">No generation history found.</p>
            ) : (
              history.map((h: any) => (
                <div
                  key={h.id}
                  className="p-4 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] flex justify-between items-center gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                      Campaign #{h.id}
                    </span>
                    <h4 className="font-bold text-xs text-[var(--color-text-strong)] capitalize truncate mt-0.5">
                      {h.funnel_type.replace('_', ' ')}
                    </h4>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate mt-1">
                      {h.brief}
                    </p>
                  </div>
                  <Badge tone={h.status === 'complete' ? 'success' : 'warning'}>
                    {h.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Generate;
