import { useEffect } from 'react';

export type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: object | object[];
  keywords?: string[];
  robots?: string; // e.g. "index,follow"
  openGraph?: {
    title?: string;
    description?: string;
    type?: 'website' | 'article' | 'product' | 'profile' | string;
    url?: string; // absolute
    image?: string; // absolute
    siteName?: string;
    locale?: string; // en_US
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string; // @handle
    creator?: string; // @handle
    title?: string;
    description?: string;
    image?: string; // absolute
  };
  alternates?: Array<{ hrefLang: string; href: string }>; // hreflang links (absolute urls)
};

/**
 * Lightweight SEO component without external deps.
 * - Sets document.title
 * - Injects meta description, keywords, canonical link
 * - Injects JSON-LD (one or multiple scripts)
 */
export default function SEO({ title, description, canonical, jsonLd, keywords, robots, openGraph, twitter, alternates }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const metaDesc = ensureTag('meta', 'name', 'description');
    if (description) metaDesc.setAttribute('content', description);

    const metaKeywords = ensureTag('meta', 'name', 'keywords');
    if (keywords?.length) metaKeywords.setAttribute('content', keywords.join(', '));

    if (robots) {
      const metaRobots = ensureTag('meta', 'name', 'robots');
      metaRobots.setAttribute('content', robots);
    }

    const linkCanonical = ensureTag('link', 'rel', 'canonical');
    if (canonical) {
      const href = canonical.startsWith('http')
        ? canonical
        : `${window.location.origin}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
      linkCanonical.setAttribute('href', href);
    }

    // hreflang alternates
    const createdAlternateLinks: HTMLLinkElement[] = [];
    if (alternates?.length) {
      alternates.forEach((alt) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', alt.hrefLang);
        link.setAttribute('href', alt.href);
        document.head.appendChild(link);
        createdAlternateLinks.push(link);
      });
    }

    // Open Graph
    if (openGraph) {
      setOg('og:title', openGraph.title || title);
      setOg('og:description', openGraph.description || description || '');
      if (openGraph.type) setOg('og:type', openGraph.type);
      if (openGraph.url) setOg('og:url', openGraph.url);
      if (openGraph.image) setOg('og:image', openGraph.image);
      if (openGraph.siteName) setOg('og:site_name', openGraph.siteName);
      if (openGraph.locale) setOg('og:locale', openGraph.locale);
    }

    // Twitter
    if (twitter) {
      setTwitter('twitter:card', twitter.card || 'summary');
      if (twitter.site) setTwitter('twitter:site', twitter.site);
      if (twitter.creator) setTwitter('twitter:creator', twitter.creator);
      setTwitter('twitter:title', twitter.title || title);
      setTwitter('twitter:description', twitter.description || description || '');
      if (twitter.image) setTwitter('twitter:image', twitter.image);
    }

    const createdScripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      entries.forEach((obj) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.text = JSON.stringify(obj);
        document.head.appendChild(script);
        createdScripts.push(script);
      });
    }

    return () => {
      document.title = prevTitle;
      // Do not remove meta/link to allow SPA navigation to keep the latest; alternatively, could clean up.
      createdScripts.forEach((s) => s.parentNode?.removeChild(s));
      createdAlternateLinks.forEach((l) => l.parentNode?.removeChild(l));
    };
  }, [
    title,
    description,
    canonical,
    JSON.stringify(jsonLd),
    keywords?.join(','),
    robots,
    JSON.stringify(openGraph),
    JSON.stringify(twitter),
    JSON.stringify(alternates),
  ]);

  return null;
}

function ensureTag(tag: 'meta' | 'link', key: string, value: string) {
  let el = document.head.querySelector(`${tag}[${key}="${value}"]`) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  return el;
}

function setOg(property: string, content: string) {
  const el = ensureTag('meta', 'property', property) as HTMLMetaElement;
  el.setAttribute('content', content);
}

function setTwitter(name: string, content: string) {
  const el = ensureTag('meta', 'name', name) as HTMLMetaElement;
  el.setAttribute('content', content);
}
