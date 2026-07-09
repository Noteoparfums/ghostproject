import EditorialLayout, { EditorialSection } from '../../components/marketing/EditorialLayout';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function Changelog() {
  useDocumentMeta({
    title: 'Changelog',
    description: 'Verified Briefloom product updates will appear here when release notes are published.',
    canonical: '/changelog',
  });
  return (
    <EditorialLayout
      eyebrow="Product updates"
      title="Release notes will begin with a verified release."
      intro="Briefloom does not yet have a public release history. This page will list dated, verifiable changes when public release notes are available."
    >
      <EditorialSection title="Current availability">
        <p>The workspace currently includes projects, brand voice profiles, campaign generation, history summaries, account credits, and provider-managed billing.</p>
      </EditorialSection>
    </EditorialLayout>
  );
}

export default Changelog;