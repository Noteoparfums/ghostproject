import { useState, useEffect, useRef } from 'react';
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
import Accordion from '../../components/ui/Accordion';
import Modal from '../../components/ui/Modal';
import { 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  RotateCw, 
  Copy, 
  Edit3, 
  ArrowRight,
  Download,
  History,
  CheckCircle,
  FileText,
  Volume2,
  Bookmark
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { track } from '../../lib/analytics';

export function Generate() {
  useDocumentMeta({
    title: 'Generate Workspace — Ghostwriter OS',
  });

  const { credits, refresh } = useBilling();
  const toast = useToast();
  
  // Stream state hook
  const { 
    state, 
    start, 
    cancel,
    createVariant,
    regenerateSection, 
    reset 
  } = useGenerationStream();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(null);
  const [funnelType, setFunnelType] = useState<'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp'>('vsl');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');

  // Editing state
  const [editingAssetId, setEditingAssetId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load projects & voices
  const { data: projectsPayload } = useApi(() => projectsApi.list(1));
  const projects = projectsPayload?.data || [];

  const { data: voices = [] } = useApi(() => brandVoicesApi.list());

  // Load history list
  const { data: historyPayload, refetch: refetchHistory } = useApi(
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

  const handleStartEdit = (assetId: number, content: string) => {
    setEditingAssetId(assetId);
    setEditingContent(content);
  };

  const handleSaveEdit = async (assetId: number) => {
    try {
      await generationsApi.updateAsset(assetId, { content: editingContent });
      toast.success('Asset copy updated successfully.');
      setEditingAssetId(null);
      
      // Update local asset state
      setStateAssets((prev) => 
        prev.map((a) => (a.id === assetId ? { ...a, content: editingContent } : a))
      );
      track('asset_edited', { asset_type: 'ad_hooks' });
    } catch (e) {
      toast.error('Failed to save edit.');
    }
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
          <h1 className="text-xl font-extrabold tracking-tight dark:text-zinc-50 text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
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
        <div className="flex flex-col gap-5 border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 max-h-[85vh] overflow-y-auto">
          <h3 className="font-bold text-sm dark:text-zinc-200 text-zinc-800">
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
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* Funnel Type Radio Options */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-zinc-400 text-zinc-500">
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
                      ? 'border-blue-600/50 bg-blue-600/5 dark:bg-blue-950/20'
                      : 'border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/10 hover:bg-zinc-100/30'
                  )}
                >
                  <div>
                    <h4 className="font-bold text-xs dark:text-zinc-300 text-zinc-700">
                      {item.label}
                    </h4>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      {item.count} campaign deliverables
                    </span>
                  </div>
                  <Layers className={cn('w-4 h-4', funnelType === item.type ? 'text-blue-500' : 'text-zinc-400')} />
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
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            This will charge <span className="text-blue-500">1.00 credit</span>. You have {credits} credits.
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
            <div className="p-5 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 flex flex-col gap-4 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Funnel Compiler Pipeline
                </span>
                <span className="text-xs font-bold text-blue-500 font-mono">
                  {state.currentProgress}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${state.currentProgress}%` }}
                />
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
                        isComplete && 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500',
                        isRunning && 'border-blue-600/30 bg-blue-600/5 text-blue-500 animate-pulse',
                        !isComplete && !isRunning && 'border-zinc-100 dark:border-zinc-900 text-zinc-400 dark:text-zinc-600'
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
                  <Button onClick={cancel} variant="ghost" size="sm" className="text-red-500">
                    Cancel Generation
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Autoplay briefs card */}
          {state.brief && (
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/20 flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500">
                {state.brief.title}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-semibold dark:text-zinc-500 text-zinc-400 uppercase">Schwartz Awareness Stage</span>
                  <p className="font-bold dark:text-zinc-300 text-zinc-700 mt-0.5">Stage {state.brief.awareness_stage} (Solution-Aware)</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold dark:text-zinc-500 text-zinc-400 uppercase">Core Marketing Hook</span>
                  <p className="font-bold dark:text-zinc-300 text-zinc-700 mt-0.5">{state.brief.core_hook}</p>
                </div>
              </div>
            </div>
          )}

          {/* Streaming Assets List */}
          {stateAssets.map((asset) => {
            const isEditing = editingAssetId === asset.id;
            const hasScore = asset.copy_score !== null;

            return (
              <div
                key={asset.id}
                className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 overflow-hidden flex flex-col shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b dark:border-zinc-900 border-zinc-100 bg-zinc-50/50 dark:bg-zinc-950/40">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm dark:text-zinc-100 text-zinc-800 capitalize">
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
                <div className="p-6 text-sm dark:text-zinc-200 text-zinc-700 leading-relaxed font-normal whitespace-pre-wrap select-text">
                  {isEditing ? (
                    <Input
                      multiline
                      rows={8}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                  ) : (
                    asset.content || <span className="text-zinc-400 dark:text-zinc-600 italic">Writing draft...</span>
                  )}
                </div>

                {/* Footer Controls */}
                {state.status === 'complete' && (
                  <div className="flex justify-between items-center px-6 py-3.5 border-t dark:border-zinc-900 border-zinc-100 bg-zinc-50/30 dark:bg-zinc-950/20 select-none">
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={() => handleSaveEdit(asset.id)} variant="primary" size="sm">
                            Save
                          </Button>
                          <Button onClick={() => setEditingAssetId(null)} variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopyText(asset.content)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                            title="Copy to Clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(asset.id, asset.content)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                            title="Edit Draft"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => regenerateSection(asset.id)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                            title="Regenerate Section (0.25 credit)"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => createVariant(asset.id)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                            title="A/B Variant (0.10 credit)"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {asset.variants && asset.variants.length > 1 && (
                      <div className="flex gap-1 items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border dark:border-zinc-800">
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
                              'px-2.5 py-1 text-[10px] font-bold rounded-md transition-all',
                              asset.activeVariantIndex === vIdx
                                ? 'bg-white dark:bg-zinc-950 shadow-sm text-zinc-800 dark:text-zinc-100'
                                : 'text-zinc-500 hover:text-zinc-700'
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
          <p className="text-xs dark:text-zinc-400 text-zinc-500">
            View details of previously generated campaign sequences.
          </p>

          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs italic text-zinc-500 text-center py-8">No generation history found.</p>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => {
                    // Hydrate simple history representation
                    setFunnelType(h.funnel_type as any);
                    setProduct(h.brief);
                    setIsHistoryOpen(false);
                    toast.success('Hydrated workspace parameters from history.');
                  }}
                  className="p-4 rounded-xl border dark:border-zinc-900 border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/40 hover:border-blue-500 transition-all cursor-pointer flex justify-between items-center gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Campaign #{h.id}
                    </span>
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 capitalize truncate mt-0.5">
                      {h.funnel_type.replace('_', ' ')}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate mt-1">
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
