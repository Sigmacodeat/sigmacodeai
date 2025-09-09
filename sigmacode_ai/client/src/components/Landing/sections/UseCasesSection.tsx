import { useMemo, useRef } from 'react';
import { motion, type Variants, useReducedMotion } from 'framer-motion';
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { LineChart, Bot, Code2, Database, ShieldCheck, LifeBuoy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LandingSection from '../components/LandingSection';

export default function UseCasesSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const listRef = useRef<HTMLUListElement | null>(null);
  const prefersReduced = useReducedMotion();

  // Defaults (Fallback)
  const defaultItems = [
    { key: 'support', title: tt('marketing.landing.useCases.items.support.title', 'Support-Automatisierung'), desc: tt('marketing.landing.useCases.items.support.desc', 'Reduziere Tickets durch intelligente Self-Service-Agenten.'), icon: 'life' },
    { key: 'devAssist', title: tt('marketing.landing.useCases.items.devAssist.title', 'Entwickler-Assistenz'), desc: tt('marketing.landing.useCases.items.devAssist.desc', 'Code-Analyse, PR-Hinweise, Doku-Generierung.'), icon: 'code' },
    { key: 'dataQuery', title: tt('marketing.landing.useCases.items.dataQuery.title', 'Datenabfragen'), desc: tt('marketing.landing.useCases.items.dataQuery.desc', 'Natürliche Sprache zu SQL/GraphQL – sicher und nachvollziehbar.'), icon: 'db' },
  ];

  // i18n ReturnObjects unterstützen (optional: icon)
  const rawCases = t('marketing.landing.useCases.items', { returnObjects: true, defaultValue: defaultItems }) as unknown;
  const cases = Array.isArray(rawCases)
    ? rawCases.map((c, i) => {
        if (c && typeof c === 'object') {
          const o = c as Record<string, unknown>;
          const title = typeof o.title === 'string' ? o.title : defaultItems[i]?.title || `Case ${i + 1}`;
          const desc = typeof o.desc === 'string' ? o.desc : defaultItems[i]?.desc || '';
          const icon = typeof o.icon === 'string' ? (o.icon as string) : (defaultItems[i] as any)?.icon;
          const key = (typeof o.key === 'string' && o.key) || defaultItems[i]?.key || `case-${i}`;
          return { key, title, desc, icon };
        }
        if (typeof c === 'string') return { key: `case-${i}`, title: c, desc: '', icon: undefined };
        return defaultItems[i] || { key: `case-${i}`, title: `Case ${i + 1}`, desc: '', icon: undefined };
      })
    : defaultItems;

  // Icon Mapping (fallbacks)
  const iconMap = useMemo(
    () => ({
      bot: Bot,
      code: Code2,
      db: Database,
      shield: ShieldCheck,
      life: LifeBuoy,
    }),
    []
  );

  // Animation
  const containerVar: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        when: 'beforeChildren',
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVar: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <LandingSection id="use-cases" className="-mt-px">
      <SectionHeader
        icon={LineChart}
        badgeText={tt('marketing.landing.useCases.badge', 'Use-Cases')}
        id="use-cases-heading"
        title={tt('marketing.landing.useCases.title', 'Use-Cases')}
        subtitle={tt('marketing.landing.useCases.subtitle', 'Konkrete Mehrwerte – von Support bis DataOps')}
      />

      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-teal-400/10" />

        <motion.ul
          ref={listRef}
          role="list"
          data-analytics-id="usecases-grid"
          className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3"
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {cases.map((c, i) => {
            const Icon = iconMap[(c as any).icon as keyof typeof iconMap] || [LifeBuoy, Code2, Database][i % 3];
            return (
              <motion.li key={`${c.key}-${i}`} variants={itemVar} className="h-full">
                <Card
                  variant="glass"
                  size="md"
                  interactive
                  className="h-full group overflow-hidden ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md"
                  data-analytics-id="usecase-card"
                  data-idx={i}
                  data-title={c.title}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary-700 dark:text-teal-300 ring-1 ring-black/5 dark:ring-white/10">
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                      <span className="sr-only">Icon</span>
                      <span aria-hidden className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="typo-card-title tracking-tight">{c.title}</h3>
                      <p className="mt-1 typo-card-body text-gray-600 dark:text-gray-300">{c.desc}</p>
                    </div>
                  </div>

                  {/* dezente Unterstreichung / Shine */}
                  <div aria-hidden className="pointer-events-none mt-4 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </LandingSection>
  );
}
