import SEO from '../../components/marketing/SEO';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Transition } from 'framer-motion';
import {
  Layers3,
  Workflow,
  Gauge,
  ShieldCheck,
  Zap,
  Sparkles,
  Brain,
  CircuitBoard,
  Bot,
  Database,
  Lock,
  Activity,
  Cpu,
  BadgeCheck,
} from 'lucide-react';
import SectionBadge from '../../components/marketing/SectionBadge';
import useLocalize from '../../hooks/useLocalize';
import { Badge, Button } from '../../components/ui';
import FAQSection from '../../components/marketing/FAQSection';
import BadgeGroup from '../../components/marketing/BadgeGroup';
import BackButton from '../../components/marketing/BackButton';

// Typed motion.div wrapper to satisfy TS where Motion props are not inferred
// Hinweis: In dieser Codebase gibt es eine Typinkompatibilität zwischen unserer TS/React-Version
// und den Framer-Motion-Typen (Props wie initial/animate/whileInView werden nicht erkannt).
// Runtime-funktional ist alles korrekt. Wir kapseln daher motion.div in einen getypten Wrapper,
// der Props akzeptiert. Sicherheitsrelevant ist das nicht (nur UI-Animationen).
// Edge-Case-Workaround, bis die lib-Versionen vereinheitlicht sind.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as unknown as React.FC<any>;

export default function AgentsMAS() {
  const t = useLocalize();

  return (
    <>
      <SEO
        title={t('marketing.mas.seo.title', { defaultValue: 'MAS – Multi‑Agent Orchestrierung' })}
        description={t('marketing.mas.seo.description', { defaultValue: 'Orchestriere spezialisierte Agents als Team – Policies, RAG, Monitoring, Observability.' })}
        canonical="/ai-agents"
        robots="index,follow"
        openGraph={{
          title: t('marketing.mas.og.title', { defaultValue: 'Multi‑Agent System – Orchestrierung & Qualität' }),
          description: t('marketing.mas.og.description', { defaultValue: 'Planner, Executor, Evaluator – koordinierte Agents mit Guardrails und KPIs.' }),
          type: 'website',
          url: `${window.location.origin}/ai-agents`,
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary',
          title: t('marketing.mas.twitter.title', { defaultValue: 'MAS – Multi‑Agent Orchestrierung' }),
          description: t('marketing.mas.twitter.description', { defaultValue: 'Orchestrierung, Policies, RAG und Observability.' }),
        }}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: t('marketing.mas.software_name', { defaultValue: 'SIGMACODE MAS – Multi-Agent Orchestration' }),
          applicationCategory: t('marketing.mas.software_category', { defaultValue: 'BusinessApplication' }),
          operatingSystem: t('marketing.mas.software_os', { defaultValue: 'Web' }),
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          url: `${window.location.origin}/ai-agents`,
          description: t('marketing.mas.software_description', { defaultValue: 'SIGMACODE MAS orchestriert spezialisierte AI Agents für komplexe Workflows. Mit Policies, RAG-Integration, Monitoring und Observability.' }),
          publisher: { '@type': 'Organization', name: t('marketing.mas.software_publisher', { defaultValue: 'SIGMACODE AI' }) },
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <div className="mb-4">
          <BackButton />
        </div>
        <Hero />
        <Orchestration />
        <Coordination />
        <Limits />
        <FAQ />
        <CTA />
      </main>
    </>
  );
}

/* ===== Hero ===== */
function Hero() {
  const t = useLocalize();
  const reduceMotion = useReducedMotion();
  // "Sigmacode AI" immer in einer Zeile halten (geschütztes Leerzeichen)
  const nobreakSigmacodeAI = (s: string) => s.replace(/(sigmacode)\s+(ai)/gi, '$1\u00A0$2');
  // Shared animation helpers to avoid re-creating objects and sync timings
  // Bezier curve as array (compatible across Framer Motion versions)
  const easeOut = [0.22, 1, 0.36, 1] as const; // smooth ease-out
  const floatAnim = (
    amp = 4,
    rot = 1.2,
  ) => (reduceMotion ? undefined : { y: [0, -amp, 0], rotate: [0, -rot, 0] });
  const floatAnimDown = (
    amp = 4,
    rot = 1.2,
  ) => (reduceMotion ? undefined : { y: [0, amp, 0], rotate: [0, rot, 0] });
  const floatTransition = (duration = 3, delay = 0): Transition | undefined =>
    reduceMotion
      ? undefined
      : ({ repeat: Infinity, repeatType: 'mirror', duration, delay, ease: easeOut } as unknown as Transition);
  const gpuStyle: React.CSSProperties = { willChange: 'transform', transform: 'translate3d(0,0,0)' };
  // Orbit animations: continuous rotation for rings and carriers
  const orbitRotate = (dir: 1 | -1 = 1, duration = 28, delay = 0): Transition | undefined =>
    reduceMotion
      ? undefined
      : ({ repeat: Infinity, ease: 'linear', duration, delay } as Transition);
  const orbitAnim = (dir: 1 | -1 = 1) => (reduceMotion ? {} : { rotate: 360 * dir });
  const orbitCarrierStyle: React.CSSProperties = {
    willChange: 'transform',
    transform: 'translate3d(0,0,0)',
    transformOrigin: '50% 50%'
  };
  const heroBadges = [
    { icon: Sparkles, text: t('marketing.mas.hero.badge_auto_orchestrierung', { defaultValue: 'Auto-Orchestrierung' }), variant: 'glass' as const, size: 'sm' as const, tone: 'teal' as const },
    { icon: Database, text: t('marketing.mas.hero.badge_rag_ready', { defaultValue: 'RAG-Ready' }), variant: 'glass' as const, size: 'sm' as const, tone: 'teal' as const },
    { icon: Lock, text: t('marketing.mas.hero.badge_rbac_policies', { defaultValue: 'RBAC & Policies' }), variant: 'glass' as const, size: 'sm' as const, tone: 'teal' as const },
    { icon: Activity, text: t('marketing.mas.hero.badge_observability', { defaultValue: 'Observability' }), variant: 'glass' as const, size: 'sm' as const, tone: 'amber' as const },
  ];
  return (
    <section className="relative overflow-visible min-h-[calc(100svh-var(--header-h))] md:min-h-[calc(100vh-var(--header-h))] py-12 md:py-16 bg-gray-900 text-gray-50 rounded-2xl" aria-labelledby="hero-title">
      <div className="grid grid-cols-1 items-center gap-8 md:[grid-template-columns:1fr_1.2fr]">
        <div className="px-4 sm:px-6 md:pr-8">
          <SectionBadge icon={Layers3} variant="glass" tone="teal">
            {t('marketing.mas.hero.section_badge', { defaultValue: 'Multi‑Agent System' })}
          </SectionBadge>
          <h1 id="hero-title" className="text-3xl sm:text-[2rem] font-extrabold leading-tight text-white drop-shadow-md">
            {nobreakSigmacodeAI(t('marketing.mas.hero.title', { defaultValue: 'MAS – Multi-Agent Orchestrierung' }))}
          </h1>
          <p className="mt-2 text-sm md:text-[15px] text-gray-300">
            {nobreakSigmacodeAI(t('marketing.mas.hero.subtitle', { defaultValue: 'Koordiniere spezialisierte Agents als Team: Aufgaben verteilen, Feedback integrieren und Ergebnisse konsolidieren – für robuste, skalierbare AI-Workflows.' }))}
          </p>
          <MotionDiv
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.1, ease: easeOut }}
            className="mt-4"
          >
            <BadgeGroup items={heroBadges} />
          </MotionDiv>
          <div className="mt-5 flex gap-2.5">
            <Button variant="primary" asChild>
              <Link to="/c/new" aria-label={t('marketing.mas.hero.button_start_aria', { defaultValue: 'AI Chat öffnen' })}>
                {t('marketing.mas.hero.button_start', { defaultValue: 'Jetzt starten' })}
              </Link>
            </Button>
            <Link to="/business-ai" className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">{t('marketing.mas.hero.button_business_ai', { defaultValue: 'Business AI' })}</Link>
          </div>
        </div>
        {/* Floating Illustration: Höhe angeglichen, Icons sichtbar, kein Clipping */}
        <MotionDiv
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: easeOut }}
          className="relative w-full overflow-hidden h-64 sm:h-72 md:h-80 p-4 sm:p-5"
          aria-hidden="true"
        >
          {/* Center node */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="relative">
              <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-brand-primary/40 bg-white/80 text-brand-primary shadow-sm backdrop-blur dark:border-brand-primary/30 dark:bg-gray-900/70">
                <Layers3 className="h-6 w-6" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-brand-primary/10 blur-xl" />
            </div>
          </div>

          {/* Orbits container */}
          <div className="absolute inset-0 grid place-items-center">
            {/* Outer orbit ring */}
            <MotionDiv
              className="relative rounded-full"
              style={{ width: '18rem', height: '18rem', ...gpuStyle }}
              animate={orbitAnim(1)}
              transition={orbitRotate(1, 46)}
            >
              {/* Orbiting icons on outer ring */}
              <MotionDiv
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={orbitCarrierStyle}
                animate={orbitAnim(1)}
                transition={orbitRotate(1, 18)}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 shadow-sm text-amber-600 dark:bg-gray-900/80 dark:text-amber-400">
                  <Zap className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv
                className="absolute left-0 top-1/2 -translate-y-1/2"
                style={orbitCarrierStyle}
                animate={orbitAnim(1)}
                transition={orbitRotate(1, 18, 2)}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 shadow-sm text-teal-600 dark:bg-gray-900/80 dark:text-teal-400">
                  <CircuitBoard className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv
                className="absolute left-1/2 bottom-0 -translate-x-1/2"
                style={orbitCarrierStyle}
                animate={orbitAnim(1)}
                transition={orbitRotate(1, 18, 4)}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 shadow-sm text-pink-600 dark:bg-gray-900/80 dark:text-pink-400">
                  <Brain className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv
                className="absolute right-0 top-1/2 -translate-y-1/2"
                style={orbitCarrierStyle}
                animate={orbitAnim(1)}
                transition={orbitRotate(1, 18, 6)}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 shadow-sm text-brand-primary dark:bg-gray-900/80">
                  <Workflow className="h-4 w-4" />
                </div>
              </MotionDiv>
            </MotionDiv>

            {/* Inner orbit ring */}
            <MotionDiv
              className="absolute rounded-full"
              style={{ width: '12rem', height: '12rem', ...gpuStyle }}
              animate={orbitAnim(-1)}
              transition={orbitRotate(-1, 32)}
            >
              <MotionDiv
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={orbitCarrierStyle}
                animate={orbitAnim(-1)}
                transition={orbitRotate(-1, 12)}
              >
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white/90 shadow-sm text-brand-primary dark:bg-gray-900/80">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </MotionDiv>
              <MotionDiv
                className="absolute left-1/2 bottom-0 -translate-x-1/2"
                style={orbitCarrierStyle}
                animate={orbitAnim(-1)}
                transition={orbitRotate(-1, 12, 3)}
              >
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white/90 shadow-sm text-emerald-600 dark:bg-gray-900/80 dark:text-emerald-400">
                  <Database className="h-4 w-4" />
                </div>
              </MotionDiv>
            </MotionDiv>
          </div>

          <MotionDiv
            className="absolute right-6 top-12 rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm shadow-sm backdrop-blur dark:bg-gray-900/80"
            style={gpuStyle}
            animate={floatAnim(4, 1.2)}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2, rotate: -1 }}
            transition={floatTransition(3, 0)}
            title={t('marketing.mas.hero.planner_tooltip', { defaultValue: 'Planner – bricht Ziele in Teilaufgaben' })}
            aria-label={t('marketing.mas.hero.planner_tooltip', { defaultValue: 'Planner – bricht Ziele in Teilaufgaben' })}
            role="note"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
              }
            }}
          >
            <span className="inline-flex items-center gap-2 hover:ring-1 hover:ring-brand-primary/30 rounded-md px-0.5">
              <Workflow className="h-4 w-4 text-brand-primary" /> {t('marketing.mas.hero.planner', { defaultValue: 'Planner' })}
            </span>
          </MotionDiv>
          <MotionDiv
            className="absolute bottom-8 left-8 rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm shadow-sm backdrop-blur dark:bg-gray-900/80"
            style={gpuStyle}
            animate={floatAnimDown(4, 1.2)}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: 2, rotate: 1 }}
            transition={floatTransition(3.2, 0.2)}
            title={t('marketing.mas.hero.evaluator_tooltip', { defaultValue: 'Evaluator – prüft und konsolidiert Ergebnisse' })}
            aria-label={t('marketing.mas.hero.evaluator_tooltip', { defaultValue: 'Evaluator – prüft und konsolidiert Ergebnisse' })}
            role="note"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
              }
            }}
          >
            <span className="inline-flex items-center gap-2 hover:ring-1 hover:ring-amber-300/30 rounded-md px-0.5">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" /> {t('marketing.mas.hero.evaluator', { defaultValue: 'Evaluator' })}
            </span>
          </MotionDiv>
          <MotionDiv
            className="absolute left-6 top-14"
            style={gpuStyle}
            animate={floatAnim(3, 1)}
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -1, rotate: -1 }}
            transition={floatTransition(3.6, 0.4)}
            title={t('marketing.mas.hero.reasoner_tooltip', { defaultValue: 'Reasoner – denkt, plant und erklärt Schritte' })}
            aria-label={t('marketing.mas.hero.reasoner_tooltip', { defaultValue: 'Reasoner – denkt, plant und erklärt Schritte' })}
            role="note"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
              }
            }}
          >
            <Badge icon={Brain} variant="glass" size="sm" tone="pink" className="ring-1 ring-pink-300/30 dark:ring-pink-400/20 hover:ring-pink-300/50 transition-colors duration-200">{t('marketing.mas.hero.reasoner', { defaultValue: 'Reasoner' })}</Badge>
          </MotionDiv>
          <MotionDiv
            className="absolute right-10 bottom-12"
            style={gpuStyle}
            animate={floatAnimDown(3, 1)}
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: 1, rotate: 1 }}
            transition={floatTransition(3.8, 0.6)}
            title={t('marketing.mas.hero.tooluse_tooltip', { defaultValue: 'Tool‑Use – nutzt Tools/APIs & RAG' })}
            aria-label={t('marketing.mas.hero.tooluse_tooltip', { defaultValue: 'Tool‑Use – nutzt Tools/APIs & RAG' })}
            role="note"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
              }
            }}
          >
            <Badge icon={CircuitBoard} variant="outline" size="sm" tone="teal" className="ring-1 ring-teal-300/30 dark:ring-teal-400/20 hover:ring-teal-300/50 transition-colors duration-200">{t('marketing.mas.hero.tool_use', { defaultValue: 'Tool-Use' })}</Badge>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}

/* ===== Orchestration ===== */
function Orchestration() {
  const t = useLocalize();
  const items = [
    { title: t('marketing.mas.orchestration.title_1', { defaultValue: 'Rollen & Verantwortungen' }), desc: t('marketing.mas.orchestration.desc_1', { defaultValue: 'Spezialisierte Agents übernehmen klar definierte Aufgaben und steigern so Effizienz und Qualität.' }), icon: Layers3, tags: [t('marketing.mas.orchestration.tag_1', { defaultValue: 'Spezialisierung' }), t('marketing.mas.orchestration.tag_2', { defaultValue: 'Ownership' })] },
    { title: t('marketing.mas.orchestration.title_2', { defaultValue: 'Kommunikation' }), desc: t('marketing.mas.orchestration.desc_2', { defaultValue: 'Agents tauschen Zwischenresultate aus, nutzen Feedback-Schleifen und sichern Validierung ab.' }), icon: Workflow, tags: [t('marketing.mas.orchestration.tag_3', { defaultValue: 'Feedback' }), t('marketing.mas.orchestration.tag_4', { defaultValue: 'Review' })] },
    { title: t('marketing.mas.orchestration.title_3', { defaultValue: 'Konsolidierung' }), desc: t('marketing.mas.orchestration.desc_3', { defaultValue: 'Finale Antworten werden aggregiert, Konflikte erkannt und aufgelöst.' }), icon: Gauge, tags: [t('marketing.mas.orchestration.tag_5', { defaultValue: 'Merge' }), t('marketing.mas.orchestration.tag_6', { defaultValue: 'Resolve' })] },
  ];
  return (
    <section id="orchestration" className="py-8 md:py-12">
      <h2 className="text-xl font-semibold">{t('marketing.mas.orchestration.title', { defaultValue: 'Orchestrierung' })}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card ui-glass-card-hover p-4 shadow-sm transition-shadow hover:shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/30 bg-white/80 text-brand-primary dark:border-brand-primary/25 dark:bg-gray-900/20">
                {it.icon ? <it.icon className="h-5 w-5 text-brand-primary" /> : null}
              </div>
              <h3 className="text-base md:text-lg font-semibold leading-snug tracking-[-0.01em]">{it.title}</h3>
            </div>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {it.tags?.map((t) => (
                <Badge key={t} variant="glass" size="sm" tone="teal" className="px-2 py-0.5">{t}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== Coordination ===== */
function Coordination() {
  const t = useLocalize();
  const items = [
    { title: t('marketing.mas.coordination.title_1', { defaultValue: 'Kontrakt-/Auktionsnetze' }), desc: t('marketing.mas.coordination.desc_1', { defaultValue: 'Aufgabenvergabe nach Kompetenz/Score – transparente und faire Auswahlprozesse.' }), icon: Bot, tags: [t('marketing.mas.coordination.tag_1', { defaultValue: 'Scoring' }), t('marketing.mas.coordination.tag_2', { defaultValue: 'Fairness' })] },
    { title: t('marketing.mas.coordination.title_2', { defaultValue: 'Bewertung' }), desc: t('marketing.mas.coordination.desc_2', { defaultValue: 'Qualitätsmetriken und Konsensus-Mechanismen sichern zuverlässige Ergebnisse.' }), icon: BadgeCheck, tags: [t('marketing.mas.coordination.tag_3', { defaultValue: 'QA' }), t('marketing.mas.coordination.tag_4', { defaultValue: 'Consensus' })] },
    { title: t('marketing.mas.coordination.title_3', { defaultValue: 'Fehlertoleranz' }), desc: t('marketing.mas.coordination.desc_3', { defaultValue: 'Fallback-Agents, Retry-Strategien und Grenzwerte für maximale Stabilität.' }), icon: ShieldCheck, tags: [t('marketing.mas.coordination.tag_5', { defaultValue: 'Retry' }), t('marketing.mas.coordination.tag_6', { defaultValue: 'Limits' })] },
  ];
  return (
    <section id="coordination" className="py-8 md:py-12">
      <h2 className="text-xl font-semibold">{t('marketing.mas.coordination.title', { defaultValue: 'Koordination' })}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card ui-glass-card-hover p-4 shadow-sm transition-shadow hover:shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/30 bg-white/80 text-brand-primary dark:border-brand-primary/25 dark:bg-gray-900/20">
                {it.icon ? <it.icon className="h-5 w-5 text-brand-primary" /> : null}
              </div>
              <h3 className="text-base md:text-lg font-semibold leading-snug tracking-[-0.01em]">{it.title}</h3>
            </div>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {it.tags?.map((t) => (
                <Badge key={t} variant="glass" size="sm" tone="teal" className="px-2 py-0.5">{t}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== Limits ===== */
function Limits() {
  const t = useLocalize();
  const items = [
    { title: t('marketing.mas.limits.title_1', { defaultValue: 'Max Steps' }), desc: t('marketing.mas.limits.desc_1', { defaultValue: 'Iteration pro Kette begrenzen – für Kosten- und Risikokontrolle.' }), icon: Cpu, tags: [t('marketing.mas.limits.tag_1', { defaultValue: 'Budget' }), t('marketing.mas.limits.tag_2', { defaultValue: 'Timebox' })] },
    { title: t('marketing.mas.limits.title_2', { defaultValue: 'Rollen-Policies' }), desc: t('marketing.mas.limits.desc_2', { defaultValue: 'Nur autorisierte Tools und Aktionen – RBAC, Domain-Whitelists.' }), icon: Lock, tags: [t('marketing.mas.limits.tag_3', { defaultValue: 'RBAC' }), t('marketing.mas.limits.tag_4', { defaultValue: 'Scope' })] },
    { title: t('marketing.mas.limits.title_3', { defaultValue: 'Monitoring' }), desc: t('marketing.mas.limits.desc_3', { defaultValue: 'Protokollierung, Audit-Logs, Metriken und Alerts für volle Transparenz.' }), icon: Activity, tags: [t('marketing.mas.limits.tag_5', { defaultValue: 'Logging' }), t('marketing.mas.limits.tag_6', { defaultValue: 'Alerts' })] },
  ];
  return (
    <section id="limits" className="py-8 md:py-12">
      <h2 className="text-xl font-semibold">{t('marketing.mas.limits.title', { defaultValue: 'Limits & Sicherheit' })}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card ui-glass-card-hover p-4 shadow-sm transition-shadow hover:shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/30 bg-white/80 text-brand-primary dark:border-brand-primary/25 dark:bg-gray-900/20">
                {it.icon ? <it.icon className="h-5 w-5 text-brand-primary" /> : null}
              </div>
              <h3 className="text-base md:text-lg font-semibold leading-snug tracking-[-0.01em]">{it.title}</h3>
            </div>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {it.tags?.map((t) => (
                <Badge key={t} variant="glass" size="sm" tone="amber" className="px-2 py-0.5">{t}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== FAQ ===== */
function FAQ() {
  const t = useLocalize();
  return (
    <FAQSection
      id="faq"
      title={t('marketing.mas.faq.title', { defaultValue: 'FAQ' })}
      pagePath="/ai-agents"
      variant="compact"
      items={[
        {
          q: t('marketing.mas.faq.q1.q', { defaultValue: 'Was ist ein Multi-Agent System (MAS) und wann brauche ich es?' }),
          a: (
            <>
              <p>
                {t('marketing.mas.faq.q1.a', {
                  defaultValue:
                    'Ein MAS besteht aus spezialisierten Agents (z. B. Researcher, Planner, Executor, Evaluator), die koordiniert zusammenarbeiten. Es lohnt sich bei mehrstufigen, komplexen Aufgaben mit unterschiedlichen Kompetenzen.'
                })}
              </p>
              <ul>
                <li>Strategie & Planung mit Prüfschleifen</li>
                <li>Recherche + Synthese mit Quellen-Prüfung (RAG)</li>
                <li>Tool-gestützte Ausführung und Qualitätskontrollen</li>
              </ul>
            </>
          ),
          keywords: ['Multi-Agent', 'Planner', 'Evaluator', 'RAG'],
        },
        {
          q: t('marketing.mas.faq.q2.q', { defaultValue: 'Wie funktioniert MAS-Orchestrierung?' }),
          a: (
            <>
              <p>
                Rollen, Aufgabenverteilung und Feedback-Schleifen greifen ineinander. Ein Planner weist Aufgaben zu, ein Evaluator prüft Ergebnisse, Konflikte werden konsolidiert.
              </p>
              <ol>
                <li>Planner bricht Ziele in Teilaufgaben</li>
                <li>Ausführung parallel oder in Ketten</li>
                <li>Evaluator bewertet, konsolidiert und verbessert</li>
              </ol>
            </>
          ),
          keywords: ['Orchestrierung', 'Workflow', 'Feedback-Loops'],
        },
        {
          q: t('marketing.mas.faq.q5.q', { defaultValue: 'Wie kombiniere ich MAS mit RAG und Unternehmensdaten?' }),
          a: (
            <>
              <p>
                Retriever-Agents liefern faktenbasierten Kontext (Vektorsuche, Dateien). Andere Agents nutzen diesen für Planung, Ausführung und Validierung. Citations sichern Nachvollziehbarkeit.
              </p>
              <ul>
                <li>Domänenspezifische Embeddings & Chunking</li>
                <li>Grounding mit Quellen & Relevanz-Scoring</li>
                <li>Delta‑Sync hält Wissensbasen aktuell</li>
              </ul>
            </>
          ),
          keywords: ['RAG', 'Retriever', 'Citations', 'Vektor DB'],
        },
        {
          q: t('marketing.mas.faq.q4.q', { defaultValue: 'Wie sichere ich MAS ab?' }),
          a: (
            <>
              <p>RBAC, Policies pro Rolle, Domain‑Whitelists und Limits (Max Steps) sorgen für kontrollierbare Abläufe.</p>
              <ul>
                <li>Least‑Privilege Policies pro Rolle</li>
                <li>Action/Gateway‑Guardrails mit Audit‑Logs</li>
                <li>Provider‑Isolation & Secrets‑Management</li>
              </ul>
            </>
          ),
          keywords: ['RBAC', 'Policies', 'Security', 'Compliance'],
        },
        {
          q: t('marketing.mas.faq.q6.q', { defaultValue: 'Skalierung und Kosten: Wie bleibe ich effizient?' }),
          a: (
            <>
              <p>Parallelisierung, Kostenlimits, günstige Modelle für Zwischenschritte und Caching sparen Budget bei stabiler Qualität.</p>
              <ul>
                <li>Modellmix (Light‑Modelle für Zwischenschritte)</li>
                <li>Budget‑ und Zeitbox‑Kontrollen</li>
                <li>Ergebnis‑Caching & Wiederverwendung</li>
              </ul>
            </>
          ),
          keywords: ['Kosten', 'Skalierung', 'Caching', 'Latenz'],
        },
        {
          q: t('marketing.mas.faq.q8.q', { defaultValue: 'Wie messe ich Qualität in MAS?' }),
          a: (
            <>
              <p>Tracing, Metriken (Kosten, Latenz, Erfolgsquote), automatische Evaluation/Scoring sowie Human‑in‑the‑Loop erhöhen Zuverlässigkeit.</p>
              <ul>
                <li>Run‑Tracing & Tool‑Nutzungsanalyse</li>
                <li>A/B‑Tests mit Scorecards</li>
                <li>Human Review bei kritischen Pfaden</li>
              </ul>
            </>
          ),
          keywords: ['Observability', 'Evaluation', 'A/B‑Test'],
        },
        {
          q: t('marketing.mas.faq.q10.q', { defaultValue: 'Wie teste und rolle ich MAS sicher aus?' }),
          a: (
            <>
              <p>Staging, Feature‑Flags, Canary‑Runs und Audit‑Logs. Start klein, messen, dann skalieren.</p>
              <ul>
                <li>Canary & Feature Gates</li>
                <li>Versionierte Agents & Change‑Management</li>
                <li>Rollback‑Strategien und Eskalationspfade</li>
              </ul>
            </>
          ),
          keywords: ['Rollout', 'Canary', 'Feature Flags'],
        },
      ]}
    />
  );
}

/* ===== CTA ===== */
function CTA() {
  const t = useLocalize();
  return (
    <section className="py-10 md:py-14">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-10 text-center text-gray-50 shadow-lg dark:bg-gray-900">
        {/* Subtle inner gradient tint for depth (works in dark mode) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-400/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-400/10 to-transparent blur-3xl" />
          <div className="absolute -right-16 top-6 h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-400/10 to-transparent blur-2xl" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight">{t('marketing.mas.cta.title', { defaultValue: 'Starte mit Multi‑Agent Orchestrierung' })}</h3>
        <p className="mt-2 text-gray-300">{t('marketing.mas.cta.subtitle', { defaultValue: 'Teste MAS live im AI Chat – mit Policies, RAG und Monitoring.' })}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Badge
            icon={ShieldCheck}
            variant="glass"
            size="sm"
            tone="teal"
            className="bg-white/10 border-white/20 text-white ring-1 ring-teal-300/20 dark:ring-teal-400/20 hover:ring-teal-300/40 transition-colors duration-200"
          >
            {t('marketing.mas.cta.badge_policies', { defaultValue: 'Sichere Policies' })}
          </Badge>
          <Badge
            icon={Database}
            variant="glass"
            size="sm"
            tone="teal"
            className="bg-white/10 border-white/20 text-white ring-1 ring-teal-300/20 dark:ring-teal-400/20 hover:ring-teal-300/40 transition-colors duration-200"
          >
            {t('marketing.mas.cta.badge_rag', { defaultValue: 'RAG Integration' })}
          </Badge>
          <Badge
            icon={CircuitBoard}
            variant="glass"
            size="sm"
            tone="amber"
            className="bg-white/10 border-white/20 text-white ring-1 ring-amber-300/20 dark:ring-amber-400/20 hover:ring-amber-300/40 transition-colors duration-200"
          >
            {t('marketing.mas.cta.badge_tool_use', { defaultValue: 'Tool‑Use' })}
          </Badge>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button variant="primary" asChild>
            <Link to="/c/new" aria-label={t('marketing.mas.cta.primary_aria', { defaultValue: 'MAS jetzt im AI Chat testen' })}>
              {t('marketing.mas.cta.primary', { defaultValue: 'MAS jetzt testen' })}
            </Link>
          </Button>
          <Link to="/pricing#calculator" aria-label={t('marketing.mas.cta.secondary_aria', { defaultValue: 'Zu den Pricing-Details und Kalkulator' })} className="inline-flex items-center rounded-md border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
            {t('marketing.mas.cta.secondary', { defaultValue: 'Pricing & Kalkulator' })}
          </Link>
        </div>
      </div>
    </section>
  );
}
