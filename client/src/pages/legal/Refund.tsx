import EditorialLayout, { EditorialSection } from '../../components/marketing/EditorialLayout';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function Refund() {
  useDocumentMeta({ title: 'Refund Policy', canonical: '/legal/refund' });
  return (
    <EditorialLayout legal eyebrow="Legal draft" title="Refund Policy" intro="Refund submission is not currently available inside the Briefloom workspace.">
      <EditorialSection title="How to ask for help">
        <p>Contact support through your existing account channel with the invoice number, purchase date, and a brief explanation. A request is not an automatic approval.</p>
      </EditorialSection>
      <EditorialSection title="Provider processing">
        <p>Any approved reversal is processed through the configured payment provider and may take additional time to appear. Eligibility, exclusions, statutory rights, and response timelines require company and jurisdiction-specific legal review.</p>
      </EditorialSection>
    </EditorialLayout>
  );
}

export default Refund;