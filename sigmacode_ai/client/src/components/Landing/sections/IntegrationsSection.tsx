import { CircuitBoard } from 'lucide-react';
// Motion: Reveal/Stagger
import SectionHeader from '../../marketing/SectionHeader';
import Card from '../components/Card';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';
import LandingSection from '../components/LandingSection';
import { Reveal } from '../../motion/Reveal';
import Stagger from '../../motion/Stagger';
import { trackEvent } from '../../../utils/analytics';
import { Link } from 'react-router-dom';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';

export default function IntegrationsSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  // Mehr Ikonen (2 Reihen), bleibt aber generisch über i18n "item {n}"
  const icons = UNIFIED_ICON_SET.slice(0, 10);
  // Default-Items mit sprechenden Titeln/Untertiteln
  const defaultItems = [
    { title: tt('marketing.landing.integrations.items.llm.title', 'LLM‑Provider'), subtitle: tt('marketing.landing.integrations.items.llm.subtitle', 'OpenAI · Anthropic · Google · Mistral') },
    { title: tt('marketing.landing.integrations.items.vector.title', 'Vektorspeicher'), subtitle: tt('marketing.landing.integrations.items.vector.subtitle', 'pgvector · Pinecone · Milvus') },
    { title: tt('marketing.landing.integrations.items.webhooks.title', 'Webhooks & Events'), subtitle: tt('marketing.landing.integrations.items.webhooks.subtitle', 'Outbound/Inbound · Signaturen · Retries') },
    { title: tt('marketing.landing.integrations.items.crm.title', 'CRM'), subtitle: tt('marketing.landing.integrations.items.crm.subtitle', 'HubSpot · Salesforce · Pipedrive') },
    { title: tt('marketing.landing.integrations.items.ticketing.title', 'Ticketing/Issue‑Tracker'), subtitle: tt('marketing.landing.integrations.items.ticketing.subtitle', 'Jira · Zendesk · Linear') },
    { title: tt('marketing.landing.integrations.items.warehouse.title', 'Data Warehouse'), subtitle: tt('marketing.landing.integrations.items.warehouse.subtitle', 'BigQuery · Snowflake · Redshift') },
    { title: tt('marketing.landing.integrations.items.storage.title', 'Storage/Blobs'), subtitle: tt('marketing.landing.integrations.items.storage.subtitle', 'S3 · GCS · Azure Blob') },
    { title: tt('marketing.landing.integrations.items.analytics.title', 'Monitoring & Analytics'), subtitle: tt('marketing.landing.integrations.items.analytics.subtitle', 'Metriken · Tracing · Kosten') },
    { title: tt('marketing.landing.integrations.items.auth.title', 'Auth & SSO'), subtitle: tt('marketing.landing.integrations.items.auth.subtitle', 'OAuth/OIDC · SAML · RBAC') },
    { title: tt('marketing.landing.integrations.items.actions.title', 'MCP / OpenAPI Actions'), subtitle: tt('marketing.landing.integrations.items.actions.subtitle', 'Tools mit Scopes · Rate Limits · Audit') },
  ];
  // Optional: i18n ReturnObjects unterstützen: marketing.landing.integrations.items als Array
  const rawItems = t('marketing.landing.integrations.items', { returnObjects: true, defaultValue: defaultItems }) as unknown;
  const items = Array.isArray(rawItems)
    ? rawItems.map((it, i) => {
        if (it && typeof it === 'object') {
          const o = it as Record<string, unknown>;
          const title = typeof o.title === 'string' ? o.title : defaultItems[i]?.title || `Item ${i + 1}`;
          const subtitle = typeof o.subtitle === 'string' ? o.subtitle : defaultItems[i]?.subtitle || '';
          return { title, subtitle };
        }
        // String-Fallback: als Title nutzen
        if (typeof it === 'string') return { title: it, subtitle: '' };
        return defaultItems[i] || { title: `Item ${i + 1}`, subtitle: '' };
      })
    : defaultItems;
  return (
    <LandingSection id="integrations" className="-mt-px pt-6 sm:pt-8 md:pt-10 pb-12 md:pb-16 lg:pb-20">
        <Reveal as="div" variant="rise" y={12}>
          <SectionHeader
            icon={CircuitBoard}
            badgeText={tt('marketing.landing.integrations.badge')}
            id="integrations-heading"
            title={tt('marketing.landing.integrations.title')}
            subtitle={tt('marketing.landing.integrations.description')}
          />
        </Reveal>
        <>
          <Reveal as="div" variant="fade" delay={80}>
            <div className="mt-4 max-w-3xl">
              <Card variant="subtle">
                <p className="typo-card-body leading-relaxed text-gray-700 dark:text-gray-300">
                  {tt('marketing.landing.integrations.lead', 'Integrationen verbinden Ihre AI‑Agenten und Workflows mit externen Diensten und Datenquellen – z. B. Modelle, Vektorspeicher, CRMs, Ticketsysteme oder interne APIs. So fließen Daten sicher in Prompts, Aktionen und Automationen.')}
                </p>
                <p className="mt-2 typo-card-body leading-relaxed text-gray-600 dark:text-gray-400">
                  {tt('marketing.landing.integrations.lead2', 'Jedes Icon steht exemplarisch für eine Anbindung. Details und Berechtigungen definieren Sie granular in Projekten, inklusive BYOK, Scopes und Audit‑Logs.')}
                </p>
                <div className="mt-3">
                  <Link
                    to="/integrations"
                    onClick={() => trackEvent('landing.integrations.cta.click', {})}
                    className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                  >
                    {tt('marketing.landing.integrations.cta', 'Alle Integrationen ansehen')}
                  </Link>
                </div>
              </Card>
            </div>
          </Reveal>
          {/* Responsive Grid, zwei Reihen auf großen Screens */}
          {
            <Stagger as="ul" gap={70} startDelay={120} className="mt-6 sm:mt-8 md:mt-10 mb-10 md:mb-12 lg:mb-16 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" role="list" data-analytics-id="integrations-grid">
              {icons.map((I, idx) => {
                const item = items[idx] ?? { title: tt('marketing.landing.integrations.item', undefined, { n: idx + 1 }), subtitle: '' };
                return (
                  <li key={idx} className="h-full">
                    <Reveal as="div" variant="rise" y={10}>
                    <Card
                      variant="elevated"
                      size="sm"
                      interactive
                      className="h-full overflow-hidden"
                      aria-label={`${item.title}${item.subtitle ? ' – ' + item.subtitle : ''}`}
                      role="button"
                      tabIndex={0}
                      data-analytics-id="integration-card"
                      data-idx={idx}
                      data-title={item.title}
                      onClick={() =>
                        trackEvent('landing.integrations.card.click', {
                          index: idx,
                          title: item.title,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          trackEvent('landing.integrations.card.click', {
                            index: idx,
                            title: item.title,
                          });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 min-h-[52px] sm:min-h-[56px] w-full overflow-hidden">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-gray-700 dark:text-gray-200 ring-0" aria-hidden="true">
                          <I className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 w-full">
                          <div className="typo-card-title leading-tight text-gray-900 dark:text-white text-[15px] sm:text-base line-clamp-1 break-words">
                            {item.title}
                          </div>
                          {item.subtitle ? (
                            <div className="typo-card-body leading-tight text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 break-words">
                              {item.subtitle}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  </Reveal>
                </li>
              );
              })}
            </Stagger>
          }
        </>
    </LandingSection>
  );
}
