// External
import { Suspense, lazy } from 'react';

// Layout & SEO
import { SeoJsonLd } from './SeoJsonLd';
import SEO from '@/components/marketing/SEO';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import SkipToContent from '../a11y/SkipToContent';

// Sections & helpers (in Sicht-Reihenfolge)
// Above-the-fold: statisch
const HeroSection = lazy(() => import('./sections/HeroSection'));
const AgentsSection = lazy(() => import('./sections/AgentsSection'));
const ContextSection = lazy(() => import('./sections/ContextSection'));

// Below-the-fold: lazy
const FlowSection = lazy(() => import('./sections/FlowSection'));
const ProvidersSection = lazy(() => import('./sections/ProvidersSection'));
const SecuritySection = lazy(() => import('./sections/SecuritySection'));
const HighlightsSection = lazy(() => import('./sections/HighlightsSection'));
const IntegrationsSection = lazy(() => import('./sections/IntegrationsSection'));
const UseCasesSection = lazy(() => import('./sections/UseCasesSection'));
const PricingSection = lazy(() => import('./sections/PricingSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const FinalCtaSection = lazy(() => import('./sections/FinalCtaSection'));
const FaqSection = lazy(() => import('./sections/FaqSection'));
const SiteFooter = lazy(() => import('./sections/SiteFooter'));

// Minimalistische, moderne Landingpage mit Tailwind + Framer Motion
// CTA im Header -> /c/new
// Sektionen (Auszug): Hero, AgentHero, What/Overview, BusinessAI, AgentsMAS, HowItWorks, Providers, Security, Features, Integrations, UseCases, Pricing(+Details), Testimonials, CTA, FAQ, Footer

export default function LandingPage() {
  return (
    <>
      <SeoJsonLd />
      <SEO title="SIGMACODE AI" />
      <SkipToContent />

      {/* Content-Frame: feiner Rand nur um den Hauptinhalt, ohne Header/Footer */}
      <main id="main" role="main" tabIndex={-1} className="my-3 md:my-6">
        {/* Page Gutter: sorgt für bündige Kanten zum Header und sicheren Abstand am Viewportrand (Mobile) */}
        <div className="px-4 sm:px-6">
          <div className="mx-auto w-full max-w-[1050px] rounded-2xl border border-neutral-300/60 dark:border-neutral-700/60 shadow-sm overflow-hidden">
            {/* Above-the-fold */}
            <ErrorBoundary fallback="Hero konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Hero lädt …" />}>
                <HeroSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Agenten-Teaser konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Agenten laden …" />}>
                <AgentsSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Kontext-Bereich konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Kontext lädt …" />}>
                <ContextSection />
              </Suspense>
            </ErrorBoundary>

            {/* Below-the-fold (lazy) */}
            <ErrorBoundary fallback="Ablauf-Übersicht konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Ablauf lädt …" />}>
                <FlowSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Provider-Übersicht konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Provider laden …" />}>
                <ProvidersSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Sicherheitsbereich konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Sicherheit lädt …" />}>
                <SecuritySection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Highlights konnten nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Highlights laden …" />}>
                <HighlightsSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Integrationen konnten nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Integrationen laden …" />}>
                <IntegrationsSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Use Cases konnten nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Use Cases laden …" />}>
                <UseCasesSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Preise konnten nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Preise laden …" />}>
                <PricingSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Testimonials konnten nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Testimonials laden …" />}>
                <TestimonialsSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="Call-to-Action konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="Call-to-Action lädt …" />}>
                <FinalCtaSection />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback="FAQ konnte nicht geladen werden.">
              <Suspense fallback={<LoadingFallback label="FAQ lädt …" />}>
                <FaqSection />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Footer außerhalb des Rahmens, separat lazy */}
      <ErrorBoundary fallback="Footer konnte nicht geladen werden.">
        <Suspense fallback={<LoadingFallback label="Footer lädt …" />}>
          <SiteFooter />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
