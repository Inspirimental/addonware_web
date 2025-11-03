import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SITE_NAME = 'Addonware';
const DEFAULT_TITLE = 'Addonware - Digitale Transformation & IT-Beratung';
const DEFAULT_DESCRIPTION = 'Experten für digitale Transformation, IT-Strategie und Compliance. Wir unterstützen Unternehmen bei der Digitalisierung und Optimierung ihrer IT-Infrastruktur.';
const DEFAULT_IMAGE = 'https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/heroimage_og.jpg';
const SITE_URL = 'https://www.addonware.de';

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
  structuredData,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);
    if (author) updateMeta('author', author);

    if (noindex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow');
    }

    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', fullImage, true);
    updateMeta('og:image:secure_url', fullImage, true);
    updateMeta('og:image:type', 'image/jpeg', true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:image:alt', fullTitle, true);
    updateMeta('og:url', fullUrl, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:locale', 'de_DE', true);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', fullImage);
    updateMeta('twitter:image:alt', fullTitle);

    if (publishedTime) {
      updateMeta('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      updateMeta('article:modified_time', modifiedTime, true);
    }

    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');

      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }

      scriptElement.textContent = JSON.stringify(structuredData);
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', fullUrl);
    if (!canonicalLink.parentElement) {
      document.head.appendChild(canonicalLink);
    }
  }, [fullTitle, description, keywords, fullImage, fullUrl, type, author, publishedTime, modifiedTime, noindex, structuredData]);

  return null;
};
