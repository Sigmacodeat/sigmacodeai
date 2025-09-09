// Statisches Rendering – alle Motion-Wrapper entfernt
import SectionHeader from '../../marketing/SectionHeader';
import Card from '../components/Card';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import LandingSection from '../components/LandingSection';
import { trackEvent } from '../../../utils/analytics';
import { motion, useReducedMotion } from 'framer-motion';
import { containerVar, itemVar, fadeInUp, viewportOnce } from '~/components/pitchdeck/Shared/variants';

export default function FAQSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const prefersReducedMotion = useReducedMotion();
  // Inhalte sofort rendern – kein Gating durch Badge-Animation erforderlich
  const Icon = UNIFIED_ICON_SET[3];
  const faqs = [
    { q: tt('marketing.landing.faq.items.0.q', 'Brauche ich eine Kreditkarte?'), qShort: tt('marketing.landing.faq.items.0.q_short', 'Kreditkarte nötig?'), a: tt('marketing.landing.faq.items.0.a', 'Nein. Du kannst mit dem Starter‑Plan unmittelbar beginnen und unsere Plattform ohne jede Zahlungsangabe ausprobieren. Erst bei einem späteren Upgrade fragen wir nach Rechnungsdetails – transparent, fair und jederzeit kündbar.') },
    { q: tt('marketing.landing.faq.items.1.q', 'Unterstützt ihr On-Prem?'), qShort: tt('marketing.landing.faq.items.1.q_short', 'On‑Prem Support?'), a: tt('marketing.landing.faq.items.1.a', 'Ja. Für Enterprise‑Kunden bieten wir sowohl On‑Prem‑Deployments als auch hybride Setups an. Policies, Keys und Logs bleiben dabei unter deiner Kontrolle; wir begleiten die Einführung mit Architektur‑Review und Härtungsempfehlungen.') },
    { q: tt('marketing.landing.faq.items.2.q', 'Wie sicher sind meine Daten?'), qShort: tt('marketing.landing.faq.items.2.q_short', 'Datensicherheit?'), a: tt('marketing.landing.faq.items.2.a', 'Security ist bei uns „by Design“ verankert: Verschlüsselung at‑rest & in‑transit, feingranulares RBAC, Audit‑Logs, striktes Secrets‑Handling sowie optionale PII‑Redaktion. Auf Wunsch sorgen Datenresidenz‑Optionen für zusätzliche Compliance.') },
    { q: tt('marketing.landing.faq.items.3.q', 'Welche Modelle und Provider werden unterstützt?'), qShort: tt('marketing.landing.faq.items.3.q_short', 'Modelle & Provider?'), a: tt('marketing.landing.faq.items.3.a', 'Wir unterstützen mehrere führende Anbieter (z. B. OpenAI, Anthropic, Google, Mistral) und lassen dich pro Anwendungsfall flexibel entscheiden. Über Multi‑Provider optimierst du Qualität, Kosten und Latenz dynamisch.') },
    { q: tt('marketing.landing.faq.items.4.q', 'Kann ich eigene API‑Keys verwenden (BYOK)?'), qShort: tt('marketing.landing.faq.items.4.q_short', 'Eigene Keys (BYOK)?'), a: tt('marketing.landing.faq.items.4.a', 'Ja. Mit Bring‑Your‑Own‑Key integrierst du eigene Provider‑Zugänge. Die Schlüssel werden sicher verwahrt, niemals im Client gebundelt und nur gemäß definierter Policies verwendet.') },
    { q: tt('marketing.landing.faq.items.5.q', 'Wie funktioniert RAG & Dateisuche?'), qShort: tt('marketing.landing.faq.items.5.q_short', 'RAG & Suche?'), a: tt('marketing.landing.faq.items.5.a', 'Dokumente werden in einem Vektorspeicher indexiert (z. B. PGVector). Bei einer Anfrage werden semantisch passende Passagen extrahiert und dem Prompt beigefügt, wodurch Antworten fundiert, begründet und nachvollziehbar werden.') },
    { q: tt('marketing.landing.faq.items.6.q', 'Welche Datei‑Formate sind unterstützt?'), qShort: tt('marketing.landing.faq.items.6.q_short', 'Dateiformate?'), a: tt('marketing.landing.faq.items.6.a', 'Wir unterstützen gängige Formate wie PDF, DOCX, TXT, Markdown, HTML, CSV und JSON sowie Bilder per OCR. Die Pipeline ist modular aufgebaut und lässt sich bei Bedarf um weitere Formate erweitern.') },
    { q: tt('marketing.landing.faq.items.7.q', 'Was ist das Model Context Protocol (MCP)?'), qShort: tt('marketing.landing.faq.items.7.q_short', 'Was ist MCP?'), a: tt('marketing.landing.faq.items.7.a', 'Das Model Context Protocol ist ein offener Standard, um Tools und Datenquellen sicher an Modelle anzubinden. Es definiert klare Policies, Scopes und Audits – ideal für kontrollierte, reproduzierbare Automationen.') },
    { q: tt('marketing.landing.faq.items.8.q', 'Was sind OpenAPI‑Actions?'), qShort: tt('marketing.landing.faq.items.8.q_short', 'OpenAPI‑Actions?'), a: tt('marketing.landing.faq.items.8.a', 'Über OpenAPI beschriebene Endpunkte werden als ausführbare „Actions“ verfügbar. Mit Authentifizierung, Rate‑Limits und Berechtigungen steuerst du exakt, welche Operationen Agenten durchführen dürfen.') },
    { q: tt('marketing.landing.faq.items.9.q', 'Ist die Plattform DSGVO‑konform?'), qShort: tt('marketing.landing.faq.items.9.q_short', 'DSGVO‑konform?'), a: tt('marketing.landing.faq.items.9.a', 'Ja. Wir arbeiten DSGVO‑konform, unterstützen EU‑Datenresidenz, stellen AVVs bereit und bieten Audit‑Funktionen. So lassen sich regulatorische Anforderungen nachweisbar erfüllen.') },
    { q: tt('marketing.landing.faq.items.10.q', 'Wie läuft Authentifizierung & SSO?'), qShort: tt('marketing.landing.faq.items.10.q_short', 'Auth & SSO?'), a: tt('marketing.landing.faq.items.10.a', 'Wir unterstützen SAML/SSO und OAuth/OIDC, ergänzt um rollenbasierte Zugriffssteuerung (RBAC). Identity‑Flows sind revisionssicher protokolliert und lassen sich an Unternehmensrichtlinien anpassen.') },
    { q: tt('marketing.landing.faq.items.11.q', 'Wie sind Latenz und Performance?'), qShort: tt('marketing.landing.faq.items.11.q_short', 'Latenz & Performance?'), a: tt('marketing.landing.faq.items.11.a', 'Streaming‑Antworten, Caching und effiziente Pipelines reduzieren Latenzen spürbar. Optional verteilen Multi‑Region‑Deployments den Traffic geografisch näher zum Nutzer.') },
    { q: tt('marketing.landing.faq.items.12.q', 'Gibt es Rate Limits und Quoten?'), qShort: tt('marketing.landing.faq.items.12.q_short', 'Rate Limits?'), a: tt('marketing.landing.faq.items.12.a', 'Ja. Limits und Quoten sind pro Plan, Projekt oder Tool konfigurierbar. Ein integriertes Monitoring mit Alerts hilft, Auslastung und Kosten jederzeit im Blick zu behalten.') },
    { q: tt('marketing.landing.faq.items.13.q', 'Wie funktioniert das No‑Code Agent‑Studio?'), qShort: tt('marketing.landing.faq.items.13.q_short', 'Agent‑Studio (No‑Code)?'), a: tt('marketing.landing.faq.items.13.a', 'Im visuellen Studio definierst du Rollen, Policies, Tools, Speicher und Ketten (MoA) ohne eine Zeile Code. Versionierung, Export und Team‑Kollaboration sind von Beginn an integriert.') },
    { q: tt('marketing.landing.faq.items.14.q', 'Kann ich eigene Logik/Code einbinden?'), qShort: tt('marketing.landing.faq.items.14.q_short', 'Eigene Logik/Code?'), a: tt('marketing.landing.faq.items.14.a', 'Abseits der No‑Code‑Funktionen lassen sich individuelle Logiken als Actions, über Serverless‑Funktionen oder dedizierte Services integrieren. Für explorative Analysen steht ein Remote Code Interpreter bereit.') },
    { q: tt('marketing.landing.faq.items.15.q', 'Welche Integrationen gibt es?'), qShort: tt('marketing.landing.faq.items.15.q_short', 'Integrationen?'), a: tt('marketing.landing.faq.items.15.a', 'Wir bieten Integrationen in Datenbanken, Speicher‑ und Wissenssysteme, CRMs, Ticketing und BI. Eigene Systeme bindest du via MCP oder OpenAPI an – mit klaren Scopes und Audit‑Trails.') },
    { q: tt('marketing.landing.faq.items.16.q', 'Wie erfolgt Logging und Monitoring?'), qShort: tt('marketing.landing.faq.items.16.q_short', 'Logging & Monitoring?'), a: tt('marketing.landing.faq.items.16.a', 'Token, Kosten und Latenzen werden als Metriken erfasst, ergänzt durch Audit‑Logs, Tracing und Alerts. Exporte ermöglichen Analysen in deinem bevorzugten BI‑Werkzeug.') },
    { q: tt('marketing.landing.faq.items.17.q', 'Wie werden sensible Daten geschützt?'), qShort: tt('marketing.landing.faq.items.17.q_short', 'Schutz sensibler Daten?'), a: tt('marketing.landing.faq.items.17.a', 'Sensible Inhalte werden auf Wunsch automatisch geschwärzt (PII‑Redaktion). Zugriffskontrollen, Verschlüsselung und ein dedizierter Secrets‑Vault sorgen für ein hohes Sicherheitsniveau – auch On‑Prem.') },
    { q: tt('marketing.landing.faq.items.18.q', 'Gibt es SLAs und Support?'), qShort: tt('marketing.landing.faq.items.18.q_short', 'SLAs & Support?'), a: tt('marketing.landing.faq.items.18.a', 'Ab Business‑ und Enterprise‑Plänen bieten wir zugesicherte Reaktionszeiten, definierte Kanäle und feste Ansprechpartner; auf Wunsch auch 24/7‑Bereitschaft für kritische Systeme.') },
    { q: tt('marketing.landing.faq.items.19.q', 'Kann ich kostenlos starten?'), qShort: tt('marketing.landing.faq.items.19.q_short', 'Kostenlos starten?'), a: tt('marketing.landing.faq.items.19.a', 'Ja. Starte ohne Kreditkarte und skaliere bei Bedarf auf monatliche oder jährliche Pläne (mit 20% Ersparnis). Dein Fortschritt bleibt dabei jederzeit portierbar.') },
  ];

  // Generate stable, unique slug IDs for deep-linking (handle potential collisions)
  const ids = useMemo(() => {
    const seen = new Map<string, number>();
    return faqs.map((f, i) => {
      const base = (f.q || `faq-${i}`)
        .toLowerCase()
        .replace(/[^a-z0-9äöüß\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return count === 0 ? base : `${base}-${count}`;
    });
  }, [faqs]);

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-open based on URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    const found = ids.findIndex((id) => id === hash);
    if (found >= 0) setOpenIdx(found);
  }, [ids]);

  const toggle = (idx: number, id: string) => {
    setOpenIdx((cur) => {
      const next = cur === idx ? null : idx;
      trackEvent('landing.faq.toggle', {
        faqId: id,
        idx,
        open: next !== null,
      });
      return next;
    });
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${id}`);
    }
  };

  // Keyboard navigation between FAQ items
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number, id: string) => {
    const max = faqs.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        btnRefs.current[Math.min(idx + 1, max)]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        btnRefs.current[Math.max(idx - 1, 0)]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        btnRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        btnRefs.current[max]?.focus();
        break;
      case 'Enter':
      case ' ': // Space
        // let native button behaviour handle click, but ensure hash sync
        setTimeout(() => toggle(idx, id), 0);
        break;
      default:
        break;
    }
  };

  // JSON-LD for SEO
  const faqSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }), [faqs]);
  return (
    <LandingSection id="faq">
      <motion.div
        initial={prefersReducedMotion ? undefined : 'hidden'}
        whileInView={prefersReducedMotion ? undefined : 'show'}
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <SectionHeader
          icon={Icon}
          badgeText={tt('marketing.landing.faq.badge', 'FAQ')}
          id="faq-heading"
          title={tt('marketing.landing.faq.title', 'FAQ')}
          badgeAnimateOnView={true}
          badgeInViewAmount={0.45}
          badgeStartDelaySec={0.08}
          badgeColorDurationSec={1.4}
          contentLagSec={0.3}
          baseDelay={0.12}
        />
      </motion.div>
      <>
          <motion.ul
            role="list"
            aria-labelledby="faq-heading"
            className="mt-6 space-y-3"
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'show'}
            viewport={viewportOnce}
            variants={containerVar}
          >
            {faqs.map((f, i) => {
              const id = ids[i] || `faq-${i}`;
              const isOpen = openIdx === i;
              return (
                <motion.li key={id} variants={itemVar}>
                  <Card noInner className="p-0">
                    <h3 id={id} className="sr-only">{f.q}</h3>
                    <button
                      type="button"
                      aria-controls={`${id}-panel`}
                      aria-expanded={isOpen}
                      aria-current={isOpen ? 'true' : undefined}
                      onClick={() => toggle(i, id)}
                      onKeyDown={(e) => onKeyDown(e, i, id)}
                      ref={(el) => (btnRefs.current[i] = el)}
                      data-analytics-id="faq-toggle"
                      data-faq-id={id}
                      className="flex w-full items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 min-h-11 text-left focus:outline-none"
                    >
                      <span className="typo-card-title leading-snug tracking-tight text-gray-900 dark:text-gray-100">{f.q}</span>
                      <span className={`${isOpen ? 'rotate-180' : ''} i-heroicons-chevron-down h-4 w-4 text-gray-400 dark:text-gray-500 opacity-70 transition-transform`} aria-hidden />
                    </button>
                    {isOpen && (
                      <div
                        id={`${id}-panel`}
                        role="region"
                        aria-labelledby={id}
                        className="px-3 sm:px-4 pb-3 sm:pb-3.5"
                      >
                        <div className="mt-2 border-t border-gray-100/70 dark:border-white/10 pt-3">
                          <div className="typo-card-body leading-7 text-gray-700 dark:text-gray-200">{f.a}</div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.li>
              );
            })}
          </motion.ul>
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
      </>
    </LandingSection>
  );
}
