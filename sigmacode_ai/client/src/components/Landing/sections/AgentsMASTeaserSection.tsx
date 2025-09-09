import MarketingTeaser from '../../marketing/MarketingTeaser';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';

export default function AgentsMASTeaserSection() {
  const Icon = UNIFIED_ICON_SET[1];
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const tAny = t as unknown as (key: string, options?: any) => any;

  const title = tt('marketing.agents.mas.teaser.title', 'Multi‑Agent System (MAS)');
  const description = tt(
    'marketing.agents.mas.teaser.description',
    'Orchestrierung und Koordination mehrerer spezialisierter Agenten – sicher und steuerbar.'
  );

  return (
    <MarketingTeaser
      id="mas"
      title={title}
      description={description}
      className="h-full !py-6 lg:!py-8"
      variant="card"
      ctaHref="/ai-agents/mas"
      ctaLabel={tt('marketing.agents.mas.teaser.cta', 'MAS kennenlernen')}
      icon={<Icon className="h-6 w-6" />}
      tone="teal"
      transparentBackground
      compact
      playOnClick
      stagger={0.08}
      dataAnalyticsId="teaser:agents-mas"
      ctaAnalyticsId="teaser:agents-mas:cta"
    />
  );
}

