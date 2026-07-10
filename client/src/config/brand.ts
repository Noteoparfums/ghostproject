export const BRAND = {
  name: 'Briefloom',
  shortName: 'Briefloom',
  category: 'Direct-response copy intelligence',
  positioning: 'Weave one clear brief into a coordinated campaign.',
  description:
    'Briefloom helps direct-response teams turn a focused campaign brief into coordinated copy assets.',
  longDescription:
    'Briefloom is a direct-response copy intelligence workspace for shaping campaign context, brand voice, and generated copy into one coherent body of work.',
  support: {
    label: 'Support',
    contactLabel: 'Contact support',
    availability:
      'This operation is not available in the current workspace. Contact support through your existing account channel for help.',
  },
  statusPages: {
    forbidden: {
      title: 'Access denied',
      body: 'This account does not have permission to open the requested workspace.',
    },
    notFound: {
      title: 'Page not found',
      body: 'The page may have moved, or the address may be incomplete.',
    },
    fatalError: {
      title: 'Something went wrong',
      body: 'Briefloom encountered an unexpected application error. Reload the page to try again, or return home.',
    },
  },
  legalReview:
    'Working identity and policy draft. Trademark, domain, company, jurisdiction, and legal counsel review are still required before public launch.',
  metadata: {
    defaultTitle: 'Briefloom — Direct-response copy intelligence',
    description:
      'Turn a focused campaign brief into coordinated direct-response copy with Briefloom.',
    socialImage: '/brand/briefloom-social-preview.svg',
    favicon: '/brand/briefloom-favicon.svg',
  },
  navigation: {
    marketing: [
      { to: '/', label: 'Features' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/about', label: 'About' },
      { to: '/blog', label: 'Blog' },
      { to: '/changelog', label: 'Changelog' },
    ],
    legal: [
      { to: '/legal/privacy', label: 'Privacy Policy' },
      { to: '/legal/terms', label: 'Terms of Service' },
      { to: '/legal/refund', label: 'Refund Policy' },
    ],
  },
} as const;

export type BrandMarkVariant = 'primary' | 'compact' | 'monochrome';

export function formatDocumentTitle(title?: string) {
  if (!title) return BRAND.metadata.defaultTitle;
  if (title.includes(BRAND.name)) return title;
  return `${title} — ${BRAND.name}`;
}

export function canonicalUrl(path: string, origin = window.location.origin) {
  return new URL(path, origin).toString();
}