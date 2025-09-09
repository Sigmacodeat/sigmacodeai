import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '@/components/marketing/SectionHeader';
import LandingSection from '@/components/Landing/components/LandingSection';
import { buttonStyles, buttonSizeXs } from '@/components/ui/Button';
import { UNIFIED_ICON_SET } from '@/components/Landing/shared/VisualUtils';
import { motion, useReducedMotion } from 'framer-motion';
import { useMotionProps } from '@/hooks/useMotionProps';

export default function WhatAreAgentsSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const prefersReduced = useReducedMotion();
  const fadeIn = useMotionProps('fadeIn');

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.06 },
    },
  } as const;

  const itemVariants = {
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.18 },
    },
  } as const;
  return (
    <LandingSection id="what-are-agents" noBorder className="-mt-px">
        <SectionHeader
          icon={HelpCircle}
          badgeText={tt('marketing.landing.sections.badges.context', 'Kontext & Fähigkeiten')}
          id="what-are-agents-heading"
          title={tt('marketing.landing.whatAreAgents.titleMain', 'AI Agents')}
          rightClassName="mt-3 md:mt-0 md:ml-6 flex flex-col items-end md:items-end gap-2 text-right"
          rightContent={(
            <>
              <Link
                to="/ai-agents"
                className={`${buttonStyles.primary} ${buttonSizeXs.primary} self-end`}
                data-analytics-id="link-ai-agents"
                data-title={tt('marketing.landing.whatAreAgents.cta', 'Mehr über AI Agents')}
              >
                {tt('marketing.landing.whatAreAgents.cta', 'Mehr über AI Agents')}
              </Link>
            </>
          )}
          subtitle={
            <>
              <span className="block mt-2 max-w-2xl text-sm md:text-base text-gray-700 dark:text-gray-300">
                {tt(
                  'marketing.landing.whatAreAgents.subtitleUnified',
                  'Kontext, Fähigkeiten und Orchestrierung produktiver AI‑Agents: Tools + Policies + Autonomie → kürzere Durchlaufzeiten – sicher koordiniert (Mixture‑of‑Agents).'
                )}
              </span>
            </>
          }
          subtitleClassName="mt-2 text-left"
          badgeAlign="center"
          badgeSize="md"
          badgeClassName="h-8 py-0"
        />

        {/* Modernes, reduziertes Layout: Features (links) + Orchestrierungs-Flow (rechts) */}
        <motion.div
          className="mt-8 sm:mt-10 md:mt-12"
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          transition={fadeIn.transition}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="relative rounded-2xl border-0 bg-transparent p-5 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* Linke Spalte: kompakte Feature-Punkte */}
              <motion.div
                className="flex flex-col gap-3 sm:gap-3.5"
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
              >
                {[0,1,2].map((i) => (
                  <motion.div key={i} className="flex items-start gap-3" variants={itemVariants}>
                    {(() => { const Icon = UNIFIED_ICON_SET[(i===0?3:(i===1?4:5))] ?? UNIFIED_ICON_SET[2]; return (
                      <Icon className="mt-0.5 h-5 w-5 md:h-6 md:w-6 text-teal-500 dark:text-teal-400" />
                    ); })()}
                    <div className="min-w-0">
                      <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-white break-words">
                        {tt(`marketing.landing.whatAreAgents.points.${i}.title`, i===0 ? 'RAG & Retrieval' : i===1 ? 'Sichere Actions' : 'Policies & Governance')}
                      </div>
                      <div className="mt-1 text-sm md:text-base text-gray-700/90 dark:text-gray-300 break-words">
                        {tt(
                          `marketing.landing.whatAreAgents.points.${i}.desc`,
                          i===0
                            ? 'Strukturierte Quellen, Dateisuche und kontextreiche Antworten.'
                            : i===1
                            ? 'OpenAPI/MCP‑Actions mit Scopes, Rate‑Limits und Audit.'
                            : 'Guardrails, Rollen & Freigaben – reproduzierbar und sicher.'
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Rechte Spalte: kompakter Orchestrierungs‑Flow */}
              <div className="flex flex-col">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                  variants={listVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {[
                    { k: 'plan', d: 'Plan', i: 0 },
                    { k: 'act', d: 'Act', i: 1 },
                    { k: 'verify', d: 'Verify', i: 2 }
                  ].map((s, idx) => (
                    <motion.div key={s.k} className="ui-glass-card rounded-xl p-3.5 sm:p-4 border border-gray-200/60 dark:border-white/10" variants={itemVariants}>
                      <div className="flex items-center gap-2">
                        {(() => { const Icon = UNIFIED_ICON_SET[(idx===0?6:(idx===1?7:8))] ?? UNIFIED_ICON_SET[1]; return (
                          <Icon className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                        ); })()}
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {tt(`marketing.landing.whatAreAgents.flow.${s.k}.title`, s.d)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-gray-700/90 dark:text-gray-300 leading-relaxed">
                        {tt(
                          `marketing.landing.whatAreAgents.flow.${s.k}.desc`,
                          idx===0
                            ? 'Zerlege Aufgaben, definiere Rollen, Policies & Tools.'
                            : idx===1
                            ? 'Ausführung über sichere Actions, strukturierte Outputs.'
                            : 'Prüfen, loggen, iterieren – Qualität messbar sichern.'
                        )}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
    </LandingSection>
  );
}

