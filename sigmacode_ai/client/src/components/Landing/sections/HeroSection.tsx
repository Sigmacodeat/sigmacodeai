import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Suspense, lazy } from 'react';
// Progressive Enhancement: keine künstlichen Delays, Inhalte rendern sofort
import BadgeGroup from '../../marketing/BadgeGroup';
import SectionBadge from '../../marketing/SectionBadge';
import { Sparkles, Database, Lock, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getHeroCopy } from '../../../i18n/hero';
import { TRUST_PROVIDER_ITEMS } from '../../../config/trustbar';
// Dynamischer Import für 3D-Szene
const HeroAgentScene = lazy(() => import('../HeroAgentScene').then(module => ({ default: module.HeroAgentScene })));
// Motion Presets
import { containerVar, itemVar, fadeInUp, viewportOnce } from '~/components/pitchdeck/Shared/variants';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import LandingSection from '../components/LandingSection';
import { trackEvent } from '../../../utils/analytics';
// OrbitClockwork entfernt

// Titel-Varianten global definieren (kann auch exportiert werden, falls extern genutzt)
type TitleVariant = 'plain' | 'gradient' | 'glow';

type HeroSectionProps = {
  onReady?: () => void; // deprecated, keine gating-Logik mehr
  instant?: boolean; // skip intro animations (reduced-motion or skip flag)
  variant?: TitleVariant; // steuert die Titel-Darstellung
};

export default function HeroSection({ onReady, instant = false, variant }: HeroSectionProps) {
  // Locale dynamisch aus i18next ableiten
  const { t, i18n } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const currentLocale = (i18n.language || 'de').toLowerCase().startsWith('en') ? 'en' : 'de';
  const copy = getHeroCopy(currentLocale as 'de' | 'en');
  const heroBadges = [
    { icon: Sparkles, text: tt('marketing.landing.hero.badges.no_code'), variant: 'outline' as const, size: 'xs' as const, tone: 'teal' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
    { icon: Database, text: tt('marketing.landing.hero.badges.rag_ready'), variant: 'outline' as const, size: 'xs' as const, tone: 'neutral' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
    { icon: Lock, text: tt('marketing.landing.hero.badges.policies'), variant: 'outline' as const, size: 'xs' as const, tone: 'neutral' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
  ];
  // Ensure aria-label receives a string (avoid unknown from i18n typings)
  const trustbarAria = tt('marketing.landing.hero.trustbar_aria', { defaultValue: 'Partner-Logos in Endlosschleife' });
  // Keine gating-/Timer-/Variants-Logik mehr – statisches Rendern
  const sceneAnchorRef = useRef<HTMLDivElement | null>(null);
  const sceneInView = useInView(sceneAnchorRef, { amount: 0.6, margin: '0px 0px -10% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const reduceAll = !!instant || !!prefersReducedMotion; // Skip Animations bei Reduced Motion oder Instant

  // Interaction-Gate: nur nach echter Interaktion rendern
  const [userInteracted, setUserInteracted] = useState(false);
  useEffect(() => {
    const onWheel = () => setUserInteracted(true);
    const onTouchStart = () => setUserInteracted(true);
    const onKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowDown', 'PageDown', 'Space', ' '];
      if (keys.includes(e.key)) setUserInteracted(true);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  const armedScene = reduceAll ? true : (userInteracted && sceneInView);

  // Aktiviert die Wellenanimation im Titel erst, nachdem "AI" elegant eingefahren ist
  

  // Titel-Varianten (modular erweiterbar)
  const [searchParams] = useSearchParams();
  const titleParam = (searchParams.get('title') || '').toLowerCase();
  const titleVariant: TitleVariant = (['plain', 'gradient', 'glow'] as const).includes(titleParam as TitleVariant)
    ? (titleParam as TitleVariant)
    : (variant ?? 'gradient');
  const titleVariantClass: Record<TitleVariant, string> = {
    plain: 'text-inherit',
    gradient: 'text-inherit',
    glow: 'text-inherit',
  };

  useEffect(() => {
    const heroSection = document.getElementById('hero');
    if (window.performance && heroSection) {
      const lcpEntry = performance.getEntriesByName('hero-lcp')[0];
      if (!lcpEntry) {
        performance.mark('hero-lcp-start');
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Korrektur: Verwende entry.element statt entry.id
            if ((entry as LargestContentfulPaint).element?.id === 'hero-heading') {
              performance.mark('hero-lcp-end');
              performance.measure('hero-lcp', 'hero-lcp-start', 'hero-lcp-end');
              observer.disconnect();
            }
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    }
  }, []);

  return (
    <LandingSection id="hero" className="hero-aurora overflow-visible scroll-mt-0 pt-10 sm:pt-12 md:pt-16 pb-14 md:pb-12 min-h-screen" ariaLabelledby="hero-heading" noBorder>
      {/* Signature badge: centered across breakpoints */}
      <div className="flex justify-center md:max-w-7xl md:mx-auto mt-2 md:mt-6">
        <motion.div
          initial={reduceAll ? undefined : 'hidden'}
          whileInView={reduceAll ? undefined : 'show'}
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <SectionBadge
            icon={Cpu}
            variant="outline"
            tone="teal"
            size="md"
            className="h-7 max-[360px]:h-6 py-0 whitespace-nowrap"
            ariaLabel={copy.badgeSignature}
          >
            {copy.badgeSignature}
          </SectionBadge>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 items-start md:items-stretch gap-5 sm:gap-6 md:gap-10 md:grid-cols-12">
        <div className="px-0 md:col-span-7">
              <div className="mt-6 sm:mt-8 md:mt-10">
              <h1
                id="hero-heading"
                className={`mt-6 sm:mt-8 md:mt-10 text-inherit text-center md:text-left`}
              >
                SIGMACODE AI
              </h1>
              <motion.p
                className="title-rest block mt-4 sm:mt-6 md:mt-8 typo-subtitle-lg text-neutralx-800 dark:text-neutralx-100 text-left"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {copy.h1Tagline}
              </motion.p>
              <motion.p
                className="mt-4 sm:mt-6 md:mt-8 typo-body-lg text-neutralx-600 dark:text-neutralx-300 max-w-2xl text-left"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {copy.subcopy}
              </motion.p>
              <motion.div
                className="mt-4 sm:mt-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                <BadgeGroup items={heroBadges} className="mt-1 gap-1 px-0" />
              </motion.div>
              <motion.div
                className="mt-6 sm:mt-8 md:mt-10 flex flex-row flex-nowrap items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={containerVar}
              >
                <motion.div variants={itemVar} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                  to="/c/new"
                  aria-label={copy.ctaPrimary}
                  aria-describedby="hero-cta-note"
                  data-analytics-id="hero-cta-primary"
                  onClick={() => trackEvent('landing.hero.cta.click', { variant: 'primary' })}
                  className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                  >
                    {copy.ctaPrimary}
                  </Link>
                </motion.div>
                <motion.div variants={itemVar} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a
                  href="#features"
                  aria-label={copy.ctaSecondary}
                  aria-controls="features"
                  data-analytics-id="hero-cta-secondary"
                  onClick={() => trackEvent('landing.hero.cta.click', { variant: 'secondary' })}
                  className={`${buttonStyles.secondary} ${buttonSizeXs.secondary} focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                  >
                    {copy.ctaSecondary}
                  </a>
                </motion.div>
              </motion.div>
              {/* Secondary small CTAs in one line below */}
              <motion.div
                className="mt-3 sm:mt-4 md:mt-5 flex flex-wrap items-center justify-start gap-1"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={containerVar}
              >
                <motion.div variants={itemVar}>
                  <Link
                    to="/agents"
                    aria-label={copy.ctaAgents}
                    data-analytics-id="hero-cta-agents"
                    onClick={() => trackEvent('landing.hero.cta.click', { variant: 'agents' })}
                    className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
                  >
                    {copy.ctaAgents}
                  </Link>
                </motion.div>
                <motion.div variants={itemVar}>
                  <Link
                    to="/pricing"
                    aria-label={copy.ctaPricing}
                    data-analytics-id="hero-cta-pricing"
                    onClick={() => trackEvent('landing.hero.cta.click', { variant: 'pricing' })}
                    className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
                  >
                    {copy.ctaPricing}
                  </Link>
                </motion.div>
              </motion.div>
              <span id="hero-cta-note" className="sr-only">{copy.ctaNoteSrOnly}</span>
              <motion.div
                className="mt-10 sm:mt-14"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {/* Trustbar - Infinite Slider mit allen Logos (ruhig, kontinuierlich)
                 Spacing stark erhöht: padding-top vermeidet Margin-Collapse */}
                <div className="pt-0 mt-0 typo-caption text-neutralx-500 dark:text-neutralx-400 md:max-w-7xl md:mx-auto">
                  <div className="hidden sm:block mb-5 md:mb-8">{copy.trustbarLabel}</div>
                  <div className="trustbar-wrapper w-full overflow-hidden">
                    <div
                      className={`trustbar-track ${reduceAll ? '' : 'is-animating'}`}
                      aria-live="off"
                      aria-label={trustbarAria}
                      style={{ willChange: 'transform' }}
                    >
                      {/* Sequenz A */}
                      <div className="trustbar-seq">
                        {TRUST_PROVIDER_ITEMS.map((item) => (
                          item.src ? (
                            <img
                              key={item.name}
                              src={item.src}
                              alt={item.alt || item.name}
                              aria-label={tt('marketing.landing.hero.partner_label', { defaultValue: 'Partner {{name}}', name: item.name })}
                              className={`!h-[24px] sm:!h-[26px] md:!h-[30px] w-auto logo-neutral ${item.invertOnDark ? 'logo-invert-dark' : ''}`}
                              loading="eager"
                              decoding="async"
                              height={22}
                            />
                          ) : (
                            <span
                              key={item.name}
                              className="ui-glass-pill px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px] sm:text-[12px] font-medium dark:text-white/90"
                              aria-label={tt('marketing.landing.hero.partner_label', { defaultValue: 'Partner {{name}}', name: item.name })}
                            >
                              {item.name}
                            </span>
                          )
                        ))}
                      </div>
                      {/* Sequenz B (Duplikat für nahtlose Schleife) */}
                      <div className="trustbar-seq" aria-hidden="true">
                        {TRUST_PROVIDER_ITEMS.map((item) => (
                          item.src ? (
                            <img
                              key={`${item.name}-dup`}
                              src={item.src}
                              alt=""
                              aria-hidden="true"
                              className={`!h-[24px] sm:!h-[26px] md:!h-[30px] w-auto logo-neutral ${item.invertOnDark ? 'logo-invert-dark' : ''}`}
                              loading="eager"
                              decoding="async"
                              height={22}
                            />
                          ) : (
                            <span
                              key={`${item.name}-dup`}
                              className="ui-glass-pill px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px] sm:text-[12px] font-medium dark:text-white/90"
                              aria-hidden="true"
                            >
                              {item.name}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
        </div>
        <div ref={sceneAnchorRef} className="relative mt-6 sm:mt-8 md:mt-0 md:self-start md:h-full overflow-hidden px-2 md:px-2 mx-auto w-full md:col-span-5" style={{ maxWidth: 'clamp(420px, 42vw, 620px)' }}>
            {/* Render und Laden der 3D-Teaser-Animation erst nach Interaktion + Sichtbarkeit */}
            {armedScene ? (
              <Suspense fallback={<div className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-auto md:h-full lg:h-full" />}> 
                <HeroAgentScene instant={reduceAll} />
              </Suspense>
            ) : (
              // Leichter Platzhalter, bis Scroll/Interaktion erfolgt
              <div
                className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-auto md:h-full lg:h-full"
                aria-label="Teaser wird bei Scroll/Interaktion geladen"
              />
            )}
        </div>
      </div>
    </LandingSection>
  );
}
