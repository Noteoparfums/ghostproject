import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { brandVoicesApi, BrandVoice } from '../../api/endpoints/brandVoices';
import { createBrandVoiceSchema } from '@ghostwriter/shared';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Slider from '../../components/ui/Slider';
import Stepper from '../../components/ui/Stepper';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Volume2, VolumeX, Plus, Trash2, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { track } from '../../lib/analytics';

export function BrandVoices() {
  useDocumentMeta({
    title: 'Brand voices',
  });

  const toast = useToast();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [voiceToDelete, setVoiceToDelete] = useState<BrandVoice | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<BrandVoice | null>(null);

  // Wizard state categories
  const [name, setName] = useState('');
  const [bannedWordsInput, setBannedWordsInput] = useState('');
  const [toneSliders, setToneSliders] = useState({
    formal_casual: 50,
    safe_bold: 50,
    short_story: 50,
  });
  const [sample1, setSample1] = useState('');
  const [sample2, setSample2] = useState('');

  // Fetch voices
  const { data: voices = [], loading, refetch } = useApi(
    () => brandVoicesApi.list()
  );

  const steps = ['Details', 'Tone Tuning', 'Samples'];

  // Handle wizard submission
  const handleWizardSubmit = async () => {
    // Basic validation
    if (sample1.length < 200 || sample2.length < 200) {
      toast.error('Each copywriting sample must contain at least 200 characters.');
      return;
    }

    const bannedWords = bannedWordsInput
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0);

    const payload = {
      name,
      sample_texts: [sample1, sample2],
      tone_sliders: toneSliders,
      banned_words: bannedWords,
    };

    try {
      await brandVoicesApi.create(payload);
      toast.success('Brand Voice created successfully!');
      setIsWizardOpen(false);
      
      // Reset state
      setName('');
      setBannedWordsInput('');
      setToneSliders({ formal_casual: 50, safe_bold: 50, short_story: 50 });
      setSample1('');
      setSample2('');
      setActiveStep(0);
      refetch();
      track('first_brand_voice_created');
    } catch (err: any) {
      toast.error(err.message || 'Failed to build Brand Voice');
    }
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (!name.trim()) {
        toast.error('Voice name is required');
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  // Delete Voice
  const handleDeleteConfirm = async () => {
    if (!voiceToDelete) return;
    try {
      await brandVoicesApi.delete(voiceToDelete.id);
      toast.success('Brand Voice removed.');
      refetch();
      if (selectedVoice?.id === voiceToDelete.id) {
        setSelectedVoice(null);
      }
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setVoiceToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none min-w-0">
      {/* Header bar */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight dark:text-zinc-50 text-zinc-900">
            Brand Voice
          </h1>
          <p className="text-xs dark:text-zinc-400 text-zinc-500 mt-1">
            Build guidelines representing your brand criteria and tone metrics.
          </p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)} variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Voice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Main List */}
        <div className="min-w-0">
          {loading ? (
            <div className="h-64 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !voices || voices.length === 0 ? (
            <EmptyState
              illustration={<VolumeX className="w-12 h-12 stroke-1" />}
              title="No Brand Voices yet"
              body="Configure custom tone sliders and banned keyword lists to alignment AI outputs to your copywriting specifications."
              cta={{ label: 'Create Voice', onClick: () => setIsWizardOpen(true) }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voices && voices.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoice(v)}
                  className="p-5 rounded-2xl border bg-white dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-900 hover:border-blue-500/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 cursor-pointer transition-all flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-sm dark:text-zinc-200 text-zinc-800">
                        {v.name}
                      </h3>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Tuned: {v.tone_sliders ? Object.values(v.tone_sliders).join('/') : '50/50/50'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVoiceToDelete(v);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Delete Voice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Details Pane */}
        <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-6">
          {selectedVoice ? (
            <div className="flex flex-col gap-5 min-w-0">
              <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
                {selectedVoice.name} Profile
              </h3>

              {/* Sliders Display */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Tone Metrics
                </h4>
                
                {/* Sliders */}
                <div className="flex flex-col gap-2.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Formal / Casual</span>
                    <span className="font-bold font-mono">{selectedVoice.tone_sliders?.formal_casual || 50}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safe / Bold</span>
                    <span className="font-bold font-mono">{selectedVoice.tone_sliders?.safe_bold || 50}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Short / Story-driven</span>
                    <span className="font-bold font-mono">{selectedVoice.tone_sliders?.short_story || 50}%</span>
                  </div>
                </div>
              </div>

              {/* Banned Keywords */}
              {selectedVoice.banned_words && selectedVoice.banned_words.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Banned Words
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVoice.banned_words.map((w) => (
                      <Badge key={w} tone="danger">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-400 dark:text-zinc-600 h-64">
              <Volume2 className="w-8 h-8 stroke-1 mb-2 animate-pulse" />
              <p className="text-xs leading-relaxed">Select a Brand Voice from the list to view its configuration.</p>
            </div>
          )}
        </div>
      </div>

      {/* Builder Wizard Modal */}
      <Modal
        open={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title="Create Custom Brand Voice"
        size="lg"
      >
        <div className="flex flex-col gap-6">
          <Stepper steps={steps} active={activeStep} />
          
          <div className="h-px bg-zinc-100 dark:bg-zinc-900 mt-2" />

          {/* Step 1: Details */}
          {activeStep === 0 && (
            <div className="flex flex-col gap-4">
              <Field label="Voice Name" id="name">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Agency Pro Voice"
                />
              </Field>

              <Field
                label="Banned Keywords"
                id="banned-words"
                hint="Comma-separated keywords that the copy generator must avoid."
              >
                <Input
                  id="banned-words"
                  value={bannedWordsInput}
                  onChange={(e) => setBannedWordsInput(e.target.value)}
                  placeholder="e.g. cheap, guarantee, best"
                />
              </Field>
            </div>
          )}

          {/* Step 2: Tone Tuning */}
          {activeStep === 1 && (
            <div className="flex flex-col gap-5">
              <Slider
                label="Formal ↔ Casual"
                value={toneSliders.formal_casual}
                onChange={(v) => setToneSliders(p => ({ ...p, formal_casual: v }))}
                minLabel="Corporate / Structured"
                maxLabel="Conversational / Friendly"
              />

              <Slider
                label="Safe ↔ Bold"
                value={toneSliders.safe_bold}
                onChange={(v) => setToneSliders(p => ({ ...p, safe_bold: v }))}
                minLabel="Professional / Secure"
                maxLabel="Aggressive / Disruptive"
              />

              <Slider
                label="Short ↔ Story-driven"
                value={toneSliders.short_story}
                onChange={(v) => setToneSliders(p => ({ ...p, short_story: v }))}
                minLabel="Direct Bullet Points"
                maxLabel="Narrative / Emotional"
              />
            </div>
          )}

          {/* Step 3: Samples */}
          {activeStep === 2 && (
            <div className="flex flex-col gap-4">
              <Field
                label="Writing Sample 1"
                id="sample1"
                error={sample1 && sample1.length < 200 ? "Sample must be at least 200 characters." : undefined}
                hint={`${sample1.length} characters (minimum 200)`}
              >
                <Input
                  id="sample1"
                  multiline
                  rows={4}
                  value={sample1}
                  onChange={(e) => setSample1(e.target.value)}
                  placeholder="Paste a sample draft representing your brand voice..."
                />
              </Field>

              <Field
                label="Writing Sample 2"
                id="sample2"
                error={sample2 && sample2.length < 200 ? "Sample must be at least 200 characters." : undefined}
                hint={`${sample2.length} characters (minimum 200)`}
              >
                <Input
                  id="sample2"
                  multiline
                  rows={4}
                  value={sample2}
                  onChange={(e) => setSample2(e.target.value)}
                  placeholder="Paste a second sample representing your brand voice..."
                />
              </Field>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevStep}
              disabled={activeStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {activeStep < 2 ? (
              <Button onClick={handleNextStep} variant="primary" size="sm">
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleWizardSubmit} 
                variant="primary" 
                size="sm"
                disabled={sample1.length < 200 || sample2.length < 200}
              >
                Complete Wizard
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!voiceToDelete}
        onClose={() => setVoiceToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Brand Voice?"
        body={`Permanently delete the Brand Voice configuration "${voiceToDelete?.name}"?`}
        confirmLabel="Remove Profile"
      />
    </div>
  );
}
export default BrandVoices;
