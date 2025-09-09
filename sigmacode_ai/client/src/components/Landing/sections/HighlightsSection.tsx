import { Sparkles } from 'lucide-react';
import IconGlow from '../components/IconGlow';
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { useTranslation } from 'react-i18next';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { containerVar, itemVar, viewportOnce } from '~/components/pitchdeck/Shared/variants';

export default function FeaturesSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const listRef = useRef<HTMLUListElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceAll = prefersReducedMotion; // Skip Animations bei Reduced Motion
  const defaultFeatures = [
    {
      title: tt('marketing.landing.features.0.title', 'AI Agents (No‑Code)'),
      desc: tt('marketing.landing.features.0.desc', 'Erstelle spezialisierte Agenten mit Tools, Policies und Ketten (MoA).'),
    },
    {
      title: tt('marketing.landing.features.1.title', 'RAG & File Search'),
      desc: tt('marketing.landing.features.1.desc', 'Semantische Suche, Kontext aus Dateien, PGVector‑basiert.'),
    },
    {
      title: tt('marketing.landing.features.2.title', 'Actions & MCP'),
      desc: tt('marketing.landing.features.2.desc', 'OpenAPI‑Actions und Model Context Protocol für sichere Tool‑Anbindungen.'),
    },
    {
      title: tt('marketing.landing.features.3.title', 'Artifacts & Code'),
      desc: tt('marketing.landing.features.3.desc', 'Interaktive Ausgaben (React/HTML/Mermaid) und Remote Code Interpreter.'),
    },
    {
      title: tt('marketing.landing.features.4.title', 'Performance'),
      desc: tt('marketing.landing.features.4.desc', 'Streaming, Caching und effiziente Pipelines für niedrige Latenz.'),
    },
    {
      title: tt('marketing.landing.features.5.title', 'Security by Design'),
      desc: tt('marketing.landing.features.5.desc', 'RBAC, Audit Logs, Secret Handling, DSGVO, On‑Prem/Hybrid.'),
    },
  ];
  const rawFeatures = t('marketing.landing.features', { returnObjects: true, defaultValue: defaultFeatures }) as unknown;
  const features = Array.isArray(rawFeatures)
    ? rawFeatures.map((f, i) => {
        if (f && typeof f === 'object') {
          const o = f as Record<string, unknown>;
          const title = typeof o.title === 'string' ? o.title : defaultFeatures[i]?.title || `Feature ${i + 1}`;
          const desc = typeof o.desc === 'string' ? o.desc : defaultFeatures[i]?.desc || '';
          return { title, desc };
        }
        if (typeof f === 'string') return { title: f, desc: '' };
        return defaultFeatures[i] || { title: `Feature ${i + 1}`, desc: '' };
      })
    : defaultFeatures;
  return (
    <LandingSection id="features" noBorder className="-mt-px">
      <SectionHeader
        icon={Sparkles}
        badgeText={t('marketing.landing.sections.badges.highlights')}
        id="features-heading"
        title={tt('marketing.landing.features.title', 'Warum SIGMACODE AI')}
      />
      <motion.ul
        ref={listRef}
        className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3"
        role="list"
        data-analytics-id="features-grid"
        initial={reduceAll ? undefined : 'hidden'}
        whileInView={reduceAll ? undefined : 'show'}
        viewport={viewportOnce}
        variants={containerVar}
      >
        {features.map((f, i) => (
          <motion.li key={f.title} variants={itemVar}>
            <div>
              <Card variant="glass" interactive data-analytics-id="feature-card" data-idx={i} data-title={f.title}>
                {(() => {
                  const Icon = UNIFIED_ICON_SET[i % UNIFIED_ICON_SET.length];
                  return (
                    <motion.span
                      aria-hidden="true"
                      whileHover={reduceAll ? undefined : { scale: 1.03, rotate: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <IconGlow
                        Icon={Icon}
                        size={24}
                        colorClass="text-gray-600/90 dark:text-gray-300"
                        glowColor="rgba(120,120,120,0.25)"
                      />
                    </motion.span>
                  );
                })()}
                <h3 className="mt-3 typo-card-title">{f.title}</h3>
                <p className="mt-2 typo-card-body text-gray-700/90 dark:text-gray-300">{f.desc}</p>
              </Card>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
