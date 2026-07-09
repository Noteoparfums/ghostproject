import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Layers3,
  MessageSquareText,
  MousePointer2,
  Play,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import BrandMark from '../../components/brand/BrandMark';

const outputs = [
  { label: 'Ad hooks', count: '12 variations', icon: MousePointer2 },
  { label: 'Sales page', count: '1 complete draft', icon: FileText },
  { label: 'Email sequence', count: '7 coordinated emails', icon: MessageSquareText },
];

const steps = [
  ['01', 'Shape the brief', 'Capture the offer, audience, proof, objections, and desired action in one focused workspace.'],
  ['02', 'Choose the voice', 'Apply a reusable brand voice so every asset sounds recognizably yours—not generically AI.'],
  ['03', 'Weave the campaign', 'Generate coordinated hooks, pages, scripts, and emails that share one strategic thread.'],
];

export function LandingRedesign() {
  const [demoOpen, setDemoOpen] = useState(false);

  useDocumentMeta({
    title: 'Briefloom — One brief. A complete campaign.',
    description: 'Turn one focused campaign brief into coordinated direct-response copy with Briefloom.',
    canonical: '/',
  });

  return (
    <div className="overflow-hidden bg-[#f7f3eb] text-[#1e2c27] dark:bg-[#17211d] dark:text-[#f8f3e9]">
      <section className="relative border-b border-[#dcd3c5] px-6 pb-20 pt-20 dark:border-[#374a42] lg:pb-28 lg:pt-28">
        <div className="paper-grid absolute inset-0 opacity-55" />
        <div className="absolute -right-28 top-8 h-96 w-96 rounded-full bg-[#d6a84b]/15 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#b9573b]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.03fr_.97fr]">
          <div>
            <div className="eyebrow mb-7 flex items-center gap-2 text-[#9f4933] dark:text-[#e58b70]">
              <span className="h-px w-7 bg-current" />
              Direct-response copy intelligence
            </div>
            <h1 className="font-display max-w-3xl text-[clamp(3.5rem,7vw,6.8rem)] leading-[0.9] text-[#1f3029] dark:text-[#fffaf0]">
              One clear brief.
              <span className="block italic text-[#b9573b] dark:text-[#d8795c]">A campaign that holds.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#637069] dark:text-[#b7c0ba] sm:text-lg">
              Briefloom turns campaign context into coordinated ads, sales pages, scripts, and emails—so every asset pulls in the same direction.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/signup">
                <Button size="lg">
                  Weave your first campaign <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" onClick={() => setDemoOpen(true)}>
                <Play className="h-4 w-4 fill-current" /> See the workflow
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#6f766f] dark:text-[#aeb8b2]">
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#b9573b]" /> No card required</span>
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#b9573b]" /> 5 free credits</span>
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#b9573b]" /> Cancel anytime</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rotate-2 rounded-[2rem] border border-[#cfc4b5] bg-[#e8dfd1] dark:border-[#3d5048] dark:bg-[#263730]" />
            <div className="surface-card relative overflow-hidden rounded-[1.6rem]">
              <div className="flex items-center justify-between border-b border-[#e0d8cc] px-5 py-4 dark:border-[#374a42]">
                <div className="flex items-center gap-3">
                  <BrandMark className="h-7 w-7" />
                  <div>
                    <p className="text-xs font-bold">Spring offer campaign</p>
                    <p className="text-[10px] text-[#81867f]">Campaign brief · Ready</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#e6eee7] px-2.5 py-1 text-[10px] font-bold text-[#486753] dark:bg-[#2e493d] dark:text-[#a8d0b6]">Coherent</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[1fr_1.12fr]">
                <div className="rounded-2xl bg-[#f3eee5] p-4 dark:bg-[#263730]">
                  <p className="eyebrow text-[#8c7865] dark:text-[#b5a38f]">The brief</p>
                  <div className="mt-4 space-y-4">
                    {['Audience', 'Core promise', 'Proof points', 'Desired action'].map((item, index) => (
                      <div key={item}>
                        <div className="mb-1.5 flex justify-between text-[10px] font-semibold">
                          <span>{item}</span><span className="text-[#a4a49d]">{index === 2 ? '3 added' : 'Defined'}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#ddd4c7] dark:bg-[#3b4d45]">
                          <div className="h-full rounded-full bg-[#b9573b]" style={{ width: `${88 - index * 8}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="eyebrow text-[#8c7865] dark:text-[#b5a38f]">Campaign outputs</p>
                    <WandSparkles className="h-4 w-4 text-[#b9573b]" />
                  </div>
                  <div className="space-y-2.5">
                    {outputs.map(({ label, count, icon: Icon }, index) => (
                      <div key={label} className="flex items-center gap-3 rounded-xl border border-[#e2d9cc] bg-white/70 p-3 dark:border-[#3b4d45] dark:bg-[#1d2b26]">
                        <div className={`rounded-lg p-2 ${index === 1 ? 'bg-[#f2e0d8] text-[#a84931]' : 'bg-[#e9e5d5] text-[#61705f]'} dark:bg-[#34463e]`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold">{label}</p>
                          <p className="text-[10px] text-[#858a84]">{count}</p>
                        </div>
                        <Check className="h-4 w-4 text-[#5f8469]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-[#e0d8cc] bg-[#f5efe6] px-5 py-3 dark:border-[#374a42] dark:bg-[#22312b]">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#69736d] dark:text-[#adb8b1]">
                  <Sparkles className="h-3.5 w-3.5 text-[#b9573b]" />
                  All assets share one promise, voice, and call to action.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="eyebrow text-[#b9573b]">A better way to create</p>
              <h2 className="font-display mt-4 text-5xl leading-[0.98] sm:text-6xl">From scattered prompts to one strategic thread.</h2>
            </div>
            <div className="grid gap-3">
              {steps.map(([number, title, body]) => (
                <div key={number} className="group grid gap-4 rounded-2xl border border-[#dcd3c5] bg-[#fffdf8]/70 p-6 transition hover:-translate-y-0.5 hover:bg-[#fffdf8] dark:border-[#374a42] dark:bg-[#1e2c27]/70 sm:grid-cols-[52px_1fr_auto] sm:items-center">
                  <span className="font-display text-2xl italic text-[#b9573b]">{number}</span>
                  <div>
                    <h3 className="text-base font-bold">{title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#727a74] dark:text-[#aeb8b2]">{body}</p>
                  </div>
                  <ChevronRight className="hidden h-5 w-5 text-[#b4aa9d] transition group-hover:translate-x-1 sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#263b33] px-6 py-20 text-[#f8f3e9] dark:bg-[#101915] lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="eyebrow text-[#d6a84b]">What the workspace keeps together</p>
            <h2 className="font-display mt-5 text-4xl leading-tight sm:text-5xl">
              One audience, one promise, one campaign context.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#b9c5be]">
              Briefloom keeps project context, brand voice, and generated campaign copy in the same workflow. Results still require human review before publication.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-7">
            <Layers3 className="h-7 w-7 text-[#d8795c]" />
            <p className="mt-6 text-lg font-bold">Available today</p>
            <ul className="mt-4 space-y-3 text-sm text-[#b9c5be]">
              <li>Project-based campaign organization</li>
              <li>Reusable brand voice profiles</li>
              <li>Coordinated funnel generation</li>
              <li>Campaign history summaries</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center lg:py-28">
        <div className="mx-auto max-w-3xl">
          <BrandMark className="mx-auto h-12 w-12" />
          <h2 className="font-display mt-6 text-5xl leading-none sm:text-6xl">Make the whole campaign feel inevitable.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6f766f] dark:text-[#aeb8b2]">Start with one clear brief. Leave with a connected body of copy ready to refine, review, and launch.</p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button size="lg">Start creating free <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      <Modal open={demoOpen} onClose={() => setDemoOpen(false)} title="The Briefloom workflow" size="lg">
        <div className="space-y-4">
          {steps.map(([number, title, body]) => (
            <div key={number} className="flex gap-4 rounded-2xl border border-[#dcd3c5] p-4 dark:border-[#374a42]">
              <span className="font-display text-xl italic text-[#b9573b]">{number}</span>
              <div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>
            </div>
          ))}
          <Link to="/signup" className="block pt-2"><Button className="w-full">Build your first campaign</Button></Link>
        </div>
      </Modal>
    </div>
  );
}

export default LandingRedesign;