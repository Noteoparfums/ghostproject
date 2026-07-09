import { useState, useEffect, useRef } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useConsent } from '../../contexts/ConsentContext';
import { track } from '../../lib/analytics';
import { billingApi } from '../../api/endpoints/billing';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Accordion from '../../components/ui/Accordion';
import { Sparkles, Terminal, Play, CheckCircle, ArrowRight, ShieldCheck, Mail, Star, Quote } from 'lucide-react';
import { cn } from '../../lib/cn';

// Sample VSL Hook strings for typewriter terminal
const VSL_HOOKS = [
  "Why 93% of Facebook ads fail before spending $100...",
  "The hidden mechanism that generated $2.4M in 45 days...",
  "What top digital agencies never tell you about copywriting...",
  "How to command premium prices without speaking on the phone..."
];

export function Landing() {
  useDocumentMeta({
    title: 'Ghostwriter OS — AI Direct Response Funnel Builder',
    description: 'The next-generation AI platform for direct response marketing copy. Build VSL scripts, ad hooks, and email funnels instantly.',
    canonical: '/',
  });

  const { openPreferences } = useConsent();
  const reducedMotion = useReducedMotion();
  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [hookText, setHookText] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoOutput, setDemoOutput] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Fetch plans from backend for billing options
  const { data: billingState } = useApi(() => billingApi.state());
  const plans = [
    { name: 'Starter', slug: 'free', price: 0, credits: 5, features: ['5 monthly credits', 'VSL Funnel Builder', 'Standard AI Engine'] },
    { name: 'Pro Suite', slug: 'pro', price: 49, credits: 50, features: ['50 monthly credits', 'All Funnel Types', 'Custom Brand Voice profiles', 'Priority Support'] },
    { name: 'Agency Scale', slug: 'agency', price: 199, credits: 250, features: ['250 monthly credits', 'Team seats (up to 5)', 'Advanced API Access', 'Custom AI Model Fine-tuning'] }
  ];

  // 1. Self-driving Typewriter Terminal Mock
  useEffect(() => {
    if (reducedMotion) {
      setHookText(VSL_HOOKS[activeHookIndex] || '');
      return;
    }

    let isCancelled = false;
    let charIndex = 0;
    const currentFullText = VSL_HOOKS[activeHookIndex] || '';

    const type = () => {
      if (isCancelled) return;
      setHookText(currentFullText.slice(0, charIndex));
      charIndex++;

      if (charIndex <= currentFullText.length) {
        setTimeout(type, 60);
      } else {
        // Wait 3 seconds, then cycle to next hook
        setTimeout(() => {
          if (isCancelled) return;
          erase();
        }, 3000);
      }
    };

    const erase = () => {
      if (isCancelled) return;
      setHookText(currentFullText.slice(0, charIndex));
      charIndex--;

      if (charIndex >= 0) {
        setTimeout(erase, 30);
      } else {
        // Move to next hook
        setActiveHookIndex((prev) => (prev + 1) % VSL_HOOKS.length);
      }
    };

    // Start typing
    type();

    return () => {
      isCancelled = true;
    };
  }, [activeHookIndex, reducedMotion]);

  // 2. Watch Demo Sequence (Auto-playing simulated workspace)
  const runDemoSimulation = () => {
    setIsDemoPlaying(true);
    setDemoStep(0);
    setDemoOutput('');
    track('demo_modal_opened');
  };

  useEffect(() => {
    if (!isDemoPlaying) return;

    let timer: number;
    const steps = [
      { text: "Analyzing audience pain points and brand criteria...", delay: 1500 },
      { text: "Mapping structure to AIDA copywriting framework...", delay: 1500 },
      { text: "Writing hook combinations with Eugene Schwartz Stage-3 awareness...", delay: 2000 },
      { text: "[VSL AD HOOK 1]\n\"If you are still scaling ads using basic retargeting lookalike audiences in 2026, stop. The iOS privacy overrides killed that. Here is the AI-driven targeting loop that took a bootstrapped brand to $100k/mo...\"\n\n[VSL HOOK 2]\n\"Inside the vault: The three-part hook script that turned a cold traffic product video into a 4.8x ROAS powerhouse. Best part? It takes under 3 minutes to film...\"", delay: 3000 }
    ];

    const runStep = (idx: number) => {
      if (idx >= steps.length) {
        setIsDemoPlaying(false);
        return;
      }
      setDemoStep(idx);
      setDemoOutput((prev) => prev + (prev ? '\n\n' : '') + `> ${steps[idx]?.text}`);
      
      timer = window.setTimeout(() => {
        runStep(idx + 1);
      }, steps[idx]?.delay);
    };

    runStep(0);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDemoPlaying]);

  // 3. Testimonials Carousel State
  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Agency Founder', content: 'Ghostwriter OS cut our copy-drafting time from 4 days to 15 minutes. The funnel coherence across hooks and emails is unmatched.', rating: 5 },
    { name: 'Marcus Chen', role: 'Direct Response Marketer', content: 'The AIDA mapping is spot-on. We ran an split test comparing our top writer with Ghostwriter Pro and the AI out-converted them by 12%.', rating: 5 },
    { name: 'Elena Rostova', role: 'eCommerce Manager', content: 'Having all assets generated side-by-side in one cohesive sequence saves us hours of cross-copying. Absolutely brilliant.', rating: 5 }
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 4. Newsletter Sign Up Form
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    track('newsletter_subscribed');
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 select-none">
      {/* Hero section */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Abstract background blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold mb-6 animate-pulse select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Copy Engine</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Write High-Converting Marketing Funnels in Seconds
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Ghostwriter OS synthesizes ad hooks, VSL scripts, landing pages, and email sequences into unified campaigns that convert cold traffic.
        </p>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center select-none">
          <Button 
            onClick={() => window.location.href = '/signup'} 
            variant="primary" 
            size="lg"
            className="group"
          >
            Start For Free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            onClick={() => {
              setIsVideoModalOpen(true);
              runDemoSimulation();
            }} 
            variant="secondary" 
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Simulation
          </Button>
        </div>

        {/* Typewriter Terminal Mockup */}
        <div className="w-full max-w-3xl mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl overflow-hidden text-left font-mono text-sm leading-relaxed backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800/80">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-[11px] text-zinc-500 font-bold ml-2">vsl_hook_engine.py</span>
          </div>
          {/* Body */}
          <div className="p-6 h-[120px] flex items-center select-text">
            <span className="text-blue-400 mr-2 shrink-0">&gt;</span>
            <span className="text-zinc-200">
              {hookText}
              <span className="inline-block w-1.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
            </span>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 select-none">
            <h2 className="text-3xl font-extrabold tracking-tight">Engine Features</h2>
            <p className="mt-4 text-sm text-zinc-400">Direct response frameworks structured for performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-xs flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500 w-fit">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">Typewriter Streams</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Watch copy draft dynamically using our optimized rAF renderer preventing interface locking during SSE streaming.</p>
            </div>
            
            {/* Box 2 */}
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-xs flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-500 w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">CopyScore Rating</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Every asset is automatically evaluated across hook strength, readability levels, and CTA presence, surfacing detailed sub-scores.</p>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-xs flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-500 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">Tone Sliders</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Tweak voice profiles with precision variables representing casual, story-driven, or bold angles using sliders mapped to custom models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 text-center select-none">
          <Quote className="w-10 h-10 text-blue-500 mx-auto mb-6 opacity-40" />
          
          <div className="h-[120px] flex items-center justify-center">
            <p className="text-lg md:text-xl italic text-zinc-300 max-w-3xl leading-relaxed select-text">
              "{testimonials[activeTestimonial]?.content}"
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <span className="font-bold text-sm dark:text-zinc-100 text-zinc-200">
              {testimonials[activeTestimonial]?.name}
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">
              {testimonials[activeTestimonial]?.role}
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 justify-center mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  activeTestimonial === idx ? 'bg-blue-500 px-3' : 'bg-zinc-800'
                )}
                aria-label={`Testimonial slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 select-none">
            <h2 className="text-3xl font-extrabold tracking-tight">Flexible Plans</h2>
            <p className="mt-4 text-sm text-zinc-400">Scale campaigns with modular credit bounds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div 
                key={p.slug}
                className={cn(
                  'p-8 rounded-2xl border flex flex-col gap-6 bg-zinc-900/10 backdrop-blur-xs select-none',
                  p.slug === 'pro' ? 'border-blue-600/50 shadow-lg shadow-blue-500/5' : 'border-zinc-900'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100">{p.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{p.credits} credits</p>
                  </div>
                  {p.slug === 'pro' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${p.price}</span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>

                <div className="h-px bg-zinc-900" />

                <ul className="flex-1 flex flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => window.location.href = `/signup?plan=${p.slug}`}
                  variant={p.slug === 'pro' ? 'primary' : 'secondary'}
                  className="w-full mt-4"
                >
                  Choose {p.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 select-none">
            <h2 className="text-3xl font-extrabold tracking-tight">Common Questions</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <Accordion title="How do credits work?">
              Each campaign generation charges 1 credit. Single section regenerations cost 0.25 credits, and A/B hook variant generations cost 0.10 credits. Top-up packs are available.
            </Accordion>
            <Accordion title="What copywriting frameworks do you use?">
              Our engines map inputs to frameworks like AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitate, Solve), and Hook-Story-Offer sequences.
            </Accordion>
            <Accordion title="Can I cancel my subscription at any time?">
              Yes. You can cancel directly inside the billing portal, keeping active plan benefits until your monthly billing period ends.
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer Newsletter band */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/80">
        <div className="max-w-3xl mx-auto px-6 text-center select-none">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-4 opacity-40" />
          <h3 className="text-xl font-bold dark:text-zinc-100 text-zinc-200">
            Subscribe to copywriting updates
          </h3>
          <p className="mt-2 text-xs text-zinc-400 max-w-sm mx-auto">
            Get conversion tips and engine model releases directly in your inbox.
          </p>

          {newsletterSubmitted ? (
            <div className="mt-6 p-4 rounded-xl bg-blue-600/10 text-blue-400 font-semibold text-xs border border-blue-500/20 max-w-md mx-auto">
              ✓ Check your inbox to confirm subscription.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="mt-6 flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 rounded-xl text-xs dark:bg-zinc-900 border dark:border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Button type="submit" variant="primary" size="sm">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Watch Demo Simulated Workspace Modal */}
      <Modal
        open={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setIsDemoPlaying(false);
        }}
        title="Simulated Workspace Generation"
        size="lg"
      >
        <div className="flex flex-col gap-4 font-mono text-xs select-none">
          <p className="text-zinc-400 mb-2 font-sans">
            Here is a simulation of the copy funnel compilation process starting.
          </p>

          {/* Simulated progress tracker */}
          <div className="p-4 rounded-xl border dark:border-zinc-900 border-zinc-200 bg-zinc-50 dark:bg-zinc-900/20 flex flex-col gap-2">
            <div className="flex justify-between items-center font-bold">
              <span>Pipeline Stage: {demoStep === 3 ? "Done" : `Step ${demoStep + 1}/4`}</span>
              <span className="text-blue-500">
                {demoStep === 0 && "10%"}
                {demoStep === 1 && "30%"}
                {demoStep === 2 && "60%"}
                {demoStep === 3 && "100%"}
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500" 
                style={{ 
                  width: demoStep === 0 ? '10%' : demoStep === 1 ? '30%' : demoStep === 2 ? '60%' : '100%' 
                }}
              />
            </div>
          </div>

          {/* Simulation Output Terminal */}
          <div className="p-5 rounded-xl border dark:border-zinc-900 border-zinc-200 bg-zinc-950 h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text text-zinc-300">
            {demoOutput}
            {isDemoPlaying && <span className="inline-block w-1 h-3.5 bg-blue-500 animate-pulse ml-0.5" />}
          </div>

          <div className="flex justify-end mt-2 font-sans">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                setIsVideoModalOpen(false);
                setIsDemoPlaying(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Landing;
