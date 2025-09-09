 import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Bot, Workflow, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { useTranslation } from 'react-i18next';
import { AgentLaunchScene } from '../HeroAgentScene';
import Card from '../components/Card';
import BrandIcon from '../../common/BrandIcon';

export default function AgentHeroSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const tAny = t as unknown as (key: string, options?: Record<string, unknown>) => unknown;

  // Bullets via i18n (fallback-sicher)
  const defaultBullets = [
    tt('marketing.agents.hero.bullets.0', 'RAG & Retrieval'),
    tt('marketing.agents.hero.bullets.1', 'Sichere AI Actions'),
    tt('marketing.agents.hero.bullets.2', 'Policies & Governance'),
  ];
  const rawBullets = tAny('marketing.agents.hero.bullets', { returnObjects: true, defaultValue: defaultBullets });
  const bullets = Array.isArray(rawBullets)
    ? rawBullets.map((b, i) => (typeof b === 'string' ? b : String((b as any)?.title ?? defaultBullets[i] ?? ''))).filter(Boolean)
    : defaultBullets;

  // Reduced motion respektieren
  const [reduceAll, setReduceAll] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduceAll(!!mq.matches);
      update();
      mq.addEventListener?.('change', update);
      return () => mq.removeEventListener?.('change', update);
    }
  }, []);

  // Easing & Variants
  const containerVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceAll ? 0 : 0.22,
          delayChildren: reduceAll ? 0 : 0.25,
        },
      },
    }),
    [reduceAll],
  );
  const EASE = [0.22, 1, 0.36, 1] as const;
  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 8, transition: { duration: 0.5, ease: EASE } },
      show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
    }),
    [],
  );

  // Visual (Teaser) sanfter Fade+Rise
  const visualVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 1.05, ease: EASE },
      },
    }),
    [],
  );

  // Interaction-Gate
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

  // InView-Kontrolle
  const visualRef = useRef<HTMLDivElement | null>(null);
  const visualInView = useInView(visualRef, { amount: 0.65, margin: '0px 0px -10% 0px' });
  const revealVisual = userInteracted && visualInView;
  // Sticky-Reveal
  const [hasRevealed, setHasRevealed] = useState(false);
  useEffect(() => {
    if (revealVisual && !hasRevealed) setHasRevealed(true);
  }, [revealVisual, hasRevealed]);

  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0.96,
      rotate: -2,
      transition: { duration: 0.4, ease: EASE },
    },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 88,
        damping: 22,
        mass: 0.9,
        restDelta: 0.0025,
        delay: 0.2,
      },
    },
  } as const;

  const textVariants = {
    hidden: { opacity: 0, y: 6, transition: { duration: 0.45, ease: EASE } },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: 0.28 },
    },
  } as const;

  // Weicher Blob im Hintergrund der Icons
  const Blob = () => (
    <motion.span
      aria-hidden
      className="absolute inset-0 -z-10 rounded-[28%] bg-gradient-to-br from-sky-500/20 via-cyan-400/18 to-sky-300/18 blur-md"
      initial={{ scale: 0.5, opacity: 0, rotate: -10, borderRadius: '36%' }}
      animate={{ scale: 1.02, opacity: 1, rotate: 0, borderRadius: ['36%', '28%', '32%'] }}
      transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
    />
  );

  // Sanfter, bläulicher Glow (mit Reduced-Motion-Fallback)
  const Glow = () => (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-[radial-gradient(closest-side,rgba(56,189,248,0.24),transparent_70%)]"
      initial={{ opacity: 0 }}
      animate={reduceAll ? { opacity: 1 } : { opacity: [0, 0.9, 0.7, 0.85] }}
      transition={reduceAll ? { duration: 1.1, delay: 0.45, ease: EASE } : { duration: 3.2, delay: 0.45, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
    />
  );

  return (
    <LandingSection id="agents-hero" noBorder className="-mt-px overflow-visible pt-8 pb-12 md:!py-0">
      <div
        className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10"
        data-analytics-id="agent-hero-grid"
      >
        <div
          className="relative overflow-visible mx-auto w-full p-0 order-2 md:order-1"
          data-analytics-id="agent-hero-visual"
        >
          <motion.div
            ref={visualRef}
            variants={visualVariants}
            initial="hidden"
            animate={hasRevealed ? 'show' : 'hidden'}
          >
            {/* Immer mounten, nur per armed/Opacity steuern – verhindert Layout-Sprünge */}
            <AgentLaunchScene instant={reduceAll} armed={revealVisual} />
          </motion.div>
        </div>
        <div className="order-1 md:order-2" data-analytics-id="agent-hero-copy">
          <motion.div
            className="text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.65, margin: '0px 0px -10% 0px' }}
          >
            <SectionHeader
              icon={Bot}
              badgeText={tt('marketing.landing.sections.badges.agents', 'AI Agents')}
              badgeVariant="glass"
              badgeTone="teal"
              badgeSize="md"
              badgeClassName="h-8 py-0"
              badgeAlign="left"
              title={tt(
                'marketing.agents.hero.title',
                'AI Agents – No‑Code Orchestrierung, RAG, Actions & Governance'
              )}
              subtitleClassName="mt-4 text-left"
              subtitle={
                <span className="block max-w-4xl text-pretty">
                  <span className="block">
                    {tt('marketing.agents.hero.subtitle_q', 'Wie orchestriere ich mehrere Agents – sicher und produktiv?')}
                  </span>
                  <span className="block mt-1 font-semibold text-sm md:text-base">
                    {tt('marketing.agents.hero.subtitle_h', 'Überblick, Orchestrierung & Sicherheit')}
                  </span>
                  <span className="block mt-1 text-sm md:text-base">
                    {tt('marketing.agents.hero.subtitle_l', 'No‑Code Studio, Policies, Scopes, Audit‑Logs')}
                  </span>
                </span>
              }
            />
          </motion.div>
          {/* Karten wandern in eine volle Zeile unterhalb der 2-Spalten-Struktur (siehe weiter unten) */}
        </div>
      </div>
      {/* Vollbreite Karten-Reihe unter Teaser+Text: 3 Spalten auf Desktop */}
      <motion.ul
        className="mt-8 sm:mt-9 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 [&_*]:![writing-mode:horizontal-tb] [&_*]:![text-orientation:mixed] [&_*]:!whitespace-normal [&_*]:![word-break:break-word] [&_*]:break-words"
        data-analytics-id="agent-hero-bullets"
        role="list"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.6, margin: '0px 0px -10% 0px' }}
      >
        {bullets.map((b, i) => {
          const Icon = [Bot, Workflow, ShieldCheck][i] ?? Bot;
          return (
            <li key={`${b}-${i}`} data-idx={i} data-title={b} className="list-none h-full">
              <motion.div variants={cardVariants}>
                <Card
                  variant="bare"
                  noInner
                  role="group"
                  aria-label={b}
                  data-analytics-id="agent-bullet-card"
                  className="bg-transparent h-full"
                >
                  <div className="flex flex-row items-center px-3 py-3 sm:px-4 sm:py-4 gap-4 sm:gap-5 h-full">
                    <motion.span
                      className="relative flex-none w-16 h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 inline-flex items-center justify-center"
                      variants={iconVariants}
                    >
                      {/* Für den ersten Bullet (RAG & Retrieval) keine Hintergrund-Grafiken */}
                      {i !== 0 && <Blob />}
                      {i !== 0 && <Glow />}
                      {i === 0 ? (
                        <BrandIcon className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11" strokeWidth={1.9} animated ariaHidden />
                      ) : (
                        <Icon
                          className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 text-sky-400 dark:text-sky-200 saturate-125"
                          strokeWidth={1.9}
                          aria-hidden
                        />
                      )}
                    </motion.span>
                    <motion.span
                      variants={textVariants}
                      title={b}
                      className="grow text-[15px] sm:text-[16px] md:text-[17px] leading-[1.35] tracking-[0.005em] !break-words !whitespace-normal font-medium antialiased text-gray-900 dark:text-gray-100 text-left"
                      style={{ writingMode: 'horizontal-tb' }}
                    >
                      {b}
                    </motion.span>
                  </div>
                </Card>
              </motion.div>
            </li>
          );
        })}
      </motion.ul>
    </LandingSection>
  );
}
