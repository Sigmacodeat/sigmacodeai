import MarketingTeaser from '../../marketing/MarketingTeaser';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';

export default function AgentsOverviewTeaserSection() {
  const Icon = UNIFIED_ICON_SET[0];
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const tAny = t as unknown as (key: string, options?: any) => any;

  const title = tt('marketing.agents.overview.teaser.title', 'AI Agents Überblick');
  const description = tt(
    'marketing.agents.overview.teaser.description',
    'Architektur, Fähigkeiten und Best Practices für produktive AI‑Agenten.'
  );

  return (
    <MarketingTeaser
      id="ai-agents"
      title={title}
      description={description}
      className="h-full !py-6 lg:!py-8"
      variant="card"
      ctaHref="/ai-agents"
      ctaLabel={tt('marketing.agents.overview.teaser.cta', 'Zum Überblick')}
      icon={<Icon className="h-6 w-6" />}
      tone="teal"
      transparentBackground
      compact
      playOnClick
      stagger={0.08}
      dataAnalyticsId="teaser:agents-overview"
      ctaAnalyticsId="teaser:agents-overview:cta"
    />
  );
}

