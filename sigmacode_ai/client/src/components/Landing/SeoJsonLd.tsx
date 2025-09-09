import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Kapselt die JSON-LD Einbindungen (Organization, FAQPage, Service) für die Landingpage.
 * Wird in der LandingPage als <SeoJsonLd /> eingebunden.
 */
export function SeoJsonLd() {
  const { t } = useTranslation();
  // Use an untyped translation function for safely retrieving objects via returnObjects
  const tAny = t as unknown as (key: string, options?: any) => unknown;

  // Defaults spiegeln die Texte aus FAQSection wider, damit Inhalte konsistent bleiben
  const defaultFaqs = useMemo(
    () => [
      { q: 'Brauche ich eine Kreditkarte?', a: 'Nein. Den Starter‑Plan testest du ohne Kreditkarte.' },
      { q: 'Unterstützt ihr On-Prem?', a: 'Ja. Enterprise unterstützt On‑Prem und Hybrid.' },
      { q: 'Wie sicher sind meine Daten?', a: 'Verschlüsselung, RBAC, Audit‑Logs, Secrets‑Handling – Security by Design.' },
      { q: 'Welche Modelle und Provider werden unterstützt?', a: 'Mehrere Provider (z. B. OpenAI, Anthropic, Google, Mistral). Multi‑Provider zur Kosten/Qualitäts‑Optimierung.' },
      { q: 'Kann ich eigene API‑Keys verwenden (BYOK)?', a: 'Ja. BYOK – sicher verwahrt und nie im Client gebundelt.' },
      { q: 'Wie funktioniert RAG & Dateisuche?', a: 'Semantische Suche mit Vektordatenbanken (z. B. PGVector). Relevante Snippets werden Prompts beigegeben.' },
      { q: 'Welche Datei‑Formate sind unterstützt?', a: 'PDF, DOCX, TXT, Markdown, HTML, CSV, JSON, Bilder (OCR). Erweiterbar.' },
      { q: 'Was ist das Model Context Protocol (MCP)?', a: 'Standard für sichere Tool‑Anbindungen. Policies für Actions, Systeme und Wissensbasen.' },
      { q: 'Was sind OpenAPI‑Actions?', a: 'Über OpenAPI definierte Endpunkte als Tools – inkl. Auth, Limits und Scopes.' },
      { q: 'Ist die Plattform DSGVO‑konform?', a: 'Ja. DSGVO‑konform, auf Wunsch EU‑Datenresidenz, AVV und Audit‑Funktionen.' },
      { q: 'Wie läuft Authentifizierung & SSO?', a: 'SAML/SSO, OAuth/OIDC und RBAC – inklusive Audit‑Logs.' },
      { q: 'Wie sind Latenz und Performance?', a: 'Streaming, Caching und effiziente Pipelines reduzieren Latenz. Multi‑Region optional.' },
      { q: 'Gibt es Rate Limits und Quoten?', a: 'Ja. Pro Plan/Projekt/Tool konfigurierbar. Monitoring & Alerts inklusive.' },
      { q: 'Wie funktioniert das No‑Code Agent‑Studio?', a: 'Konfiguriere Rollen, Policies, Tools, Speicher und Ketten (MoA) – ohne Code. Export/Versionierung möglich.' },
      { q: 'Kann ich eigene Logik/Code einbinden?', a: 'Ja. Über Actions, Serverless oder eigene Services. Remote Code Interpreter verfügbar.' },
      { q: 'Welche Integrationen gibt es?', a: 'DBs, Speicher, Wissensbasen, CRMs, Tickets, BI, interne APIs – erweiterbar via MCP/OpenAPI.' },
      { q: 'Wie erfolgt Logging und Monitoring?', a: 'Metriken (Token, Kosten, Latenz), Audit‑Logs, Tracing, Alerts und Exporte.' },
      { q: 'Wie werden sensible Daten geschützt?', a: 'PII‑Redaktion, Verschlüsselung, Zugriffskontrollen, Secrets‑Vault, optional On‑Prem.' },
      { q: 'Gibt es SLAs und Support?', a: 'Ja. Ab Business/Enterprise mit Reaktionszeiten, Kanälen, Ansprechpartnern und optional 24/7.' },
      { q: 'Kann ich kostenlos starten?', a: 'Ja. Starter‑Plan ohne Kreditkarte. Upgrade monatlich oder jährlich (‑20%).' },
    ],
    []
  );

  const localizedFaqMainEntity = useMemo(
    () =>
      {
        const i18nItems = (tAny('marketing.landing.faq.items', { returnObjects: true }) || {}) as Record<string, { q?: string; a?: string }>;
        // Merge i18n items with defaults to ensure consistent ordering and fallbacks
        return defaultFaqs.map((d, i) => {
          const entry = i18nItems?.[String(i)] ?? {};
          const q = entry.q ?? d.q;
          const a = entry.a ?? d.a;
          return { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } } as const;
        });
      },
    [defaultFaqs, t]
  );

  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];
    const origin = window.location.origin;

    const pushLD = (obj: unknown) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
      scripts.push(s);
    };

    // Organization
    pushLD({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SIGMACODE AI',
      url: origin,
      logo: origin + '/favicon.ico',
    });

    // WebSite (ohne SearchAction, da keine URL-Query-Param-Suche vorhanden)
    pushLD({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SIGMACODE AI',
      url: origin,
    });

    // FAQPage (SEO) – aus i18n generiert, konsistent mit FAQSection
    pushLD({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: localizedFaqMainEntity,
    });

    // Breadcrumbs
    pushLD({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: origin + '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Pricing',
          item: origin + '/pricing',
        },
      ],
    });

    // Service/Produkt
    pushLD({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'SIGMACODE AI Platform',
      url: origin + '/pricing',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '9',
        highPrice: '499',
        offerCount: '5',
        url: origin + '/pricing',
      },
    });

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [localizedFaqMainEntity]);

  return null;
}
