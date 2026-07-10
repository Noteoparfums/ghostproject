import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import HeroSection from '../../components/marketing/HeroSection';
import WorkflowSection from '../../components/marketing/WorkflowSection';
import CapabilitySection from '../../components/marketing/CapabilitySection';
import PricingPreview from '../../components/marketing/PricingPreview';
import FinalCTA from '../../components/marketing/FinalCTA';

export function LandingRedesign() {
  useDocumentMeta({
    title: 'Briefloom — One brief. A complete campaign.',
    description: 'Turn one focused campaign brief into coordinated direct-response copy with Briefloom.',
    canonical: '/',
  });

  return (
    <div className="overflow-hidden bg-[var(--color-canvas)] text-[var(--color-text-default)]">
      <HeroSection />
      <WorkflowSection />
      <CapabilitySection />
      <PricingPreview />
      <FinalCTA />
    </div>
  );
}

export default LandingRedesign;