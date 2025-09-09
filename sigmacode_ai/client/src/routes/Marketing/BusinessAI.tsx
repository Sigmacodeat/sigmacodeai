import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Database, Workflow, Radar, Layers3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FAQSection from '../../components/marketing/FAQSection';
import BackButton from '../../components/marketing/BackButton';
import SEO from '../../components/marketing/SEO';
import { buttonStyles, buttonSizeXs } from '../../components/ui/Button';
import SiteFooter from '../../components/Landing/sections/SiteFooter';

// (Wrapper wird weiter unten via Cast definiert)

export default function BusinessAI() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // FAQ Items für Accordion + JSON-LD
  const faqItems = [
    { q: tt('marketing.business.faq.q1.q', { defaultValue: 'Was bedeutet Business AI konkret?' }), a: (
      <>
        <p>Produktiv eingesetzte KI in Geschäftsprozessen – mit klaren Policies, robustem Wissenszugriff und messbarer Qualität.</p>
        <div className="mt-2 text-sm">
          <a href="#governance" className="text-teal-600 hover:text-teal-500 hover:underline">Governance</a>
          <span className="mx-2">•</span>
          <a href="#rag" className="text-teal-600 hover:text-teal-500 hover:underline">RAG</a>
          <span className="mx-2">•</span>
          <a href="#observability" className="text-teal-600 hover:text-teal-500 hover:underline">Observability</a>
          <span className="mx-2">•</span>
          <a href="#rollout" className="text-teal-600 hover:text-teal-500 hover:underline">Rollout</a>
        </div>
      </>
    ), keywords: ['Governance', 'RAG', 'SLA'] },
    { q: tt('marketing.business.faq.q2.q', { defaultValue: 'Wie sichere ich Business AI ab?' }), a: (
      <>
        <p>RBAC, Policies und Audit-Trails bilden das Fundament. Secrets werden sicher verwaltet, Provider sauber isoliert.</p>
        <p className="mt-2">Zusätzlich helfen Guardrails und Least-Privilege-Ansätze, Fehlaktionen zu verhindern.</p>
      </>
    ), keywords: ['RBAC', 'Policies', 'Audit'] },
    { q: tt('marketing.business.faq.q3.q', { defaultValue: 'Wie funktioniert RAG richtig?' }), a: (
      <>
        <p>Gutes Chunking, domänenspezifische Embeddings und Grounding mit Citations. Delta-Sync hält Wissensbasen frisch.</p>
      </>
    ), keywords: ['Chunking', 'Embeddings', 'Citations'] },
    { q: tt('marketing.business.faq.q4.q', { defaultValue: 'Wie überwache ich Qualität (Observability)?' }), a: (
      <>
        <p>Tracing von Runs, Metriken zu Kosten/Latenz/Qualität sowie Evaluation und A/B-Tests mit Human-in-the-Loop.</p>
      </>
    ), keywords: ['Tracing', 'Metriken', 'Evaluation'] },
    { q: tt('marketing.business.faq.q5.q', { defaultValue: 'Wie rolle ich AI sicher aus?' }), a: (
      <>
        <p>Staging-Umgebungen, Feature-Gates, Canary-Releases und versionierte Agents – ergänzt um definierte Eskalationspfade.</p>
      </>
    ), keywords: ['Staging', 'Canary', 'SLA'] },
    { q: tt('marketing.business.faq.q6.q', { defaultValue: 'Welche Provider/Clouds sind kompatibel?' }), a: (
      <>
        <p>BYOK und Multi-Cloud (Azure, AWS, GCP) sowie Modelle wie OpenAI, Anthropic, Google, Mistral, Groq, DeepSeek.</p>
      </>
    ), keywords: ['Multi-Cloud', 'BYOK'] },
    { q: tt('marketing.business.faq.q7.q', { defaultValue: 'Wie integriere ich Business-Prozesse?' }), a: (
      <>
        <p>Über AI Actions (OpenAPI), Webhooks und Connectoren zu CRM/ERP/Ticketing/DB – gesteuert über Policies.</p>
      </>
    ), keywords: ['AI Actions', 'OpenAPI', 'Webhooks'] },
    { q: tt('marketing.business.faq.q8.q', { defaultValue: 'Wie behalte ich Kosten im Griff?' }), a: (
      <>
        <p>Budgetlimits, Kostenmetriken, Modellmix für Zwischenschritte, Caching und Multiprovider-Strategien.</p>
      </>
    ), keywords: ['Kosten', 'Caching', 'Modellmix'] },
    { q: tt('marketing.business.faq.q9.q', { defaultValue: 'Wie schütze ich Daten & DSGVO?' }), a: (
      <>
        <p>Datenhoheit durch isolierte Umgebungen, Logging/Masking, Aufbewahrungskonzepte und DSGVO-Konformität.</p>
      </>
    ), keywords: ['DSGVO', 'Datenhoheit'] },
    { q: tt('marketing.business.faq.q10.q', { defaultValue: 'Wie messe ich ROI?' }), a: (
      <>
        <p>Geschäftsmetriken pro Prozess (z. B. TTR, Konversionsrate, Ticketkosten) plus Artefakte und Dashboards.</p>
      </>
    ), keywords: ['ROI', 'Metriken'] },
    { q: tt('marketing.business.faq.q11.q', { defaultValue: 'Welche Risiken gibt es und wie mitigieren?' }), a: (
      <>
        <p>Halluzinationen, Datenabfluss, Fehlaktionen – mitigiert durch RAG, Guardrails, Least-Privilege und Red-Teaming.</p>
      </>
    ), keywords: ['Guardrails', 'Least-Privilege'] },
    { q: tt('marketing.business.faq.q12.q', { defaultValue: 'Wie skaliere ich von Pilot zu Produktion?' }), a: (
      <>
        <p>Mit Roadmap, SLO/SLA, Change-Management, Schulungen und kontinuierlicher Evaluation.</p>
      </>
    ), keywords: ['SLO/SLA', 'Change-Management'] },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <SEO
        title={tt('marketing.business.seo.title', { defaultValue: 'Business AI – Governance, RAG, Observability & Rollout' })}
        description={tt('marketing.business.seo.description', { defaultValue: 'Business AI produktiv: Policies, RAG, Observability, SLAs und sicherer Rollout – Multi‑Provider und skalierbar.' })}
        canonical="/business-ai"
        robots="index,follow"
        openGraph={{
          title: tt('marketing.business.og.title', { defaultValue: 'Business AI – Sicher, steuerbar, messbar' }),
          description: tt('marketing.business.og.description', { defaultValue: 'Governance, RAG, Observability & Rollout für produktive AI in Unternehmen.' }),
          url: origin ? `${origin}/business-ai` : undefined,
          type: 'website',
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary_large_image',
          title: tt('marketing.business.twitter.title', { defaultValue: 'Business AI – Governance, RAG & Rollout' }),
          description: tt('marketing.business.twitter.description', { defaultValue: 'Sichere, beobachtbare und skalierbare AI – von Policies bis SLAs.' }),
        }}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tt('marketing.business.software_name', { defaultValue: 'SIGMACODE Business AI' }),
            applicationCategory: tt('marketing.business.software_category', { defaultValue: 'BusinessApplication' }),
            operatingSystem: tt('marketing.business.software_os', { defaultValue: 'Web' }),
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            url: origin ? `${origin}/business-ai` : undefined,
            description: tt('marketing.business.software_description', { defaultValue: 'Business AI mit Governance, RAG, Observability und Rollout. Multi-Provider-Architektur für Sicherheit und Skalierbarkeit.' }),
            publisher: { '@type': 'Organization', name: tt('marketing.business.software_publisher', { defaultValue: 'SIGMACODE AI' }) },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: tt('marketing.howto.title', { defaultValue: 'Business AI in 4 Schritten' }),
            step: [
              { '@type': 'HowToStep', position: 1, name: tt('marketing.howto.s1.title', { defaultValue: 'Daten verbinden' }), itemListElement: [{ '@type': 'HowToDirection', text: tt('marketing.howto.s1.desc', { defaultValue: 'Dateien, DB oder Confluence – wähle die Quellen für RAG.' }) }] },
              { '@type': 'HowToStep', position: 2, name: tt('marketing.howto.s2.title', { defaultValue: 'Actions importieren' }), itemListElement: [{ '@type': 'HowToDirection', text: tt('marketing.howto.s2.desc', { defaultValue: 'OpenAPI laden, Scopes definieren, Parameter validieren (Zod).' }) }] },
              { '@type': 'HowToStep', position: 3, name: tt('marketing.howto.s3.title', { defaultValue: 'Policies setzen' }), itemListElement: [{ '@type': 'HowToDirection', text: tt('marketing.howto.s3.desc', { defaultValue: 'RBAC, Domains, Rate Limits – sicher und überprüfbar.' }) }] },
              { '@type': 'HowToStep', position: 4, name: tt('marketing.howto.s4.title', { defaultValue: 'Testen & Messen' }), itemListElement: [{ '@type': 'HowToDirection', text: tt('marketing.howto.s4.desc', { defaultValue: 'Tracing, Evals und A/B-Tests für Qualität und Kosten.' }) }] },
            ],
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-4">
          <BackButton />
        </div>
        <Hero />
        <Personas />
        <UseCasesDetailed />
        <MidCTA />
        <Governance />
        <RAGPatterns />
        <Observability />
        <Rollout />
        <HowToSteps />
        <FAQSection id="faq" title="FAQ" items={faqItems} pagePath="/business-ai" />
        <CTA />
      </main>
      {/* Global site footer */}
      <SiteFooter />
    </div>
  );
}

// Workaround: Framer Motion Typinkompatibilität mit unserer TS/React-Version.
// Props wie initial/animate/whileInView werden zur Laufzeit korrekt verarbeitet,
// aber die Typen schlagen fehl. Wir verwenden daher einen Wrapper-Cast.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as unknown as React.FC<any>;

/* ================= HERO ================= */
function Hero() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  // Bezier als Tupel, falls cubicBezier-Helper nicht verfügbar ist
  const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];
  return (
    <section className="py-12 bg-gray-900 text-gray-50 rounded-2xl" aria-labelledby="hero-title">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <h1 id="hero-title" className="text-3xl font-extrabold sm:text-4xl text-white drop-shadow-md">
            Business AI – Governance, RAG & Rollout
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-300">
            Von Policies bis Observability: Skaliere AI sicher, steuerbar und messbar – mit Multi-Provider-Flexibilität.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              to="/c/new"
              aria-label="Business AI im AI Chat testen"
              className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
            >
              Jetzt starten
            </Link>
            <Link
              to="/pricing"
              className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
            >
              Preise
            </Link>
          </div>
        </div>

        {/* Motion Illustration */}
        <MotionDiv
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: easeOut }}
          className="relative h-72 p-6 select-none"
          aria-hidden="true"
        >
          {/* Soft halo background – toned down */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-72 w-72 rounded-full bg-gradient-to-tr from-sky-400/15 via-cyan-300/10 to-transparent blur-xl" />
          </div>
          {/* Static framed panel with embedded badges (no orbits) */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/60 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:bg-gray-900/50 dark:ring-white/5 w-[22rem] h-[12.5rem] md:w-[24rem]"
            aria-hidden="true"
          >
            {/* subtle inner bevel */}
            <div className="absolute inset-[1px] rounded-[1.45rem] bg-gradient-to-br from-white/40 to-transparent dark:from-white/10" />

            {/* TL badge */}
            <div className="absolute left-4 top-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur dark:bg-gray-900/90 dark:text-gray-100">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{tt('marketing.badge.governance', { defaultValue: 'Governance' })}</span>
              </div>
            </div>

            {/* TR badge */}
            <div className="absolute right-4 top-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur dark:bg-gray-900/90 dark:text-gray-100">
                <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{tt('marketing.badge.rag', { defaultValue: 'RAG' })}</span>
              </div>
            </div>

            {/* BL badge */}
            <div className="absolute left-4 bottom-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur dark:bg-gray-900/90 dark:text-gray-100">
                <Workflow className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span>{tt('marketing.badge.workflow', { defaultValue: 'Workflow' })}</span>
              </div>
            </div>

            {/* BR badge */}
            <div className="absolute right-4 bottom-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur dark:bg-gray-900/90 dark:text-gray-100">
                <Radar className="h-4 w-4 text-brand-primary" />
                <span>{tt('marketing.badge.observability', { defaultValue: 'Observability' })}</span>
              </div>
            </div>
          </div>
          {/* Center node */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
            <div className="relative h-14 w-14 rounded-2xl bg-white/80 backdrop-blur shadow-sm dark:bg-gray-900/70">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10" />
              <div className="relative z-10 flex h-full w-full items-center justify-center text-teal-600 dark:text-teal-300">
                <Layers3 className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Subtle particles for richness (respect reduced motion) */}
          {!reduceMotion && (
            <>
              <MotionDiv
                className="absolute left-[15%] top-[30%] h-1.5 w-1.5 rounded-full bg-teal-400/40"
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              />
              <MotionDiv
                className="absolute right-[18%] bottom-[22%] h-1.5 w-1.5 rounded-full bg-amber-400/40"
                animate={{ opacity: [0.15, 0.7, 0.15], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.6 }}
              />
              <MotionDiv
                className="absolute left-1/2 top-[12%] -translate-x-1/2 h-[5px] w-[5px] rounded-full bg-emerald-400/40"
                animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.3 }}
              />
            </>
          )}
        </MotionDiv>
      </div>
    </section>
  );
}

/* ============== GOVERNANCE ============== */
function Governance() {
  const items = [
    { title: 'RBAC & Policies', desc: 'Rollenbasiert steuern, welche Aktionen/Tools/Quellen Agents nutzen dürfen.' },
    { title: 'Audit & Compliance', desc: 'Protokollierung, Nachvollziehbarkeit, DSGVO & Datenhoheit.' },
    { title: 'Secrets & Provider', desc: 'BYOK oder Managed – Schlüssel sicher verwalten, Provider flexibel wechseln.' },
  ];
  return (
    <section id="governance" className="py-12 scroll-mt-24 md:scroll-mt-32" aria-labelledby="gov-title">
      <h2 id="gov-title" className="text-2xl font-bold">Governance</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        Sicherheit ist kein Add-on. Sie ist Grundlage. Policies, RBAC und Audit-Trails bilden das Rückgrat von Business AI.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== RAG STRATEGIES ============== */
function RAGPatterns() {
  const items = [
    { title: 'Chunking & Embeddings', desc: 'Qualitative Indizierung, Domain-spezifische Pipelines, Versionierung.' },
    { title: 'Grounding & Citations', desc: 'Quellenbelege, verlässliche Antworten, Halluzinationen minimieren.' },
    { title: 'Freshness & Sync', desc: 'Delta-Updates, Webhooks, ETL-Flows für aktuelle Wissensbasen.' },
  ];
  return (
    <section id="rag" className="py-12 scroll-mt-24 md:scroll-mt-32" aria-labelledby="rag-title">
      <h2 id="rag-title" className="text-2xl font-bold">RAG-Strategien</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        Retrieval Augmented Generation ist mehr als Embeddings. Es ist die Kunst, Wissen zu strukturieren und Antworten belastbar zu machen.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card p-6">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== OBSERVABILITY ============== */
function Observability() {
  const items = [
    { title: 'Tracing & Logs', desc: 'Runs nachverfolgen, Kontext und Tool-Nutzung transparent machen.' },
    { title: 'Metriken', desc: 'Kosten, Latenz, Qualitätsindikatoren – pro Agent und Workflow.' },
    { title: 'Evaluation', desc: 'Prompt-/Output-Bewertungen, A/B-Tests, Human-in-the-Loop.' },
  ];
  return (
    <section id="observability" className="py-12 scroll-mt-24 md:scroll-mt-32" aria-labelledby="obs-title">
      <h2 id="obs-title" className="text-2xl font-bold">Observability</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        Transparenz bedeutet Kontrolle. Nur wer sieht, wie Agenten handeln, kann Vertrauen schaffen – und Qualität sichern.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card p-6">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== ROLLOUT ============== */
function Rollout() {
  const items = [
    { title: 'Staging & Gates', desc: 'Feature-Flags, schrittweiser Rollout, sichere Freigaben.' },
    { title: 'SLA & Support', desc: 'Managed-Optionen mit Reaktionszeiten, Eskalationspfade.' },
    { title: 'Change Management', desc: 'Versionierte Agents, Migrationspfade, Doku.' },
  ];
  return (
    <section id="rollout" className="py-12 scroll-mt-24 md:scroll-mt-32" aria-labelledby="rollout-title">
      <h2 id="rollout-title" className="text-2xl font-bold">Rollout</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        Kontrolle beim Ausrollen entscheidet über Erfolg oder Chaos. Mit Staging, SLAs und Change-Management bleibt Business AI berechenbar.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card p-6">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Reusable CallToAction component for hero (gradient) and card (glass) variants
type CTAButtonProps = {
  to: string;
  label: string;
  ariaLabel?: string;
  titleAttr?: string;
  analytics?: string;
  className?: string;
};

export function CallToAction({
  id,
  title,
  subtitle,
  primary,
  secondary,
  variant = 'hero',
  motion = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  primary: CTAButtonProps;
  secondary?: CTAButtonProps;
  variant?: 'hero' | 'card';
  motion?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

  if (variant === 'hero') {
    return (
      <section className="py-20" aria-labelledby={`${id}-title`}>
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 text-center text-gray-50 shadow-lg dark:bg-gray-900">
          {/* Subtle inner gradient tint for depth (works in dark mode) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-400/10 to-transparent blur-3xl" />
            <div className="absolute -bottom-24 left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-indigo-500/10 via-fuchsia-500/10 to-transparent blur-3xl" />
            <div className="absolute -right-20 top-8 h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-400/10 to-transparent blur-2xl" />
          </div>

          <h3 id={`${id}-title`} className="text-2xl font-bold tracking-tight">{title}</h3>
          <p id={`${id}-subtitle`} className="mt-2 text-gray-300">{subtitle}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to={primary.to}
              aria-label={primary.ariaLabel}
              title={primary.titleAttr}
              data-analytics={primary.analytics}
              className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
            >
              {primary.label}
            </Link>
            {secondary && (
              <Link
                to={secondary.to}
                aria-label={secondary.ariaLabel}
                title={secondary.titleAttr}
                data-analytics={secondary.analytics}
                className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // card variant
  const cardContent = (
    <div className="ui-glass-card ui-glass-card-hover p-6 text-center shadow-sm transition-shadow hover:shadow">
      <h2 id={`${id}-title`} className="sr-only">{title}</h2>
      <p id={`${id}-subtitle`} className="text-sm text-gray-700 dark:text-gray-300">{subtitle}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link
          to={primary.to}
          aria-label={primary.ariaLabel}
          aria-describedby={`${id}-subtitle`}
          title={primary.titleAttr}
          data-analytics={primary.analytics}
          className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
        >
          {primary.label}
        </Link>
        {secondary && (
          <Link
            to={secondary.to}
            aria-describedby={`${id}-subtitle`}
            title={secondary.titleAttr}
            data-analytics={secondary.analytics}
            className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className="my-8" aria-labelledby={`${id}-title`}>
      {motion ? (
        <MotionDiv
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeOut }}
        >
          {cardContent}
        </MotionDiv>
      ) : (
        cardContent
      )}
    </section>
  );
}

/* ============== CTA ============== */
export function CTA() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <CallToAction
      id="cta"
      variant="hero"
      title={tt('marketing.business.cta.title', { defaultValue: 'Business AI sicher ausrollen' })}
      subtitle={tt('marketing.business.cta.subtitle', { defaultValue: 'Governance, RAG, Observability – alles aus einem Guss.' })}
      primary={{
        to: '/c/new',
        label: tt('marketing.business.cta.primary', { defaultValue: 'Zum AI Chat' }),
        ariaLabel: tt('marketing.business.cta.primary_aria', { defaultValue: 'Business AI im AI Chat testen' }),
        analytics: 'bottom-cta-primary',
      }}
      secondary={{
        to: '/pricing#calculator',
        label: tt('marketing.business.cta.secondary_pricing', { defaultValue: 'Pricing-Details' }),
        ariaLabel: tt('marketing.business.cta.secondary_aria', { defaultValue: 'Zu den Pricing-Details und Kalkulator' }),
        analytics: 'bottom-cta-secondary',
      }}
    />
  );
}

// ...

function Personas() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const tabs = [
    { key: 'it', label: tt('marketing.persona.it', { defaultValue: 'IT/Platform' }) },
    { key: 'ops', label: tt('marketing.persona.ops', { defaultValue: 'Ops' }) },
    { key: 'biz', label: tt('marketing.persona.biz', { defaultValue: 'Business' }) },
  ];
  const [active, setActive] = useState<string>(tabs[0].key);
  const personas: Record<string, { title: string; desc: string; tasks: string[]; cta: { primary: string; secondary: string } }> = {
    it: {
      title: tt('marketing.persona.it.title', { defaultValue: 'IT / Platform' }),
      desc: tt('marketing.persona.it.desc', { defaultValue: 'Sichere Bereitstellung, Governance und Monitoring.' }),
      tasks: [
        tt('marketing.persona.it.task1', { defaultValue: 'Policies & RBAC definieren' }),
        tt('marketing.persona.it.task2', { defaultValue: 'Provider & Secrets verwalten' }),
        tt('marketing.persona.it.task3', { defaultValue: 'Observability & Kosten steuern' }),
      ],
      cta: { primary: tt('marketing.cta.try_now', { defaultValue: 'Jetzt testen' }), secondary: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }) },
    },
    ops: {
      title: tt('marketing.persona.ops.title', { defaultValue: 'Operations' }),
      desc: tt('marketing.persona.ops.desc', { defaultValue: 'Qualität, Metriken und Prozesse optimieren.' }),
      tasks: [
        tt('marketing.persona.ops.task1', { defaultValue: 'KPI-Tracking und Dashboards' }),
        tt('marketing.persona.ops.task2', { defaultValue: 'A/B-Tests & Evaluations' }),
        tt('marketing.persona.ops.task3', { defaultValue: 'Rollout & Change Management' }),
      ],
      cta: { primary: tt('marketing.cta.try_now', { defaultValue: 'Jetzt testen' }), secondary: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }) },
    },
    biz: {
      title: tt('marketing.persona.biz.title', { defaultValue: 'Business' }),
      desc: tt('marketing.persona.biz.desc', { defaultValue: 'Use-Cases, ROI und schnelles Go-Live.' }),
      tasks: [
        tt('marketing.persona.biz.task1', { defaultValue: 'Use-Cases evaluieren' }),
        tt('marketing.persona.biz.task2', { defaultValue: 'Pilot definieren' }),
        tt('marketing.persona.biz.task3', { defaultValue: 'Rollout planen' }),
      ],
      cta: { primary: tt('marketing.cta.try_now', { defaultValue: 'Jetzt testen' }), secondary: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }) },
    },
  };
  const p = personas[active];
  return (
    <section id="personas" className="py-12" aria-labelledby="personas-title">
      <h2 id="personas-title" className="text-2xl font-bold">{tt('marketing.persona.title', { defaultValue: 'Für wen eignet sich Business AI?' })}</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">{tt('marketing.persona.subtitle', { defaultValue: 'Wähle ein Segment und sieh typische Aufgaben und Vorteile.' })}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={active === tab.key ? `${buttonStyles.primary} ${buttonSizeXs.primary}` : `${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
            aria-pressed={active === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="ui-glass-card ui-glass-card-hover p-6 md:col-span-2 shadow-sm transition-shadow hover:shadow">
          <h3 className="font-semibold">{p.title}</h3>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{p.desc}</p>
          <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
            {p.tasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
          <div className="flex flex-col gap-3">
            <Link to="/c/new" className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}>
              {p.cta.primary}
            </Link>
            <Link to="/docs" className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}>
              {p.cta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ============== USE CASES (BEGINNER/PRO + KPI) ============== */
function UseCasesDetailed() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const [view, setView] = useState<'beginner' | 'pro'>('beginner');

  type UseCase = {
    key: string;
    title: string;
    beginner: string;
    pro: string;
    kpis: { label: string; value: string }[];
    ctas: { primary: string; secondary: string };
  };

  const cases: UseCase[] = [
    {
      key: 'support',
      title: tt('marketing.usecases.support.title', { defaultValue: 'Support-Automatisierung' }),
      beginner: tt('marketing.usecases.support.beginner', { defaultValue: 'Antworten aus Wissensbasis, Tickets zusammenfassen, Eskalationen steuern.' }),
      pro: tt('marketing.usecases.support.pro', { defaultValue: 'RAG mit Citations, Actions für Ticketing-API, Guardrails, CSAT-Monitoring.' }),
      kpis: [
        { label: tt('marketing.kpi.ttr', { defaultValue: 'Time-to-Resolution' }), value: '-35%' },
        { label: tt('marketing.kpi.csat', { defaultValue: 'CSAT' }), value: '+12%' },
        { label: tt('marketing.kpi.cost', { defaultValue: 'Kosten/Ticket' }), value: '-20%' },
      ],
      ctas: { primary: tt('marketing.cta.try_now', { defaultValue: 'Jetzt testen' }), secondary: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }) },
    },
    {
      key: 'sales',
      title: tt('marketing.usecases.sales.title', { defaultValue: 'Sales Enablement' }),
      beginner: tt('marketing.usecases.sales.beginner', { defaultValue: 'Angebote schneller erstellen und Antworten vorbereiten.' }),
      pro: tt('marketing.usecases.sales.pro', { defaultValue: 'RAG über Produktdaten, Actions für CRM, Personalisierung und Versionierung.' }),
      kpis: [
        { label: tt('marketing.kpi.cvr', { defaultValue: 'Conversion Rate' }), value: '+8%' },
        { label: tt('marketing.kpi.cycle', { defaultValue: 'Sales Cycle' }), value: '-18%' },
        { label: tt('marketing.kpi.time_saved', { defaultValue: 'Zeitersparnis' }), value: '-30%' },
      ],
      ctas: { primary: tt('marketing.cta.playbook', { defaultValue: 'Playbook starten' }), secondary: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }) },
    },
    {
      key: 'dataops',
      title: tt('marketing.usecases.dataops.title', { defaultValue: 'Data Ops / Wissensmanagement' }),
      beginner: tt('marketing.usecases.dataops.beginner', { defaultValue: 'Dokumente organisieren, zusammenfassen und auffindbar machen.' }),
      pro: tt('marketing.usecases.dataops.pro', { defaultValue: 'Chunking-Strategie, Embeddings, Delta-Sync, Policy-gesteuerte Actions.' }),
      kpis: [
        { label: tt('marketing.kpi.latency', { defaultValue: 'Antwortlatenz' }), value: '<300ms' },
        { label: tt('marketing.kpi.findability', { defaultValue: 'Auffindbarkeit' }), value: '+40%' },
        { label: tt('marketing.kpi.quality', { defaultValue: 'Antwortqualität' }), value: '+15%' },
      ],
      ctas: { primary: tt('marketing.cta.import_data', { defaultValue: 'Daten verbinden' }), secondary: tt('marketing.cta.examples', { defaultValue: 'Beispiele ansehen' }) },
    },
  ];

  return (
    <section id="usecases" className="py-12" aria-labelledby="usecases-title">
      <div className="flex items-center justify-between gap-4">
        <h2 id="usecases-title" className="text-2xl font-bold">{tt('marketing.usecases.title', { defaultValue: 'Business-Cases' })}</h2>
        <div className="flex items-center gap-2" aria-label={tt('marketing.usecases.view_toggle', { defaultValue: 'Darstellung umschalten' })}>
          <button
            type="button"
            onClick={() => setView('beginner')}
            className={view === 'beginner' ? `${buttonStyles.primary} ${buttonSizeXs.primary}` : `${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
            aria-pressed={view === 'beginner'}
          >
            {tt('marketing.view.beginner', { defaultValue: 'Beginner' })}
          </button>
          <button
            type="button"
            onClick={() => setView('pro')}
            className={view === 'pro' ? `${buttonStyles.primary} ${buttonSizeXs.primary}` : `${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
            aria-pressed={view === 'pro'}
          >
            {tt('marketing.view.pro', { defaultValue: 'Pro' })}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {cases.map((c) => (
          <article key={c.key} className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{view === 'beginner' ? c.beginner : c.pro}</p>
            <div className="mt-4 flex flex-wrap gap-1">
              {c.kpis.map((k) => (
                <span key={k.label} className="rounded-full px-3 py-1 text-xs">
                  <strong>{k.value}</strong> <span className="opacity-75">{k.label}</span>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/c/new" className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}>
                {c.ctas.primary}
              </Link>
              <Link to="/docs" className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}>
                {c.ctas.secondary}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============== MID CTA ============== */
export function MidCTA() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <CallToAction
      id="mid-cta"
      variant="card"
      motion
      title={tt('marketing.business.cta.title', { defaultValue: 'Business AI sicher ausrollen' })}
      subtitle={tt('marketing.business.cta.subtitle', { defaultValue: 'Governance, RAG, Observability – alles aus einem Guss.' })}
      primary={{
        to: '/c/new?ref=business-ai&src=mid-cta',
        label: tt('marketing.cta.try_now', { defaultValue: 'Jetzt testen' }),
        ariaLabel: tt('marketing.business.cta.primary_aria', { defaultValue: 'Business AI im AI Chat testen' }),
        titleAttr: tt('marketing.business.cta.primary_aria', { defaultValue: 'Business AI im AI Chat testen' }),
        analytics: 'mid-cta-primary',
      }}
      secondary={{
        to: '/docs?ref=business-ai&src=mid-cta',
        label: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }),
        titleAttr: tt('marketing.cta.docs', { defaultValue: 'Technische Doku' }),
        analytics: 'mid-cta-secondary',
      }}
    />
  );
}

/* ============== HOW TO (JSON-LD) ============== */
function HowToSteps() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const steps = [
    { title: tt('marketing.howto.s1.title', { defaultValue: 'Daten verbinden' }), desc: tt('marketing.howto.s1.desc', { defaultValue: 'Dateien, DB oder Confluence – wähle die Quellen für RAG.' }) },
    { title: tt('marketing.howto.s2.title', { defaultValue: 'Actions importieren' }), desc: tt('marketing.howto.s2.desc', { defaultValue: 'OpenAPI laden, Scopes definieren, Parameter validieren (Zod).' }) },
    { title: tt('marketing.howto.s3.title', { defaultValue: 'Policies setzen' }), desc: tt('marketing.howto.s3.desc', { defaultValue: 'RBAC, Domains, Rate Limits – sicher und überprüfbar.' }) },
    { title: tt('marketing.howto.s4.title', { defaultValue: 'Testen & Messen' }), desc: tt('marketing.howto.s4.desc', { defaultValue: 'Tracing, Evals und A/B-Tests für Qualität und Kosten.' }) },
  ];

  return (
    <section id="howto" className="py-12" aria-labelledby="howto-title">
      <h2 id="howto-title" className="text-2xl font-bold">{tt('marketing.howto.title', { defaultValue: 'Business AI in 4 Schritten' })}</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.title} className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
