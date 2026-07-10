import { useEffect } from 'react';
import { BRAND, canonicalUrl, formatDocumentTitle } from '../config/brand';

export interface DocumentMetaOptions {
  title: string;
  description?: string;
  canonical?: string;
  og?: {
    type?: string;
    image?: string;
    title?: string;
    description?: string;
  };
  jsonLd?: Record<string, unknown>;
}

export function useDocumentMeta(options: DocumentMetaOptions) {
  const { title, description, canonical, jsonLd, og } = options;
  const ogType = og?.type;
  const ogImage = og?.image;
  const ogTitle = og?.title;
  const ogDescription = og?.description;
  const jsonLdContent = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = formatDocumentTitle(title);

    let descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute('content') || '';
    const resolvedDescription = description || BRAND.metadata.description;
    if (resolvedDescription) {
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', resolvedDescription);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonicalLink?.getAttribute('href') || '';
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      const absoluteUrl = canonical.startsWith('http') ? canonical : canonicalUrl(canonical);
      canonicalLink.setAttribute('href', absoluteUrl);
    }

    const image = ogImage || BRAND.metadata.socialImage;
    const ogTags: { name: string; value: string }[] = [
      { name: 'og:type', value: ogType || 'website' },
      {
        name: 'og:image',
        value: image.startsWith('http') ? image : canonicalUrl(image),
      },
      {
        name: 'og:title',
        value: formatDocumentTitle(ogTitle || title),
      },
      {
        name: 'og:description',
        value: ogDescription || resolvedDescription,
      },
    ];

    const createdOgElements: HTMLMetaElement[] = [];
    const previousOgValues = new Map<HTMLMetaElement, string>();
    ogTags.forEach(({ name, value }) => {
      let ogEl = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
      if (!ogEl) {
        ogEl = document.createElement('meta');
        ogEl.setAttribute('property', name);
        document.head.appendChild(ogEl);
        createdOgElements.push(ogEl);
      } else {
        previousOgValues.set(ogEl, ogEl.getAttribute('content') || '');
      }
      ogEl.setAttribute('content', value);
    });

    let ldScript: HTMLScriptElement | null = null;
    if (jsonLdContent) {
      ldScript = document.createElement('script');
      ldScript.setAttribute('type', 'application/ld+json');
      ldScript.textContent = jsonLdContent;
      document.head.appendChild(ldScript);
    }

    return () => {
      document.title = prevTitle;

      if (descMeta) {
        if (prevDesc) descMeta.setAttribute('content', prevDesc);
        else descMeta.remove();
      }

      if (canonicalLink) {
        if (prevCanonical) canonicalLink.setAttribute('href', prevCanonical);
        else canonicalLink.remove();
      }

      createdOgElements.forEach((el) => el.remove());
      previousOgValues.forEach((value, element) => element.setAttribute('content', value));

      if (ldScript) {
        ldScript.remove();
      }
    };
  }, [title, description, canonical, ogType, ogImage, ogTitle, ogDescription, jsonLdContent]);
}
export default useDocumentMeta;
