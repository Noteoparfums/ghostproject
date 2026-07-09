import EditorialLayout, { EditorialSection } from '../../components/marketing/EditorialLayout';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function About() {
  useDocumentMeta({
    title: 'About',
    description: 'Why Briefloom brings campaign context and coordinated copy into one workspace.',
    canonical: '/about',
  });

  return (
    <EditorialLayout
      eyebrow="About Briefloom"
      title="Campaign context deserves a place to live."
      intro="Briefloom is a working product identity for a direct-response copy workspace built around a simple premise: the strongest assets share one clear strategic thread."
    >
      <EditorialSection title="Why it exists">
        <p>Copy teams often spread the same campaign across disconnected prompts, documents, and tools. Audience insight gets shortened, proof gets lost, and the call to action drifts.</p>
        <p>Briefloom keeps projects, brand voice, generation context, and campaign outputs together so teams can review the work as one connected system.</p>
      </EditorialSection>
      <EditorialSection title="What it does today">
        <p>The current product supports project organization, reusable brand voice profiles, coordinated funnel generation, campaign history summaries, credits, and provider-managed billing.</p>
        <p>Generated copy is a draft, not a performance guarantee. Every output should be reviewed for accuracy, claims, brand fit, and legal compliance before publication.</p>
      </EditorialSection>
      <EditorialSection title="Working identity">
        <p>Briefloom has passed only a lightweight exact-name screen. Trademark, domain, company-name, jurisdiction, and legal-counsel review remain required before public launch.</p>
      </EditorialSection>
    </EditorialLayout>
  );
}

export default About;