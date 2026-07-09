import { useEffect } from 'react';

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
  jsonLd?: Record<string, any>;
}

export function useDocumentMeta(options: DocumentMetaOptions) {
  useEffect(() => {
    // Set title
    const prevTitle = document.title;
    document.title = options.title;

    // Set description
    let descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute('content') || '';
    if (options.description) {
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', options.description);
    }

    // Set canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonicalLink?.getAttribute('href') || '';
    if (options.canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      const absoluteUrl = options.canonical.startsWith('http')
        ? options.canonical
        : window.location.origin + options.canonical;
      canonicalLink.setAttribute('href', absoluteUrl);
    }

    // Set OpenGraph meta tags
    const ogTags: { name: string; value: string }[] = [];
    if (options.og) {
      if (options.og.type) ogTags.push({ name: 'og:type', value: options.og.type });
      if (options.og.image) {
        const absImg = options.og.image.startsWith('http') ? options.og.image : window.location.origin + options.og.image;
        ogTags.push({ name: 'og:image', value: absImg });
      }
      ogTags.push({ name: 'og:title', value: options.og.title || options.title });
      if (options.og.description || options.description) {
        ogTags.push({ name: 'og:description', value: options.og.description || options.description || '' });
      }
    }

    const createdOgElements: HTMLMetaElement[] = [];
    ogTags.forEach(({ name, value }) => {
      let ogEl = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
      if (!ogEl) {
        ogEl = document.createElement('meta');
        ogEl.setAttribute('property', name);
        document.head.appendChild(ogEl);
        createdOgElements.push(ogEl);
      }
      ogEl.setAttribute('content', value);
    });

    // Set JSON-LD script
    let ldScript: HTMLScriptElement | null = null;
    if (options.jsonLd) {
      ldScript = document.createElement('script');
      ldScript.setAttribute('type', 'application/ld+json');
      ldScript.textContent = JSON.stringify(options.jsonLd);
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

      if (ldScript) {
        ldScript.remove();
      }
    };
  }, [options.title, options.description, options.canonical, JSON.stringify(options.og), JSON.stringify(options.jsonLd)]);
}
export default useDocumentMeta;
