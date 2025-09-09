import { Link } from 'react-router-dom';
import { useRef } from 'react';
import LandingSection from '../components/LandingSection';
import Card from '../components/Card';
import { useTranslation } from 'react-i18next';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import SectionHeader from '../../marketing/SectionHeader';
import { trackEvent } from '../../../utils/analytics';

export default function FinalCTA() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const listRef = useRef<HTMLUListElement | null>(null);

  // Optionale, leicht konfigurierbare Integrationsliste.
  // Texte/Hrefs können via i18n-Keys überschrieben werden:
  // marketing.landing.integrations.items.<id>.title | .desc | .href | .badge
  const integrations: Array<{
    id: string;
    defaultTitle: string;
    defaultDesc: string;
    defaultHref?: string;
    badge?: string; // kleiner Typ-Tag (z. B. API/DB)
    icon: 'db' | 'api' | 'kb' | 'crm' | 'storage';
  }> = [
    {
      id: 'postgres',
      defaultTitle: 'PostgreSQL',
      defaultDesc: 'Strukturierte Daten abfragen und sicher verbinden.',
      defaultHref: '#',
      badge: 'DB',
      icon: 'db',
    },
    {
      id: 'apis',
      defaultTitle: 'REST & GraphQL APIs',
      defaultDesc: 'Tools ansteuern, Daten synchronisieren, Aktionen ausführen.',
      defaultHref: '#',
      badge: 'API',
      icon: 'api',
    },
    {
      id: 'knowledge',
      defaultTitle: 'Wissensbasen (Confluence/Wiki)',
      defaultDesc: 'Dokumente indexieren, semantisch suchen, Antworten begründen.',
      defaultHref: '#',
      badge: 'RAG',
      icon: 'kb',
    },
    {
      id: 'crm',
      defaultTitle: 'CRM/Support (Zendesk/HubSpot)',
      defaultDesc: 'Tickets analysieren, Antworten generieren, KPI ableiten.',
      defaultHref: '#',
      badge: 'Ops',
      icon: 'crm',
    },
    {
      id: 'storage',
      defaultTitle: 'S3/Blob Storage',
      defaultDesc: 'Dateien verwalten, Embeddings generieren, sicher teilen.',
      defaultHref: '#',
      badge: 'Files',
      icon: 'storage',
    },
  ];

  return (
    <LandingSection id="final-cta" className="-mt-px">
        <SectionHeader
          id="final-cta-heading"
          badgeText={tt('marketing.landing.finalCta.badge', 'Los geht\'s')}
          title={tt('marketing.landing.finalCta.title', 'GenAI jetzt produktiv nutzen')}
          subtitle={tt('marketing.landing.finalCta.subtitle', 'Teste den AI‑Chat, baue Workflows und teile Ergebnisse – ohne Setup.')}
        />
        <div className="mx-auto max-w-7xl rounded-3xl px-4 sm:px-8 py-10 md:py-14 text-center">
            {/* Integrationen Section */}
            <div className="mx-auto max-w-5xl text-left" aria-labelledby="integrations-heading">
              <div className="text-center">
                <h3 id="integrations-heading" className="typo-section-title text-gray-900 dark:text-white">
                  {tt('marketing.landing.integrations.title', 'Integrationen')}
                </h3>
                <p className="mt-2 typo-section-subtitle leading-relaxed text-gray-700/90 dark:text-gray-200/90">
                  {tt(
                    'marketing.landing.integrations.subtitle',
                    'Verbinde Datenbanken, APIs, Wissensbasen & Systeme.'
                  )}
                </p>
              </div>

              {/* Grid */}
              <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" ref={listRef}>
                {integrations.map((item, idx) => {
                  const title = tt(
                    `marketing.landing.integrations.items.${item.id}.title`,
                    item.defaultTitle
                  );
                  const desc = tt(
                    `marketing.landing.integrations.items.${item.id}.desc`,
                    item.defaultDesc
                  );
                  const href = tt(
                    `marketing.landing.integrations.items.${item.id}.href`,
                    item.defaultHref ?? '#'
                  );
                  const badge = tt(
                    `marketing.landing.integrations.items.${item.id}.badge`,
                    item.badge ?? ''
                  );
                  const isExternal = /^https?:\/\//.test(href);

                  const Icon = () => {
                    const common = 'h-4 w-4';
                    switch (item.icon) {
                      case 'db':
                        return (
                          <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                            <ellipse cx="12" cy="6" rx="8" ry="3" />
                            <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" opacity=".5" />
                            <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" opacity=".25" />
                          </svg>
                        );
                      case 'api':
                        return (
                          <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                            <path d="M4 12h6M14 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        );
                      case 'kb':
                        return (
                          <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                            <path d="M6 4h12v16H6z" opacity=".3" />
                            <path d="M8 7h8v2H8zM8 11h8v2H8zM8 15h5v2H8z" />
                          </svg>
                        );
                      case 'crm':
                        return (
                          <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                            <circle cx="8" cy="8" r="3" />
                            <circle cx="16" cy="16" r="3" />
                            <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        );
                      case 'storage':
                      default:
                        return (
                          <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                            <path d="M3 7h18v10H3z" opacity=".25" />
                            <path d="M4 8h8v8H4zM14 8h6v8h-6z" />
                          </svg>
                        );
                    }
                  };

                  // Karte als Link (Anker um Card, um Semantik und Navigation zu behalten)
                  return (
                    <li key={item.id}>
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="group block"
                        aria-label={title}
                        data-analytics-id="integration-card"
                        data-integration-id={item.id}
                        onClick={() =>
                          trackEvent('landing.integrations.card.click', {
                            id: item.id,
                            title,
                            href,
                            external: isExternal,
                            index: idx,
                          })
                        }
                      >
                        <Card variant="elevated" interactive className="h-full">
                          <div className="flex items-start gap-3.5">
                            <span
                              aria-hidden="true"
                              className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 ring-1 ring-black/5 dark:bg-zinc-800 dark:text-gray-200 dark:ring-zinc-300/15"
                            >
                              <Icon />
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2.5">
                                <h4 className="truncate typo-card-title tracking-tight text-gray-900 dark:text-white">{title}</h4>
                                {badge ? (
                                  <span className="rounded-md border border-black/10 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 dark:border-white/10 dark:bg-zinc-800 dark:text-gray-200">
                                    {badge}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1.5 typo-card-body leading-6 text-gray-700/90 dark:text-gray-200/90">{desc}</p>
                            </div>
                          </div>
                        </Card>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/c/new"
                className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                data-analytics-id="final-cta"
                onClick={() => trackEvent('landing.final.cta.click')}
              >
                {tt('marketing.landing.finalCta.cta', 'Jetzt starten')}
              </Link>
            </div>
          </div>
    </LandingSection>
  );
}

