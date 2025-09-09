import type { Provider } from '~/locales/providers/schema';

export function getProvidersIndexJsonLd(providers: Provider[], title: string, description: string, canonical?: string) {
  return [
    {
      '@context': 'https://schema.org' as const,
      '@type': 'ItemList' as const,
      name: title,
      description,
      itemListElement: providers.map((p, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        url: canonical ? `${canonical}/${p.slug}` : `/providers/${p.slug}`,
        name: p.name,
      })),
    },
  ];
}

// Explizite JSON-LD Typen mit diskriminierendem '@type'
export type BreadcrumbJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

export type FAQPageJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }>;
};

export type OrganizationJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url?: string;
  sameAs?: string[];
};

export type ProviderDetailJsonLd = Array<BreadcrumbJsonLd | FAQPageJsonLd | OrganizationJsonLd>;

export function getProviderDetailJsonLd(
  p: Provider,
  canonical?: string,
  indexName: string = 'Providers',
  indexUrl?: string,
): ProviderDetailJsonLd {
  const providersIndexUrl = indexUrl
    || (typeof window !== 'undefined' ? `${window.location.origin}/providers` : '/providers');
  const breadcrumb: BreadcrumbJsonLd['itemListElement'] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: indexName,
      item: providersIndexUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: p?.name,
      item: canonical || `/providers/${p?.slug}`,
    },
  ];

  const faqJson: FAQPageJsonLd[] = Array.isArray(p?.faq) && p.faq.length
    ? [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }]
    : [];

  const orgJson: OrganizationJsonLd[] = p?.name
    ? [{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: p.name,
        url: p.website || canonical,
        sameAs: p.docsUrl ? [p.docsUrl] : undefined,
      }]
    : [];

  const breadcrumbJson: BreadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb,
  };

  return [breadcrumbJson, ...faqJson, ...orgJson];
}

