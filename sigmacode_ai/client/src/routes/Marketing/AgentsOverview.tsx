import SEO from '../../components/marketing/SEO';
import { m, useReducedMotion } from 'framer-motion';
// Relaxed alias to avoid overly strict prop typing issues in some TS setups
const MotionDiv = m.div as unknown as React.ComponentType<any>;
import { Link } from 'react-router-dom';
import { track } from '../../analytics/gtm';
import FeatureCard from '../../components/marketing/FeatureCard';
import {
  Bot,
  Zap,
  Database,
  Plug,
  ShieldCheck,
  Workflow,
  Layers3,
  CheckCircle2,
  Gauge,
  KeySquare,
  ScrollText,
  Lock,
  ArrowRight,
  Building2,
  LineChart,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui';
import { buttonStyles } from '../../components/ui/Button';
import BadgeGroup from '../../components/marketing/BadgeGroup';
import SectionBadge from '../../components/marketing/SectionBadge';
import BackButton from '../../components/marketing/BackButton';
import FAQSection from '../../components/marketing/FAQSection';

/**
 * AI Agents – Premium Landing (SEO- & Conversion-optimiert)
 * - Klare H-Struktur (H1/H2/H3)
 * - Longtail-Keywords: "No-Code Agent Builder", "AI Actions", "RAG", "Governance", "Multi-Model"
 * - JSON-LD: FAQ + SoftwareApplication
 * - Microcopy: Nutzen vor Features, klare CTAs, interne Verlinkungen
 * - Stil: souverän, bestimmt, präzise (Sigma-Tonalität)
 */

export default function AgentsOverview() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;

  return (
    <>
      <SEO
        title={tt('marketing.agents.seo.title', { defaultValue: 'AI Agents – Orchestrierung, Sicherheit & produktive Automatisierung' })}
        description={tt('marketing.agents.seo.description', { defaultValue: 'Baue ein Agenten-Ökosystem mit RAG, sicheren AI Actions, Workflows und Governance – ohne Code.' })}
        canonical="/ai-agents"
        robots="index,follow"
        keywords={[
          'AI Agents',
          'No-Code Agent Builder',
          'RAG',
          'AI Actions',
          'Governance',
          'Multi-Model',
        ]}
        openGraph={{
          title: tt('marketing.agents.og.title', { defaultValue: 'AI Agents – Orchestrierung, Sicherheit & Automatisierung' }),
          description: tt('marketing.agents.og.description', { defaultValue: 'Agenten mit RAG, sicheren Actions und Governance. Schnell implementiert. Hart abgesichert.' }),
          type: 'website',
          url: `${window.location.origin}/ai-agents`,
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary',
          title: tt('marketing.agents.twitter.title', { defaultValue: 'AI Agents – Orchestrierung & Sicherheit' }),
          description: tt('marketing.agents.twitter.description', { defaultValue: 'RAG, Actions, Workflows, Governance – ohne Code.' }),
        }}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: tt('marketing.agents.faq.q1.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q1.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q2.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q2.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q3.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q3.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q4.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q4.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q5.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q5.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q6.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q6.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q7.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q7.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q8.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q8.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q9.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q9.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q10.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q10.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q11.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q11.a') } },
              { '@type': 'Question', name: tt('marketing.agents.faq.q12.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.agents.faq.q12.a') } },
            ],
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${window.location.origin}/ai-agents` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tt('marketing.agents.software_name'),
            applicationCategory: tt('marketing.agents.software_category'),
            operatingSystem: tt('marketing.agents.software_os'),
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            url: `${window.location.origin}/ai-agents`,
            description: tt('marketing.agents.software_description'),
            publisher: { '@type': 'Organization', name: tt('marketing.agents.software_publisher') },
          },
        ]}
      />
      <main className="mx-auto max-w-[1050px] px-4 sm:px-6 py-14 md:py-20 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <div className="mb-4">
          <BackButton />
        </div>
        <Hero />
        <TrustBar />
        <Architecture />
        <Capabilities />
        <ValueProps />
        <FilesPermissions />
        <UseCases />
        <BestPractices />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

/* ================= HERO ================= */
function Hero() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const reduceMotion = useReducedMotion();
  // Shared animation helpers (aligned with MAS/Business pages)
  const easeOut = [0.22, 1, 0.36, 1] as const;
  // Even when reducedMotion is true, keep very subtle motion so the user still perceives the concept
  const floatAnim = (amp = 4, rot = 1.2) => ({ y: [0, reduceMotion ? -amp * 0.3 : -amp, 0], rotate: [0, reduceMotion ? -rot * 0.4 : -rot, 0] });
  const floatAnimDown = (amp = 4, rot = 1.2) => ({ y: [0, reduceMotion ? amp * 0.3 : amp, 0], rotate: [0, reduceMotion ? rot * 0.4 : rot, 0] });
  const floatTransition = (duration = 3, delay = 0) => ({ repeat: Infinity, repeatType: 'mirror', duration: reduceMotion ? duration * 2.2 : duration, delay, ease: easeOut });
  const gpuStyle: React.CSSProperties = { willChange: 'transform', transform: 'translate3d(0,0,0)' };
  const orbitRotate = (dir: 1 | -1 = 1, duration = 28, delay = 0) => ({ repeat: Infinity, ease: 'linear', duration: reduceMotion ? duration * 3 : duration, delay });
  const orbitAnim = (dir: 1 | -1 = 1) => ({ rotate: 360 * dir });
  const orbitCarrierStyle: React.CSSProperties = { willChange: 'transform', transform: 'translate3d(0,0,0)', transformOrigin: '50% 50%' };
  const badges = [
    { icon: CheckCircle2, text: tt('marketing.agents.hero.badges.b1', { defaultValue: 'No-Code Agent Builder' }), variant: 'glass' as const, tone: 'teal' as const, size: 'xs' as const },
    { icon: ShieldCheck, text: tt('marketing.agents.hero.badges.b2', { defaultValue: 'Policies & Governance' }), variant: 'glass' as const, tone: 'teal' as const, size: 'xs' as const },
    { icon: Bot, text: tt('marketing.agents.hero.badges.b3', { defaultValue: 'Multi-Model Orchestrierung' }), variant: 'glass' as const, tone: 'amber' as const, size: 'xs' as const },
  ];

  return (
    <section className="py-10 md:py-14" aria-labelledby="hero-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={Bot} variant="glass">
          {tt('marketing.agents.hero.badge', { defaultValue: 'AI Agents' })}
        </SectionBadge>
      </div>
      <div className="grid grid-cols-1 items-center gap-6 sm:gap-10 md:grid-cols-2">
        <div>
          <h1 id="hero-title" aria-describedby="hero-subtitle" className="text-[1.75rem] sm:text-[2rem] font-bold leading-snug text-white">
            {tt('marketing.agents.hero.title', { defaultValue: 'AI Agents – Orchestrierung, Sicherheit & produktive Automatisierung' })}
          </h1>
          <p id="hero-subtitle" className="mt-3 max-w-xl text-sm sm:text-base text-gray-700 dark:text-gray-300">
            {tt('marketing.agents.hero.subtitle', { defaultValue: 'Baue ein Agenten-Ökosystem, das mit deinen Daten, APIs und Prozessen arbeitet. RAG, sichere AI Actions, Workflows und Governance – ohne Code. Schnell implementiert. Hart abgesichert.' })}
          </p>

          <BadgeGroup items={badges} className="mt-4 sm:mt-5 md:mt-6" />

          <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
            <Link
              to="/c/new"
              aria-label={tt('marketing.agents.hero.primary_aria', { defaultValue: 'AI Chat starten' })}
              className={buttonStyles.primary}
              onClick={() => track('cta_click', { location: 'hero', target: 'primary_start_chat' })}
            >
              {tt('marketing.agents.hero.primary', { defaultValue: 'Jetzt kostenlos testen' })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#usecases"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => track('cta_click', { location: 'hero', target: 'usecases_anchor' })}
            >
              {tt('marketing.agents.hero.secondary_usecases', { defaultValue: 'Use-Cases entdecken' })}
            </a>
            <Link to="/ai-agents/mas" className={buttonStyles.secondary} onClick={() => track('cta_click', { location: 'hero', target: 'mas_info' })}>
              {tt('marketing.agents.hero.secondary_mas', { defaultValue: 'MAS/MoA verstehen' })}
            </Link>
          </div>
        </div>

        {/* Motion Illustration – MAS‑like orbits & floating badges */}
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-60 sm:h-72 md:h-80 overflow-hidden p-4 sm:p-5 select-none"
          aria-hidden="true"
        >
          {/* Soft halo background */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-brand-primary/25 via-brand-accent/15 to-transparent blur-2xl" />
          </div>

          {/* Center node */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="relative">
              <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-brand-primary/40 bg-white/80 text-brand-primary shadow-sm backdrop-blur dark:border-brand-primary/30 dark:bg-gray-900/70 dark:text-brand-primary">
                <Layers3 className="h-6 w-6" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-brand-primary/10 blur-xl" />
            </div>
          </div>

          {/* Orbits container */}
          <div className="absolute inset-0 grid place-items-center">
            {/* Outer orbit ring */}
            <MotionDiv
              className="relative rounded-full border border-brand-primary/25 dark:border-brand-primary/25"
              style={{ width: '16rem', height: '16rem', ...gpuStyle }}
              animate={orbitAnim(1)}
              transition={orbitRotate(1, 28)}
            >
              {/* Orbiting icons on outer ring */}
              <MotionDiv className="absolute left-1/2 top-0 -translate-x-1/2" style={orbitCarrierStyle} animate={orbitAnim(1)} transition={orbitRotate(1, 16)}>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/95 border border-brand-primary/30 shadow-sm text-brand-primary dark:bg-gray-900/80 dark:border-brand-primary/25">
                  <Workflow className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv className="absolute left-0 top-1/2 -translate-y-1/2" style={orbitCarrierStyle} animate={orbitAnim(1)} transition={orbitRotate(1, 16, 2)}>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/95 border border-brand-primary/30 shadow-sm text-brand-accent dark:bg-gray-900/80 dark:border-brand-primary/25">
                  <Database className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv className="absolute left-1/2 bottom-0 -translate-x-1/2" style={orbitCarrierStyle} animate={orbitAnim(1)} transition={orbitRotate(1, 16, 4)}>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/95 border border-brand-primary/30 shadow-sm text-brand-primary dark:bg-gray-900/80 dark:border-brand-primary/25">
                  <Plug className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv className="absolute right-0 top-1/2 -translate-y-1/2" style={orbitCarrierStyle} animate={orbitAnim(1)} transition={orbitRotate(1, 16, 6)}>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/95 border border-brand-primary/30 shadow-sm text-amber-600 dark:bg-gray-900/80 dark:border-brand-primary/25">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </MotionDiv>
            </MotionDiv>

            {/* Inner orbit ring */}
            <MotionDiv
              className="absolute rounded-full border border-brand-accent/25 dark:border-brand-accent/20"
              style={{ width: '10rem', height: '10rem', ...gpuStyle }}
              animate={orbitAnim(-1)}
              transition={orbitRotate(-1, 22)}
            >
              <MotionDiv className="absolute left-1/2 top-0 -translate-x-1/2" style={orbitCarrierStyle} animate={orbitAnim(-1)} transition={orbitRotate(-1, 14)}>
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white/95 border border-brand-primary/30 shadow-sm text-brand-primary dark:bg-gray-900/80 dark:border-brand-primary/25">
                  <Workflow className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv className="absolute left-1/2 bottom-0 -translate-x-1/2" style={orbitCarrierStyle} animate={orbitAnim(-1)} transition={{ ...orbitRotate(-1, 14), delay: 2.2 }}>
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white/95 border border-brand-primary/30 shadow-sm text-brand-accent dark:bg-gray-900/80 dark:border-brand-primary/25">
                  <Database className="h-4 w-4" />
                </div>
              </MotionDiv>
            </MotionDiv>
          </div>

          {/* Floating labels */}
          <MotionDiv
            className="absolute right-6 top-10 rounded-lg border border-brand-primary/30 bg-white/80 px-2.5 py-1 text-xs shadow-sm backdrop-blur-sm dark:border-brand-primary/25 dark:bg-gray-900/70"
            style={gpuStyle}
            animate={floatAnim(4, 1.2)}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2, rotate: -1 }}
            transition={floatTransition(3, 0)}
            title={tt('marketing.agents.hero.illus.orchestrator', { defaultValue: 'Orchestrator' })}
          >
            <span className="inline-flex items-center gap-2">
              <Workflow className="h-4 w-4 text-brand-primary" /> {tt('marketing.agents.hero.illus.orchestrator', { defaultValue: 'Orchestrator' })}
            </span>
          </MotionDiv>
          <MotionDiv
            className="absolute bottom-8 left-8 rounded-lg border border-brand-primary/30 bg-white/80 px-2.5 py-1 text-xs shadow-sm backdrop-blur-sm dark:border-brand-primary/25 dark:bg-gray-900/70"
            style={gpuStyle}
            animate={floatAnimDown(4, 1.2)}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: 2, rotate: 1 }}
            transition={floatTransition(3.2, 0.2)}
            title={tt('marketing.agents.hero.illus.retrieval', { defaultValue: 'Retrieval (RAG)' })}
          >
            <span className="inline-flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-accent" /> {tt('marketing.agents.hero.illus.retrieval', { defaultValue: 'Retrieval (RAG)' })}
            </span>
          </MotionDiv>
          <MotionDiv
            className="absolute right-8 bottom-10 rounded-lg border border-brand-primary/30 bg-white/80 px-2.5 py-1 text-xs shadow-sm backdrop-blur-sm dark:border-brand-primary/25 dark:bg-gray-900/70"
            style={gpuStyle}
            animate={floatAnimDown(3, 1)}
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: 1, rotate: 1 }}
            transition={floatTransition(3.6, 0.4)}
            title={tt('marketing.agents.hero.illus.actions', { defaultValue: 'AI Actions' })}
          >
            <span className="inline-flex items-center gap-2">
              <Plug className="h-4 w-4 text-brand-primary" /> {tt('marketing.agents.hero.illus.actions', { defaultValue: 'AI Actions' })}
            </span>
          </MotionDiv>
          <MotionDiv
            className="absolute left-6 top-12"
            style={gpuStyle}
            animate={floatAnim(3, 1)}
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -1, rotate: -1 }}
            transition={floatTransition(3.8, 0.6)}
            title={tt('marketing.agents.hero.illus.policies', { defaultValue: 'Policies' })}
          >
            <Badge icon={ShieldCheck} variant="glass" size="sm" tone="amber" className="ring-1 ring-brand-primary/20 dark:ring-brand-primary/20 hover:ring-brand-primary/30 transition-colors duration-200">
              {tt('marketing.agents.hero.illus.policies', { defaultValue: 'Policies' })}
            </Badge>
          </MotionDiv>

          {/* Subtle particles (respect reduced motion) */}
          {!reduceMotion && (
            <>
              <MotionDiv
                className="absolute left-[20%] top-[22%] h-1.5 w-1.5 rounded-full bg-brand-primary/60 blur-[1px]"
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
              />
              <MotionDiv
                className="absolute right-[16%] bottom-[26%] h-1.5 w-1.5 rounded-full bg-amber-400/70 blur-[1px]"
                animate={{ opacity: [0.15, 0.7, 0.15], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 5.4, ease: 'easeInOut', delay: 0.5 }}
              />
              <MotionDiv
                className="absolute left-1/2 top-[14%] -translate-x-1/2 h-[5px] w-[5px] rounded-full bg-emerald-400/70 blur-[1px]"
                animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 5.1, ease: 'easeInOut', delay: 0.2 }}
              />
            </>
          )}
        </MotionDiv>
      </div>
    </section>
  );
}

/* ============== TRUST BAR ============== */
function TrustBar() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { icon: Building2, text: tt('marketing.agents.trust.enterprise', { defaultValue: 'Enterprise-ready' }) },
    { icon: Lock, text: tt('marketing.agents.trust.rbac', { defaultValue: 'RBAC & Policies' }) },
    { icon: Gauge, text: tt('marketing.agents.trust.fast_setup', { defaultValue: 'Schnelle Inbetriebnahme' }) },
    { icon: ScrollText, text: tt('marketing.agents.trust.audit', { defaultValue: 'Audit-Logs' }) },
  ];
  return (
    <section className="mt-2" aria-label={tt('marketing.agents.trust.aria', { defaultValue: 'Vertrauensfaktoren' })}>
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={Lock} variant="glass">
          {tt('marketing.agents.trust.badge', { defaultValue: 'Vertrauen' })}
        </SectionBadge>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.text}
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-white px-3 py-2 text-[13px] sm:text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <it.icon className="h-4 w-4 text-brand-primary" />
            {it.text}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== ARCHITECTURE ============== */
function Architecture() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { title: tt('marketing.agents.arch.items.business_ai.title', { defaultValue: 'Business AI' }), desc: tt('marketing.agents.arch.items.business_ai.desc', { defaultValue: 'NLU, RAG, Workflows, Governance' }), icon: Bot },
    { title: tt('marketing.agents.arch.items.agents.title', { defaultValue: 'Agents' }), desc: tt('marketing.agents.arch.items.agents.desc', { defaultValue: 'Tools, Memory, Planner, Evaluator' }), icon: Workflow },
    { title: tt('marketing.agents.arch.items.mas.title', { defaultValue: 'MAS' }), desc: tt('marketing.agents.arch.items.mas.desc', { defaultValue: 'Kooperation, Koordination, Auktions-/Kontrakt-Netze' }), icon: Layers3 },
  ];
  return (
    <section className="py-14 md:py-20" aria-labelledby="arch-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={Layers3} variant="glass">
          {tt('marketing.agents.arch.badge', { defaultValue: 'Architektur' })}
        </SectionBadge>
      </div>
      <h2 id="arch-title" className="text-2xl font-bold">
        {tt('marketing.agents.arch.title', { defaultValue: 'Architektur-Layer' })}
      </h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        {tt('marketing.agents.arch.description', { defaultValue: 'Die Ebenen greifen ineinander: vom Geschäftsproblem über den Agenten bis zur multi-agentischen Zusammenarbeit (MAS/MoA). Ergebnis: robuste, skalierbare Automatisierung.' })}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="ui-glass-card p-5 sm:p-6 hover:shadow-md transition-shadow"
          >
            <it.icon className="h-5 w-5 text-brand-primary" />
            <h3 className="mt-3 font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== CAPABILITIES ============== */
function Capabilities() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { icon: Database, title: tt('marketing.agents.cap.items.rag.title', { defaultValue: 'RAG & File Search' }), desc: tt('marketing.agents.cap.items.rag.desc', { defaultValue: 'Semantische Suche, verlässliche Antworten aus deinen Dateien.' }) },
    { icon: Plug, title: tt('marketing.agents.cap.items.actions.title', { defaultValue: 'AI Actions (OpenAPI)' }), desc: tt('marketing.agents.cap.items.actions.desc', { defaultValue: 'APIs als Tools. Domain-Whitelist, sichere Ausführung.' }) },
    { icon: ShieldCheck, title: tt('marketing.agents.cap.items.policies.title', { defaultValue: 'Policies & Governance' }), desc: tt('marketing.agents.cap.items.policies.desc', { defaultValue: 'Grenzen definieren, Berechtigungen steuern, Zugriffe nachweisbar.' }) },
    { icon: Workflow, title: tt('marketing.agents.cap.items.chains.title', { defaultValue: 'Agent Chains (MoA)' }), desc: tt('marketing.agents.cap.items.chains.desc', { defaultValue: 'Bis zu 10 Agenten, Planner/Evaluator, determiniertere Ergebnisse.' }) },
    { icon: Zap, title: tt('marketing.agents.cap.items.artifacts.title', { defaultValue: 'Artifacts & Code' }), desc: tt('marketing.agents.cap.items.artifacts.desc', { defaultValue: 'Interaktive Ausgaben, Remote Code Interpreter für Analysen.' }) },
    { icon: Layers3, title: tt('marketing.agents.cap.items.mcp.title', { defaultValue: 'MCP Tools' }), desc: tt('marketing.agents.cap.items.mcp.desc', { defaultValue: 'Standardisierte Tool-Anbindung via Model Context Protocol.' }) },
  ];
  return (
    <section className="py-14 md:py-20" aria-labelledby="features-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={Zap} variant="glass">
          {tt('marketing.agents.cap.badge', { defaultValue: 'Produkt-Features' })}
        </SectionBadge>
      </div>
      <h2 id="features-title" className="text-2xl font-bold">
        {tt('marketing.agents.cap.title', { defaultValue: 'Fähigkeiten & Produkt-Features' })}
      </h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        {tt('marketing.agents.cap.description', { defaultValue: 'Nicht nur „KI im Chat“ – echte Prozess-Automatisierung: Daten verstehen, Aktionen ausführen, Ergebnisse messen und kontrollieren. Das ist produktive AI.' })}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3" id="features">
        {items.map((it) => (
          <FeatureCard key={it.title} icon={it.icon} title={it.title} desc={it.desc} />
        ))}
      </div>
    </section>
  );
}

/* ============== VALUE PROPS ============== */
function ValueProps() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const props = [
    {
      icon: LineChart,
      title: tt('marketing.agents.value.items.impact.title', { defaultValue: 'Messbarer Business-Impact' }),
      desc: tt('marketing.agents.value.items.impact.desc', { defaultValue: 'Von Ticket-Durchlaufzeiten bis zu SQL-KPI-Reports: Agenten liefern Zahlen statt Versprechen.' }),
    },
    {
      icon: Gauge,
      title: tt('marketing.agents.value.items.ttv.title', { defaultValue: 'Time-to-Value in Tagen' }),
      desc: tt('marketing.agents.value.items.ttv.desc', { defaultValue: 'Vorlagen, No-Code-Setup und Best Practices beschleunigen die Einführung – ohne Big-Bang-Projekt.' }),
    },
    {
      icon: KeySquare,
      title: tt('marketing.agents.value.items.control.title', { defaultValue: 'Hohe Kontrolle' }),
      desc: tt('marketing.agents.value.items.control.desc', { defaultValue: 'Governance, RBAC und Audit-Trails: Du behältst die Hoheit über Daten, Tools und Ergebnisse.' }),
    },
  ];
  return (
    <section className="py-14 md:py-20" aria-labelledby="value-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={LineChart} variant="glass">
          {tt('marketing.agents.value.badge', { defaultValue: 'Business Value' })}
        </SectionBadge>
      </div>
      <h2 id="value-title" className="text-2xl font-bold">{tt('marketing.agents.value.title', { defaultValue: 'Warum AI Agents – jetzt' })}</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {props.map((p) => (
          <FeatureCard 
            key={p.title} 
            icon={p.icon} 
            title={p.title} 
            desc={p.desc} 
            eyebrow={tt('marketing.agents.value.badge_label', { defaultValue: 'Vorteil' })}
          />
        ))}
      </div>
    </section>
  );
}

/* ============== FILES & PERMISSIONS ============== */
function FilesPermissions() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { title: tt('marketing.agents.governance.items.files.title', { defaultValue: 'Datei-Kategorien' }), desc: tt('marketing.agents.governance.items.files.desc', { defaultValue: 'Image, File Search (RAG), Code Interpreter, File Context (OCR).' }) },
    { title: tt('marketing.agents.governance.items.perms.title', { defaultValue: 'Berechtigungen' }), desc: tt('marketing.agents.governance.items.perms.desc', { defaultValue: 'Teilen/Verwalten pro Agent und global – Admin- und User-Level.' }) },
    { title: tt('marketing.agents.governance.items.security.title', { defaultValue: 'Sicherheit' }), desc: tt('marketing.agents.governance.items.security.desc', { defaultValue: 'Zugriff strikt nach RBAC. Sensible Bereiche per Policies schützen.' }) },
  ];
  return (
    <section className="py-14 md:py-20" aria-labelledby="governance-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={ShieldCheck} variant="glass">
          {tt('marketing.agents.governance.badge', { defaultValue: 'Governance' })}
        </SectionBadge>
      </div>
      <h2 id="governance-title" className="text-2xl font-bold">{tt('marketing.agents.governance.title', { defaultValue: 'Dateien, Berechtigungen & Governance' })}</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        {tt('marketing.agents.governance.description', { defaultValue: 'Sicherheit ist kein Add-on. Sie ist Grundlage. Definiere, was Agenten sehen, speichern und ausführen dürfen – nachvollziehbar und revisionssicher.' })}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3" id="governance">
        {items.map((c) => (
          <div key={c.title} className="ui-glass-card p-5 sm:p-6 shadow-sm">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link
          to="/business-ai"
          className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {tt('marketing.agents.governance.link_business_ai', { defaultValue: 'Mehr zu Business AI & Governance' })}
        </Link>
      </div>
    </section>
  );
}

/* ============== USE CASES ============== */
function UseCases() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const cases = [
    { title: tt('marketing.agents.usecases.items.support.title', { defaultValue: 'Support-Automatisierung' }), detail: tt('marketing.agents.usecases.items.support.detail', { defaultValue: 'Intent-Erkennung, Antwortvorschläge, Eskalationslogik, Wissensbasis (RAG).' }) },
    { title: tt('marketing.agents.usecases.items.dev.title', { defaultValue: 'Dev-Assistenz' }), detail: tt('marketing.agents.usecases.items.dev.detail', { defaultValue: 'Refactoring, Doku-Generierung, CI-Checks, Release-Notizen, Issue-Triage.' }) },
    { title: tt('marketing.agents.usecases.items.dataops.title', { defaultValue: 'Data Ops' }), detail: tt('marketing.agents.usecases.items.dataops.detail', { defaultValue: 'SQL-Generierung, KPI-Monitoring, Anomalie-Detektion, Reports als Artefakte.' }) },
    { title: tt('marketing.agents.usecases.items.salesops.title', { defaultValue: 'Sales Ops' }), detail: tt('marketing.agents.usecases.items.salesops.detail', { defaultValue: 'Lead-Qualifizierung, CRM-Updates via Actions, Angebots-Drafts, Follow-ups.' }) },
    { title: tt('marketing.agents.usecases.items.hr.title', { defaultValue: 'HR & Compliance' }), detail: tt('marketing.agents.usecases.items.hr.detail', { defaultValue: 'Policy-Q&A, Onboarding-Guides, Richtlinien-Prüfung und Audit-Protokolle.' }) },
  ];
  return (
    <section id="usecases" className="py-14 md:py-20" aria-labelledby="usecases-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={LineChart} variant="glass">
          {tt('marketing.agents.usecases.badge', { defaultValue: 'Use-Cases' })}
        </SectionBadge>
      </div>
      <h2 id="usecases-title" className="text-2xl font-bold">{tt('marketing.agents.usecases.title', { defaultValue: 'Use-Cases – von Idee zu Output' })}</h2>
      <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">
        {tt('marketing.agents.usecases.description', { defaultValue: 'Wir denken vom Ergebnis her: weniger Klicks, weniger Wartezeit, mehr Klarheit. Agenten helfen dort, wo Geschwindigkeit und Konsistenz zählen.' })}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {cases.map((c) => (
          <FeatureCard key={c.title} title={c.title} desc={c.detail} />
        ))}
      </div>
    </section>
  );
}

/* ============== BEST PRACTICES ============== */
function BestPractices() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const tips = [
    tt('marketing.agents.best.t1', { defaultValue: 'Klare Rollen & kurze Instructions. Ambiguität vermeiden.' }),
    tt('marketing.agents.best.t2', { defaultValue: 'Nur notwendige Tools aktivieren. Geringere Fehlerquote.' }),
    tt('marketing.agents.best.t3', { defaultValue: 'Agent-Ketten schrittweise testen. Max Steps begrenzen.' }),
    tt('marketing.agents.best.t4', { defaultValue: 'Sensiblen Zugriff nur über Policies & Berechtigungen.' }),
    tt('marketing.agents.best.t5', { defaultValue: 'Ziele messbar machen: Artefakte, Metriken, Logs.' }),
  ];
  return (
    <section className="py-14 md:py-20" aria-labelledby="best-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={ScrollText} variant="glass">
          {tt('marketing.agents.best.badge', { defaultValue: 'Best Practices' })}
        </SectionBadge>
      </div>
      <h2 id="best-title" className="text-2xl font-bold">{tt('marketing.agents.best.title', { defaultValue: 'Best Practices – robust statt verspielt' })}</h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {tips.map((t, i) => (
          <li key={`tip-${i}`} className="ui-glass-card p-4 sm:p-5 text-sm hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============== FAQ ============== */
function FAQ() {
  const { t } = useTranslation();
  // permissive translation fn to avoid TS i18n union overloads
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <FAQSection
      id="faq"
      pagePath="/ai-agents"
      enableStructuredData={true}
      variant="compact"
      layout="accordion"
      badgeText={tt('marketing.agents.faq.badge', { defaultValue: 'Häufige Fragen' })}
      badgeIcon={ScrollText}
      title={tt('marketing.agents.faq.title', { defaultValue: 'FAQ' })}
      items={[
        { q: tt('marketing.agents.faq.q1.q', { defaultValue: 'Was sind AI Agents und wofür eignen sie sich?' }), a: tt('marketing.agents.faq.q1.a', { defaultValue: 'Spezialisierte KI‑Einheiten, die Tools & Wissen nutzen – ideal für Support, Data Ops, Sales Ops u. v. m.' }) },
        { q: tt('marketing.agents.faq.q2.q', { defaultValue: 'Wie funktionieren AI Agents technisch?' }), a: tt('marketing.agents.faq.q2.a', { defaultValue: 'Tools/Actions (OpenAPI), Memory/RAG, Planner/Evaluator – optional in Ketten (MoA).' }) },
        { q: tt('marketing.agents.faq.q3.q', { defaultValue: 'Brauche ich Codekenntnisse?' }), a: tt('marketing.agents.faq.q3.a', { defaultValue: 'Nein. No‑Code Agent Builder. Entwickleroptionen sind optional.' }) },
        { q: tt('marketing.agents.faq.q4.q', { defaultValue: 'Wie integriere ich eigene Daten (RAG)?' }), a: tt('marketing.agents.faq.q4.a', { defaultValue: 'Über File Search/Vektorindizes mit Grounding & Citations für belastbare Antworten.' }) },
        { q: tt('marketing.agents.faq.q5.q', { defaultValue: 'Wie sicher sind Actions?' }), a: tt('marketing.agents.faq.q5.a', { defaultValue: 'Domain‑Whitelist, Policies, RBAC. Nur explizit erlaubte Endpunkte/Parameter.' }) },
        { q: tt('marketing.agents.faq.q6.q', { defaultValue: 'Unterstützt ihr mehrere Modelle?' }), a: tt('marketing.agents.faq.q6.a', { defaultValue: 'Ja – Multiprovider: OpenAI, Anthropic, Google, Mistral, Groq, DeepSeek, Azure, AWS u. a.' }) },
        { q: tt('marketing.agents.faq.q7.q', { defaultValue: 'Wie starte ich am schnellsten?' }), a: tt('marketing.agents.faq.q7.a', { defaultValue: 'Kleiner Pilot‑Use‑Case, messen (KPIs/Artefakte), dann schrittweise erweitern.' }) },
        { q: tt('marketing.agents.faq.q8.q', { defaultValue: 'Was kostet der Einsatz?' }), a: tt('marketing.agents.faq.q8.a', { defaultValue: 'Abhängig von Modell, Kontext, Tool‑Aufrufen. Kostenlimits & Kalkulator nutzen.' }) },
        { q: tt('marketing.agents.faq.q9.q', { defaultValue: 'Wie messe ich Qualität & Erfolg?' }), a: tt('marketing.agents.faq.q9.a', { defaultValue: 'Tracing, Metriken, A/B‑Tests, automatisierte Evaluation, Human‑in‑the-Loop.' }) },
        { q: tt('marketing.agents.faq.q10.q', { defaultValue: 'Welche Grenzen haben AI Agents?' }), a: tt('marketing.agents.faq.q10.a', { defaultValue: 'Ohne Grounding drohen Halluzinationen. Klare Ziele & Guardrails helfen.' }) },
        { q: tt('marketing.agents.faq.q11.q', { defaultValue: 'Wie binde ich Actions sicher ein?' }), a: tt('marketing.agents.faq.q11.a', { defaultValue: 'OpenAPI importieren, whitelisten, validieren, Rollenrechte zuweisen.' }) },
        { q: tt('marketing.agents.faq.q12.q', { defaultValue: 'Wie vermeide ich Vendor‑Lock‑in?' }), a: tt('marketing.agents.faq.q12.a', { defaultValue: 'Multiprovider‑Strategie, austauschbare Modelle, Tools via Standard (MCP).' }) },
      ]}
    />
  );
}

/* ============== CTA ============== */
function CTA() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <section className="py-14 md:py-20" aria-labelledby="cta-title">
      <div className="mb-3 md:mb-4">
        <SectionBadge icon={Zap} variant="glass">
          {tt('marketing.agents.cta.badge', { defaultValue: 'Jetzt starten' })}
        </SectionBadge>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 text-center text-gray-50 shadow-lg dark:bg-gray-900">
        {/* Subtle brand gradient accents (consistent with page brand) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-primary/15 via-brand-accent/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-gradient-to-tr from-brand-accent/15 to-transparent blur-3xl" />
          <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-gradient-to-tr from-brand-primary/12 to-transparent blur-2xl" />
        </div>

        <h3 id="cta-title" className="text-2xl font-bold tracking-tight">{tt('marketing.agents.cta.title', { defaultValue: 'Starte mit AI Agents – sicher & messbar' })}</h3>
        <p className="mt-2 text-gray-300">{tt('marketing.agents.cta.subtitle', { defaultValue: 'Erstelle deinen ersten Agenten in Minuten. Governance inklusive.' })}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/c/new"
            aria-label={tt('marketing.agents.cta.primary_aria', { defaultValue: 'AI Agents jetzt im AI Chat testen' })}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary/60"
            onClick={() => track('cta_click', { location: 'cta_section', target: 'primary_test' })}
          >
            {tt('marketing.agents.cta.primary', { defaultValue: 'Jetzt testen' })}
          </Link>
          <Link
            to="/ai-agents/mas"
            className="inline-flex items-center rounded-md border border-brand-primary/70 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary/20 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary/60"
            onClick={() => track('cta_click', { location: 'cta_section', target: 'mas_info' })}
          >
            {tt('marketing.agents.cta.secondary_mas', { defaultValue: 'MAS kennenlernen' })}
          </Link>
          <Link
            to="/pricing#calculator"
            className="inline-flex items-center rounded-md border border-brand-primary/70 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary/20 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary/60"
            onClick={() => track('cta_click', { location: 'cta_section', target: 'pricing_details' })}
          >
            {tt('marketing.agents.cta.secondary_pricing', { defaultValue: 'Pricing-Details' })}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============== FOOTER ============== */
function Footer() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <footer className="py-8 text-sm text-gray-600 dark:text-gray-400">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <span>{tt('marketing.footer.copyright', { year: new Date().getFullYear(), defaultValue: '© {{year}} SIGMACODE AI' })}</span>
        <nav aria-label={tt('marketing.footer.nav_aria', { defaultValue: 'Footer Navigation' })} className="flex items-center gap-4">
          <Link className="hover:underline" to="/pricing">{tt('marketing.footer.pricing', { defaultValue: 'Preise' })}</Link>
          <a className="hover:underline" href="#usecases">{tt('marketing.footer.usecases', { defaultValue: 'Use-Cases' })}</a>
          <Link className="hover:underline" to="/business-ai">{tt('marketing.footer.business_ai', { defaultValue: 'Business AI' })}</Link>
        </nav>
      </div>
    </footer>
  );
}
