import EditorialLayout, { EditorialSection } from '../../components/marketing/EditorialLayout';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export function Blog() {
  useDocumentMeta({
    title: 'Field Notes',
    description: 'Briefloom field notes will publish practical guidance when editorial work is ready.',
    canonical: '/blog',
  });
  return (
    <EditorialLayout
      eyebrow="Field notes"
      title="No filler. No invented archive."
      intro="There are no published articles yet. When this space opens, it will contain practical notes on campaign briefs, brand voice, and reviewing generated copy."
    >
      <EditorialSection title="What to expect">
        <p>Editorial guidance will be published only after it has been reviewed and is useful enough to keep. Until then, the product workspace remains the primary Briefloom experience.</p>
      </EditorialSection>
    </EditorialLayout>
  );
}

export default Blog;