import { getProvidersIndexJsonLd, getProviderDetailJsonLd } from '../providers';

describe('seo/providers json-ld helpers', () => {
  const providers = [
    { slug: 'openai', name: 'OpenAI' },
    { slug: 'anthropic', name: 'Anthropic' },
  ] as any[];

  // Hilfstypen für typsicheres Narrowing der JSON-LD-Union aus getProviderDetailJsonLd
  type AnyJsonLd = ReturnType<typeof getProviderDetailJsonLd>[number];
  type FAQJsonLd = Extract<AnyJsonLd, { '@type': 'FAQPage' }>; // enthält mainEntity
  type OrgJsonLd = Extract<AnyJsonLd, { '@type': 'Organization' }>; // enthält name/url/sameAs
  type BreadcrumbJsonLd = Extract<AnyJsonLd, { '@type': 'BreadcrumbList' }>; // enthält itemListElement

  const isFAQ = (x: AnyJsonLd): x is FAQJsonLd => x['@type'] === 'FAQPage';
  const isOrg = (x: AnyJsonLd): x is OrgJsonLd => x['@type'] === 'Organization';
  const isBreadcrumb = (x: AnyJsonLd): x is BreadcrumbJsonLd => x['@type'] === 'BreadcrumbList';

  test('getProvidersIndexJsonLd builds ItemList with canonical URLs', () => {
    const title = 'LLM Provider';
    const description = 'Übersicht';
    const canonical = 'https://example.com/providers';
    const jsonLd = getProvidersIndexJsonLd(providers as any, title, description, canonical);

    expect(Array.isArray(jsonLd)).toBe(true);
    expect(jsonLd[0]['@type']).toBe('ItemList');
    expect(jsonLd[0].name).toBe(title);
    expect(jsonLd[0].description).toBe(description);

    const items = jsonLd[0].itemListElement;
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ '@type': 'ListItem', position: 1, url: `${canonical}/openai`, name: 'OpenAI' });
    expect(items[1]).toMatchObject({ '@type': 'ListItem', position: 2, url: `${canonical}/anthropic`, name: 'Anthropic' });
  });

  test('getProviderDetailJsonLd builds BreadcrumbList, FAQ and Organization', () => {
    const p: any = {
      slug: 'openai',
      name: 'OpenAI',
      website: 'https://openai.com',
      docsUrl: 'https://platform.openai.com/docs',
      faq: [
        { q: 'What is it?', a: 'A provider' },
        { q: 'How to use?', a: 'Via API' },
      ],
    };
    const canonical = 'https://example.com/providers/openai';
    const jsonLd = getProviderDetailJsonLd(p, canonical, 'LLM Provider', 'https://example.com/providers');

    expect(Array.isArray(jsonLd)).toBe(true);
    const breadcrumb = jsonLd.find(isBreadcrumb)!;
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement[0]).toMatchObject({ name: 'LLM Provider', item: 'https://example.com/providers' });
    expect(breadcrumb.itemListElement[1]).toMatchObject({ name: 'OpenAI', item: canonical });

    const faq = jsonLd.find(isFAQ)!; // existiert, da p.faq gesetzt ist
    expect(faq).toBeTruthy();
    expect(faq.mainEntity).toHaveLength(2);
    expect(faq.mainEntity[0]).toMatchObject({ '@type': 'Question', name: 'What is it?' });

    const org = jsonLd.find(isOrg)!;
    expect(org).toBeTruthy();
    expect(org).toMatchObject({ name: 'OpenAI', url: 'https://openai.com' });
    expect(org.sameAs).toEqual(['https://platform.openai.com/docs']);
  });

  test('getProvidersIndexJsonLd builds ItemList with relative URLs when no canonical is provided', () => {
    const title = 'LLM Provider';
    const description = 'Übersicht';
    const jsonLd = getProvidersIndexJsonLd(providers as any, title, description);

    expect(Array.isArray(jsonLd)).toBe(true);
    expect(jsonLd[0]['@type']).toBe('ItemList');
    const items = jsonLd[0].itemListElement;
    expect(items[0]).toMatchObject({ url: `/providers/openai` });
    expect(items[1]).toMatchObject({ url: `/providers/anthropic` });
  });

  test('getProviderDetailJsonLd without faq and name yields only BreadcrumbList', () => {
    const p: any = {
      slug: 'mistral',
      website: undefined,
      docsUrl: undefined,
      faq: undefined,
    };
    const canonical = 'https://example.com/providers/mistral';
    const jsonLd = getProviderDetailJsonLd(p, canonical, 'LLM Provider', 'https://example.com/providers');

    expect(Array.isArray(jsonLd)).toBe(true);
    // Breadcrumb vorhanden
    const breadcrumb = jsonLd.find((x) => x['@type'] === 'BreadcrumbList');
    expect(breadcrumb).toBeTruthy();
    // Keine FAQ, keine Organization
    expect(jsonLd.find((x) => x['@type'] === 'FAQPage')).toBeUndefined();
    expect(jsonLd.find((x) => x['@type'] === 'Organization')).toBeUndefined();
  });
});

