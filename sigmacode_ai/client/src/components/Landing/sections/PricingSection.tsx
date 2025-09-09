import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import { useParallax } from '../../motion/useParallax';
import { motion, useReducedMotion } from 'framer-motion';
import { containerVar, itemVar, fadeInUp, viewportOnce } from '~/components/pitchdeck/Shared/variants';
import { trackEvent } from '../../../utils/analytics';
import MarketingTeaser from '../../marketing/MarketingTeaser';

type Plan = { name: string; priceM: number; priceY: number; features: string[] };

export default function PricingSection() {
  const { ref: decoRef } = useParallax<HTMLDivElement>({ strength: 6, axis: 'y', clamp: { min: 0.2, max: 0.8 } });
  const [yearly, setYearly] = useState(false);
  const { t, i18n } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const tAny = t as unknown as (key: string, options?: any) => any;
  const fmt = useMemo(() => new Intl.NumberFormat(i18n?.language || 'de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }), [i18n?.language]);
  const prefersReducedMotion = useReducedMotion();

  // Default-Pläne (Fallback), falls i18n keine strukturierten Objekte liefert
  const defaultPlans: Plan[] = [
    {
      name: tt('marketing.landing.pricing.plans.0.name', 'Starter'),
      priceM: 9,
      priceY: 90,
      features: [
        tt('marketing.landing.pricing.plans.0.features.0', '1 Projekt'),
        tt('marketing.landing.pricing.plans.0.features.1', '5k Nachrichten/Monat'),
        tt('marketing.landing.pricing.plans.0.features.2', 'Community Support'),
      ],
    },
    {
      name: tt('marketing.landing.pricing.plans.1.name', 'Pro'),
      priceM: 29,
      priceY: 290,
      features: [
        tt('marketing.landing.pricing.plans.1.features.0', '3 Projekte'),
        tt('marketing.landing.pricing.plans.1.features.1', '50k Nachrichten/Monat'),
        tt('marketing.landing.pricing.plans.1.features.2', 'Priorisierter Support'),
      ],
    },
    {
      name: tt('marketing.landing.pricing.plans.2.name', 'Business'),
      priceM: 79,
      priceY: 790,
      features: [
        tt('marketing.landing.pricing.plans.2.features.0', 'Unbegrenzt Projekte'),
        tt('marketing.landing.pricing.plans.2.features.1', '500k Nachrichten/Monat'),
        tt('marketing.landing.pricing.plans.2.features.2', 'SLA 99.9%'),
      ],
    },
    {
      name: tt('marketing.landing.pricing.plans.3.name', 'Scale'),
      priceM: 199,
      priceY: 1990,
      features: [
        tt('marketing.landing.pricing.plans.3.features.0', 'Multi-Region'),
        tt('marketing.landing.pricing.plans.3.features.1', 'SAML/SSO'),
        tt('marketing.landing.pricing.plans.3.features.2', 'Dedizierte Ressourcen'),
      ],
    },
    {
      name: tt('marketing.landing.pricing.plans.4.name', 'Enterprise'),
      priceM: 499,
      priceY: 4990,
      features: [
        tt('marketing.landing.pricing.plans.4.features.0', 'Custom SLAs'),
        tt('marketing.landing.pricing.plans.4.features.1', 'On-Prem/Hybrid'),
        tt('marketing.landing.pricing.plans.4.features.2', 'Security Reviews'),
      ],
    },
  ];

  // Pläne via i18n-ReturnObjects (Strings/Objekte) laden und normalisieren
  const rawPlans = t('marketing.landing.pricing.plans', { returnObjects: true, defaultValue: defaultPlans }) as unknown;
  const plans: Plan[] = Array.isArray(rawPlans)
    ? rawPlans.map((p, i) => {
        if (p && typeof p === 'object') {
          const obj = p as Record<string, unknown>;
          const name = typeof obj.name === 'string' ? obj.name : defaultPlans[i]?.name || `Plan ${i + 1}`;
          const priceM = typeof obj.priceM === 'number' ? (obj.priceM as number) : defaultPlans[i]?.priceM || 0;
          const priceY = typeof obj.priceY === 'number' ? (obj.priceY as number) : defaultPlans[i]?.priceY || 0;
          const features = Array.isArray(obj.features)
            ? (obj.features as unknown[]).map((f) => (typeof f === 'string' ? f : String((f as any)?.text ?? ''))).filter(Boolean) as string[]
            : defaultPlans[i]?.features || [];
          return { name, priceM, priceY, features };
        }
        // Falls nur ein String geliefert wird, fallback auf Default
        return defaultPlans[i] || { name: `Plan ${i + 1}`, priceM: 0, priceY: 0, features: [] };
      })
    : defaultPlans;

  const bestseller = tt('marketing.landing.pricing.bestseller', 'Pro');

  // Konsolidierte Teaser-Inhalte (aus PricingTeaserSection)
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
    <LandingSection id="pricing" className="-mt-px">
      <motion.div
        initial={prefersReducedMotion ? undefined : 'hidden'}
        whileInView={prefersReducedMotion ? undefined : 'show'}
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <SectionHeader
          icon={BadgeCheck}
          badgeText={tt('marketing.landing.pricingTeaser.badge', 'Preise')}
          id="pricing-heading"
          title={tt('marketing.landing.pricingTeaser.title', 'Transparente Preise, klare Limits')}
          subtitle={tt('marketing.landing.pricingTeaser.subtitle', 'Finde den passenden Plan für Teamgröße, Compliance und Anforderungen.')}
          subtitleClassName="mt-2 text-sm text-gray-600 dark:text-gray-300"
          baseDelay={0.08}
        />
      </motion.div>
      <div className="relative">
        {/* Konsolidierter Teaser-Block */}
        <MarketingTeaser
          id="pricing-details"
          title={tt('marketing.landing.pricingTeaser.card.title', 'Preisübersicht & Limits im Detail')}
          description={tt('marketing.landing.pricingTeaser.card.desc', 'Vergleiche Features, Kontingente und Sicherheitsoptionen. Upgrade jederzeit möglich.')}
          bullets={bullets}
          ctaHref="/pricing"
          ctaLabel={tt('marketing.landing.pricingTeaser.cta', 'Zu den Preisen')}
          ctaAnalyticsId="pricing-details-teaser-cta"
          tone="neutral"
          compact
          transparentBackground
          hideCta
          iconSize="lg"
          bulletVariant="subtle"
          align="left"
          bulletStyle="bare"
          className="mt-2 pt-0 border-t-0 bg-transparent dark:bg-transparent"
          data-analytics-id="pricing-details-teaser"
          data-bullets-count={bullets.length}
        />
        {/* Decorative parallax glow (aria-hidden) */}
        <div
          ref={decoRef}
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-2xl transform-gpu will-change-transform"
          style={{
            background:
              'radial-gradient(closest-side, rgba(56,189,248,0.20), rgba(56,189,248,0.00))',
          }}
        />
        <div className="mt-6 flex items-center justify-center gap-3" role="group" aria-labelledby="pricing-interval-label">
          <span id="pricing-interval-label" className="sr-only">{tt('pricing.interval.label', 'Preisintervall')}</span>
          <span className={`${!yearly ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'} text-sm`}>{tt('marketing.landing.pricing.monthly', 'Monatlich')}</span>
          <button
            type="button"
            onClick={() => {
              const next = !yearly;
              setYearly(next);
              trackEvent('landing.pricing.interval.toggle', { yearly: next });
            }}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${yearly ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-700'}`}
            aria-pressed={yearly}
            aria-label={tt('marketing.landing.pricing.toggle_label', 'Pricing Intervall umschalten')}
            data-analytics-id="pricing-interval-toggle"
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${yearly ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`${yearly ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'} text-sm`}>
            {tt('marketing.landing.pricing.yearly', 'Jährlich')} <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{tt('marketing.landing.pricing.discount_label', '-20%')}</span>
          </span>
          <span aria-live="polite" className="sr-only">{yearly ? tt('marketing.landing.pricing.aria_yearly', 'Jährliche Preise aktiviert') : tt('marketing.landing.pricing.aria_monthly', 'Monatliche Preise aktiviert')}</span>
        </div>
        <motion.div
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5"
          data-billing={yearly ? 'yearly' : 'monthly'}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={viewportOnce}
          variants={containerVar}
        >
          {plans.map((p, i) => (
            <motion.div key={p.name} variants={itemVar}>
              <Card variant="elevated" interactive className="relative" data-analytics-id="pricing-plan" data-plan-name={p.name} data-billing={yearly ? 'yearly' : 'monthly'}>
                {p.name === bestseller && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white shadow">{tt('marketing.landing.pricing.best_seller_label', 'Beliebteste')}</div>
                )}
                <h3 className="typo-card-title">{p.name}</h3>
                <p className="mt-2 text-3xl font-extrabold">
                  {fmt.format(yearly ? p.priceY : p.priceM)}
                  <span className="text-base font-medium text-gray-500">/{yearly ? tt('marketing.landing.pricing.per_year', 'Jahr') : tt('marketing.landing.pricing.per_month', 'Monat')}</span>
                </p>
                <ul className="mt-4 space-y-2 typo-card-body text-gray-700 dark:text-gray-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
                <motion.div variants={itemVar}>
                  <Link
                    to="/c/new"
                    className={`${buttonStyles.primary} mt-6 w-full justify-center`}
                    aria-label={`${tt('marketing.landing.pricing.cta', 'Loslegen')} – ${p.name}`}
                    data-analytics-id="pricing-plan-cta"
                    data-plan-name={p.name}
                    data-billing={yearly ? 'yearly' : 'monthly'}
                    onClick={() =>
                      trackEvent('landing.pricing.plan.cta.click', {
                        plan: p.name,
                        billing: yearly ? 'yearly' : 'monthly',
                      })
                    }
                  >
                    {tt('marketing.landing.pricing.cta', 'Loslegen')}
                  </Link>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Preise im Detail – reichhaltige Inhalte */}
        <div className="mt-12">
          <motion.h3
            className="typo-section-title text-gray-900 dark:text-white"
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'show'}
            viewport={viewportOnce}
            variants={fadeInUp}
          >
            {tt('marketing.landing.pricing.details.heading', 'Preise im Detail')}
          </motion.h3>
          <motion.p
            className="mt-2 max-w-3xl typo-card-body text-gray-600 dark:text-gray-300"
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'show'}
            viewport={viewportOnce}
            variants={fadeInUp}
          >
            {tt(
              'marketing.landing.pricing.details.lead',
              'Transparente Kosten: BYOK vs. Managed, Limits, SLAs – plus interaktiver Kalkulator.'
            )}
          </motion.p>

          <motion.div
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'show'}
            viewport={viewportOnce}
            variants={containerVar}
          >
            {/* BYOK vs Managed */}
            <motion.div variants={itemVar}>
            <Card variant="subtle" title={tt('marketing.landing.pricing.details.byok.title', 'BYOK vs. Managed')}>
              <ul className="typo-card-body text-gray-700 dark:text-gray-300 space-y-1.5">
                <li><span className="font-medium">BYOK:</span> {tt('marketing.landing.pricing.details.byok.item1', 'Eigene Cloud‑Schlüssel, direkte Provider‑Abrechnung')}</li>
                <li><span className="font-medium">Managed:</span> {tt('marketing.landing.pricing.details.byok.item2', 'Abrechnung über SIGMACODE AI, vereinfachtes Setup')}</li>
                <li>{tt('marketing.landing.pricing.details.byok.item3', 'Switch jederzeit möglich, pro Projekt konfigurierbar')}</li>
              </ul>
            </Card>
            </motion.div>

            {/* Token Basics & Samples */}
            <motion.div variants={itemVar}>
            <Card variant="subtle" title={tt('marketing.landing.pricing.details.tokens.title', 'Token‑Basics & Provider‑Samples')}>
              <ul className="typo-card-body text-gray-700 dark:text-gray-300 space-y-1.5">
                <li>{tt('marketing.landing.pricing.details.tokens.item1', 'Vergleich: Input/Output‑Preise (OpenAI, Anthropic, Google, Mistral)')}</li>
                <li>{tt('marketing.landing.pricing.details.tokens.item2', 'Konverter & Beispiele zur Kostenschätzung pro Prompt')}</li>
                <li>{tt('marketing.landing.pricing.details.tokens.item3', 'Hinweis: Kontextgröße, Caching & RAG‑Einfluss')}</li>
              </ul>
            </Card>
            </motion.div>

            {/* Limits & SLAs */}
            <motion.div variants={itemVar}>
            <Card variant="subtle" title={tt('marketing.landing.pricing.details.limits.title', 'Limits & Raten, SLA‑Infos')}>
              <ul className="typo-card-body text-gray-700 dark:text-gray-300 space-y-1.5">
                <li>{tt('marketing.landing.pricing.details.limits.item1', 'Requests/Minute, Concurrency, Retry/Backoff‑Strategien')}</li>
                <li>{tt('marketing.landing.pricing.details.limits.item2', 'SLA 99.9% (Business) / 99.95% (Scale & Enterprise)')}</li>
                <li>{tt('marketing.landing.pricing.details.limits.item3', 'Status‑Seite & Compliance‑Nachweise')}</li>
              </ul>
            </Card>
            </motion.div>

            {/* Calculator CTA */}
            <motion.div variants={itemVar}>
            <Card variant="subtle" title={tt('marketing.landing.pricing.details.calculator.title', 'Preis‑Kalkulator für eigene Szenarien')}>
              <p className="typo-card-body text-gray-700 dark:text-gray-300">
                {tt('marketing.landing.pricing.details.calculator.desc', 'Schätzen Sie Kosten für Volumen, Modelle, Kontextgröße, Caching und RAG. BYOK und Managed werden automatisch berücksichtigt.')}
              </p>
              <Link
                to="/pricing#calculator"
                className={`${buttonStyles.secondary} ${buttonSizeXs.secondary} mt-4`}
                data-analytics-id="pricing-calculator-cta"
                onClick={() => trackEvent('landing.pricing.calculator.cta.click')}
              >
                {tt('marketing.landing.pricing.details.calculator.cta', 'Kalkulator öffnen')}
              </Link>
            </Card>
            </motion.div>
          </motion.div>
        </div>
        {/* SEO: OfferCatalog JSON-LD */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OfferCatalog',
              name: tt('marketing.landing.pricing.title', 'Preise'),
              itemListElement: plans.map((p) => ({
                '@type': 'Offer',
                name: p.name,
                priceCurrency: 'EUR',
                // Standardmäßig monatlicher Preis; Jahrespreis als Option
                price: String(p.priceM),
                eligibleQuantity: { '@type': 'QuantitativeValue', unitCode: 'MON' },
                additionalProperty: [
                  { '@type': 'PropertyValue', name: 'yearly', value: String(p.priceY) },
                ],
              })),
            }),
          }}
        />
      </div>
    </LandingSection>
  );
}
