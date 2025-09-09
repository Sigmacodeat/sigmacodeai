import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
 
import SectionHeader from '../../marketing/SectionHeader';
import MarketingTeaser from '../../marketing/MarketingTeaser';
import LandingSection from '../components/LandingSection';

export default function PricingDetailsTeaserSection() {
  const { t } = useTranslation();
  // Vereinfachte Signaturen für i18next t, um TS-Overload-Probleme (TemplateStringsArray) zu vermeiden
  const tt = t as unknown as (key: string, options?: any) => string;
  const tAny = t as unknown as (key: string, options?: any) => any;

  // Bullets als streng typisiertes Array via returnObjects.
  const defaultBullets = [
    'Faire Staffelung nach Teamgröße',
    'Transparente Limits & Upgrades',
    'Monatlich kündbar, keine versteckten Kosten',
    'Enterprise-Optionen für SSO, Security & Support',
  ];
  const bulletsRaw = tAny('marketing.landing.pricingTeaser.bullets', {
    returnObjects: true,
    defaultValue: defaultBullets,
  }) as unknown;
  const bullets: string[] = Array.isArray(bulletsRaw)
    ? (bulletsRaw as unknown[]).map((b) => String(b)).filter(Boolean)
    : defaultBullets;

  return (
    <LandingSection id="pricing-details-teaser" data-analytics-id="pricing-details-teaser-section" className="-mt-px">
        <SectionHeader
          id="pricing-details-teaser-heading"
          badgeText={tt('marketing.landing.pricingTeaser.badge', { defaultValue: 'Preise' })}
          title={tt('marketing.landing.pricingTeaser.title', { defaultValue: 'Transparente Preise, klare Limits' })}
          subtitle={tt('marketing.landing.pricingTeaser.subtitle', { defaultValue: 'Finde den passenden Plan für Teamgröße, Compliance und Anforderungen.' })}
        />
        <MarketingTeaser
          id="pricing-details"
          title={tt('marketing.landing.pricingTeaser.card.title', { defaultValue: 'Preisübersicht & Limits im Detail' })}
          description={tt('marketing.landing.pricingTeaser.card.desc', { defaultValue: 'Vergleiche Features, Kontingente und Sicherheitsoptionen. Upgrade jederzeit möglich.' })}
          bullets={bullets}
          ctaHref="/pricing"
          ctaLabel={tt('marketing.landing.pricingTeaser.cta', { defaultValue: 'Zu den Preisen' })}
          ctaAnalyticsId="pricing-details-teaser-cta"
          icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" focusable="false" />}
          tone="amber"
          className="mt-8 border-t-0 bg-transparent dark:bg-transparent"
          data-analytics-id="pricing-details-teaser"
          data-bullets-count={bullets.length}
        />
    </LandingSection>
  );
}


