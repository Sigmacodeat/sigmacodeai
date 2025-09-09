// Motion via zentralen Presets (framer-motion)
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { ShieldCheck, KeyRound, FileSearch, Lock, Database } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { useTranslation } from 'react-i18next';
import LandingSection from '../components/LandingSection';
import { motion, useReducedMotion } from 'framer-motion';
import { containerVar, itemVar, fadeInUp, viewportOnce } from '~/components/pitchdeck/Shared/variants';

export default function SecuritySection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const prefersReducedMotion = useReducedMotion();
  const features: { title: string; desc: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    {
      title: tt('marketing.landing.security.features.0.title', 'RBAC & granulare Berechtigungen'),
      desc: tt(
        'marketing.landing.security.features.0.desc',
        'Rollenbasiertes Zugriffsmodell mit feingranularen Scopes, Projects/Workspaces und Attribut-basierten Regeln.'
      ),
      Icon: ShieldCheck,
    },
    {
      title: tt('marketing.landing.security.features.1.title', 'Audit‑Logs & Nachvollziehbarkeit'),
      desc: tt(
        'marketing.landing.security.features.1.desc',
        'Lückenlose Ereignis‑Protokollierung mit Export, Retention‑Policies und Integritätsprüfungen (Hash‑Chains).'
      ),
      Icon: FileSearch,
    },
    {
      title: tt('marketing.landing.security.features.2.title', 'Sicheres Secret‑Handling'),
      desc: tt(
        'marketing.landing.security.features.2.desc',
        'End‑to‑End‑Verschlüsselung ruhender Secrets, Just‑in‑Time Entschlüsselung, Rotation & Bring‑Your‑Own‑KMS.'
      ),
      Icon: KeyRound,
    },
    {
      title: tt('marketing.landing.security.features.3.title', 'DSGVO & Datenhoheit'),
      desc: tt(
        'marketing.landing.security.features.3.desc',
        'On‑Prem/Hybrid‑Deployment, regionale Datenhaltung, Löschkonzepte, Auftragsverarbeitung & TOMs.'
      ),
      Icon: Database,
    },
  ];
  return (
    <LandingSection id="security" className="-mt-px">
      {/* subtle green aura */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-32 w-32 translate-y-6 rounded-full bg-emerald-400/5 blur-xl sm:h-48 sm:w-48" />
      </div>
      <motion.div
        initial={prefersReducedMotion ? undefined : 'hidden'}
        whileInView={prefersReducedMotion ? undefined : 'show'}
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <SectionHeader
          icon={ShieldCheck}
          badgeText={t('marketing.landing.sections.badges.security')}
          badgeAriaLabel={tt('marketing.landing.security.badge_aria', 'Sicherheits-Bereich')}
          title={tt('marketing.landing.security.title', 'Security & Compliance')}
        />
      </motion.div>
      <>
        <motion.ul
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          role="list"
          data-analytics-id="security-features-grid"
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'show'}
          viewport={viewportOnce}
          variants={containerVar}
        >
          {features.map(({ title, desc, Icon }, i) => (
            <motion.li key={title} variants={itemVar}>
              <Card variant="outline" className="text-sm" data-analytics-id="security-feature-card" data-idx={i} data-title={title}>
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 ring-1 ring-black/5 dark:ring-zinc-300/15"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="typo-card-title text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="mt-1 typo-card-body text-gray-600 dark:text-gray-300">{desc}</p>
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>

            {/* Hard security assurances */}
            <motion.ul
              className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3"
              role="list"
              data-analytics-id="security-assurances-grid"
              initial={prefersReducedMotion ? undefined : 'hidden'}
              whileInView={prefersReducedMotion ? undefined : 'show'}
              viewport={viewportOnce}
              variants={containerVar}
            >
              {[ 
                {
                  Icon: Lock,
                  title: tt('marketing.landing.security.hardening.title', 'State‑of‑the‑Art Verschlüsselung'),
                  desc: tt(
                    'marketing.landing.security.hardening.desc',
                    'TLS 1.3, At‑Rest AES‑256, optionale HSM/KMS‑Integration, Secrets nur im RAM, Zero‑Trust‑Prinzipien.'
                  ),
                },
                {
                  Icon: FileSearch,
                  title: tt('marketing.landing.security.audit.title', 'Compliance & Nachweise'),
                  desc: tt(
                    'marketing.landing.security.audit.desc',
                    'Exportierbare Audit‑Logs, Revisionssichere Speicherung, Prüfbarkeit für interne/externe Audits.'
                  ),
                },
                {
                  Icon: Database,
                  title: tt('marketing.landing.security.data.title', 'Datenhoheit & Souveränität'),
                  desc: tt(
                    'marketing.landing.security.data.desc',
                    'Regionale Speicherung, Lösch‑Workflows, BYO‑Infra (On‑Prem/Hybrid/Private Cloud) für Enterprise.'
                  ),
                },
              ].map(({ Icon, title, desc }, i) => (
                <motion.li key={title} variants={itemVar}>
                  <Card
                    variant="bare"
                    className="flex items-start gap-3 no-underline"
                    data-analytics-id="security-assurance-card"
                    data-idx={i}
                    data-title={title}
                    noInner
                  >
                    <Icon className="mt-0.5 h-5 w-5 text-teal-500/90" aria-hidden="true" />
                    <div className="leading-snug">
                      <div className="typo-card-title tracking-tight">{title}</div>
                      <div className="typo-card-body text-gray-600 dark:text-gray-300">{desc}</div>
                    </div>
                  </Card>
                </motion.li>
              ))}
            </motion.ul>

            {/* Compliance chips */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-2"
              data-analytics-id="security-compliance-chips"
              initial={prefersReducedMotion ? undefined : 'hidden'}
              whileInView={prefersReducedMotion ? undefined : 'show'}
              viewport={viewportOnce}
              variants={containerVar}
            >
              <motion.div variants={itemVar}>
                <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.iso', 'ISO 27001 (in Arbeit)')}>ISO 27001</Badge>
              </motion.div>
              <motion.div variants={itemVar}>
                <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.soc2', 'SOC 2 (Best Practices)')}>SOC 2</Badge>
              </motion.div>
              <motion.div variants={itemVar}>
                <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.gdpr', 'GDPR/DSGVO Ready')}>GDPR/DSGVO</Badge>
              </motion.div>
              <motion.div variants={itemVar}>
                <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.encryption', 'TLS 1.3 / AES‑256')}>TLS 1.3 / AES‑256</Badge>
              </motion.div>
            </motion.div>
        </>
    </LandingSection>
  );
}

