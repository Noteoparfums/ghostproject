import EditorialLayout, { EditorialSection } from '../../components/marketing/EditorialLayout';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function Terms() {
  useDocumentMeta({ title: 'Terms of Service', canonical: '/legal/terms' });
  return (
    <EditorialLayout legal eyebrow="Legal draft" title="Terms of Service" intro="These working terms describe responsible use of the current Briefloom service.">
      <EditorialSection title="Service and accounts">
        <p>You are responsible for maintaining account security and for the briefs, examples, instructions, and other material submitted through your account.</p>
      </EditorialSection>
      <EditorialSection title="Generated copy">
        <p>Generated content is provided as a draft. You remain responsible for reviewing accuracy, substantiation, intellectual-property concerns, advertising claims, privacy obligations, and legal compliance before use.</p>
      </EditorialSection>
      <EditorialSection title="Billing and availability">
        <p>Paid plans and top-ups are processed through the configured billing provider. Service features and availability may change. Final company identity, governing law, liability terms, dispute process, and termination language require counsel review.</p>
      </EditorialSection>
    </EditorialLayout>
  );
}

export default Terms;