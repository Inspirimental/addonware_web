export const generateServiceStructuredData = (service: {
  name: string;
  description: string;
  url: string;
  provider?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "url": service.url,
  "provider": {
    "@type": "Organization",
    "name": service.provider || "Addonware",
    "url": "https://addonware.de"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Germany"
  }
});

export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Person",
    "name": article.author || "Addonware Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Addonware",
    "logo": {
      "@type": "ImageObject",
      "url": "https://addonware.de/addonware%20Logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

export const generatePersonStructuredData = (person: {
  name: string;
  jobTitle: string;
  description?: string;
  email?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.name,
  "jobTitle": person.jobTitle,
  "description": person.description,
  "email": person.email,
  "image": person.image,
  "worksFor": {
    "@type": "Organization",
    "name": "Addonware"
  }
});
