import MarketingTeaser from '../../marketing/MarketingTeaser';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';

export default function BusinessAITeaserSection() {
  const Icon = UNIFIED_ICON_SET[2];
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const tAny = t as unknown as (key: string, options?: any) => any;

  const title = tt('marketing.business.ai.teaser.title', 'Business AI');
  const description = tt(
    'marketing.business.ai.teaser.description',
    'Von Governance bis Observability – Best Practices für den produktiven AI‑Rollout im Unternehmen.'
  );

  return (
    <MarketingTeaser
      id="business-ai"
      title={title}
      description={description}
      className="h-full !py-6 lg:!py-8"
      variant="card"
      ctaHref="/business-ai"
      ctaLabel={tt('marketing.business.ai.teaser.cta', 'Business AI entdecken')}
      icon={<Icon className="h-6 w-6" />}
      tone="teal"
      transparentBackground
      compact
      playOnClick
      stagger={0.08}
      dataAnalyticsId="teaser:business-ai"
      ctaAnalyticsId="teaser:business-ai:cta"
    />
  );
}

