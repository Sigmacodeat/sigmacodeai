import { useEffect } from 'react';

export type JsonLd = Record<string, unknown>;

export interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  openGraph?: Partial<{
    title: string;
    description: string;
    type: string;
    url: string;
    image: string;
    siteName: string;
  }>;
  twitter?: Partial<{
    card: 'summary' | 'summary_large_image';
    site: string;
    title: string;
    description: string;
    image: string;
  }>;
  jsonLd?: JsonLd[];
}

function upsertMeta(name: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertProperty(property: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, canonical, noindex, openGraph, twitter, jsonLd }: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) upsertMeta('description', description);
    if (canonical) upsertLink('canonical', canonical);
    if (noindex) upsertMeta('robots', 'noindex, nofollow');

    // OpenGraph
    if (openGraph?.title || title) upsertProperty('og:title', openGraph?.title || title || '');
    if (openGraph?.description || description)
      upsertProperty('og:description', openGraph?.description || description || '');
    if (openGraph?.type) upsertProperty('og:type', openGraph.type);
    if (openGraph?.url || canonical) upsertProperty('og:url', openGraph?.url || canonical || '');
    if (openGraph?.image) upsertProperty('og:image', openGraph.image);
    if (openGraph?.siteName) upsertProperty('og:site_name', openGraph.siteName);

    // Twitter
    if (twitter?.card) upsertMeta('twitter:card', twitter.card);
    if (twitter?.site) upsertMeta('twitter:site', twitter.site);
    if (twitter?.title || title) upsertMeta('twitter:title', twitter?.title || title || '');
    if (twitter?.description || description)
      upsertMeta('twitter:description', twitter?.description || description || '');
    if (twitter?.image) upsertMeta('twitter:image', twitter.image);

    // JSON-LD (remove previous ones we own)
    const existing = Array.from(document.head.querySelectorAll('script[data-seo-jsonld="true"]'));
    existing.forEach((n) => n.remove());
    if (jsonLd && jsonLd.length) {
      jsonLd.forEach((obj) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.seoJsonld = 'true';
        script.text = JSON.stringify(obj);
        document.head.appendChild(script);
      });
    }
  }, [title, description, canonical, noindex, openGraph, twitter, JSON.stringify(jsonLd)]);

  return null;
}
