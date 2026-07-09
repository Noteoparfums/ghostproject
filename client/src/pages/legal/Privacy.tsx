import EditorialLayout, { EditorialSection } from '../../components/marketing/EditorialLayout';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function Privacy() {
  useDocumentMeta({ title: 'Privacy Policy', canonical: '/legal/privacy' });
  return (
    <EditorialLayout legal eyebrow="Legal draft" title="Privacy Policy" intro="This draft explains how the current Briefloom workspace handles account and product data.">
      <EditorialSection title="Information used by the service">
        <p>The service may process account identity, authentication state, campaign briefs, projects, brand voice settings, generated copy, billing-provider references, consent choices, and technical request information needed to operate and secure the product.</p>
      </EditorialSection>
      <EditorialSection title="Purpose and retention">
        <p>Information is used to provide requested product functions, maintain account security, process provider billing, diagnose failures, and understand product performance where optional consent permits.</p>
        <p>Final retention periods, controller identity, legal bases, subprocessors, international-transfer terms, and jurisdiction-specific rights require company and legal review.</p>
      </EditorialSection>
      <EditorialSection title="Your choices">
        <p>You can configure optional cookie consent from the cookie preferences control. Account-data requests must currently be made through your existing support channel.</p>
      </EditorialSection>
    </EditorialLayout>
  );
}

export default Privacy;