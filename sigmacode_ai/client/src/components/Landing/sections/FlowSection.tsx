// Motion: Reveal/Stagger
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import LandingSection from '../components/LandingSection';
import { Reveal } from '../../motion/Reveal';
import Stagger from '../../motion/Stagger';
import { trackEvent } from '../../../utils/analytics';


export default function HowItWorksSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const Icon = UNIFIED_ICON_SET[4];

  // Default Steps als Fallback
  const defaultSteps = [
    {
      title: tt('marketing.landing.how.steps.connect.title', 'Verbinden'),
      desc: tt(
        'marketing.landing.how.steps.connect.desc',
        'Provider & Datenquellen (OpenAI, Anthropic, Mistral, RAG API, Datenbanken, Webhooks).'
      ),
    },
    {
      title: tt('marketing.landing.how.steps.orchestrate.title', 'Orchestrieren'),
      desc: tt(
        'marketing.landing.how.steps.orchestrate.desc',
        'Agenten konfigurieren: Tools, Policies, Ketten (Max Steps), Berechtigungen.'
      ),
    },
    {
      title: tt('marketing.landing.how.steps.deploy.title', 'Ausrollen'),
      desc: tt('marketing.landing.how.steps.deploy.desc', 'Testen, freigeben, skalieren – mit Monitoring, RBAC und SLA.'),
    },
  ];
  // i18n: Optional Array via returnObjects
  const rawSteps = t('marketing.landing.how.steps', { returnObjects: true, defaultValue: defaultSteps }) as unknown;
  const steps = Array.isArray(rawSteps)
    ? rawSteps
        .map((s, i) => {
          if (typeof s === 'string') {
            // Falls Übersetzer ein String liefert, als Titel nutzen und Fallback-Desc verwenden
            return { title: s, desc: defaultSteps[i]?.desc ?? '' };
          }
          const obj = s as { title?: string; desc?: string };
          return {
            title: obj.title ?? defaultSteps[i]?.title ?? '',
            desc: obj.desc ?? defaultSteps[i]?.desc ?? '',
          };
        })
        .filter((s) => s.title)
    : defaultSteps;
  return (
    <LandingSection id="how-it-works" ariaLabelledby="how-it-works-heading" className="-mt-px">
      <Reveal as="div" variant="rise" y={12}>
        <SectionHeader
          icon={Icon}
          badgeText={tt('marketing.landing.sections.badges.flow')}
          id="how-it-works-heading"
          title={tt('marketing.landing.how.title', 'How it works')}
          contentAlign="center"
          badgeSize="sm"
          badgeMinimal
          badgeClassName="h-7 py-0 mx-auto"
          subtitle={tt('marketing.landing.how.keywords', 'Connect • Orchestrate • Deploy')}
          subtitleClassName="mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300 text-center"
        />
      </Reveal>

      <Stagger
        as="ul"
        className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
        role="list"
        data-analytics-id="how-steps-grid"
        gap={80}
        startDelay={120}
      >
        {steps.map((s, i) => {
          const num = i + 1;
          const primary =
            i === 0
              ? { to: '/how-it-works/connect', label: tt('marketing.landing.how.cta.connect', 'Verbinden'), aria: tt('marketing.landing.how.cta.connect_aria', 'Zu Verbinden (Connect)') }
              : i === 1
              ? { to: '/how-it-works/orchestrate', label: tt('marketing.landing.how.cta.orchestrate', 'Orchestrieren'), aria: tt('marketing.landing.how.cta.orchestrate_aria', 'Zu Orchestrieren') }
              : { to: '/how-it-works/deploy', label: tt('marketing.landing.how.cta.deploy', 'Ausrollen'), aria: tt('marketing.landing.how.cta.deploy_aria', 'Zu Ausrollen (Deploy)') };
          const overview = { to: '/how-it-works', label: tt('marketing.landing.how.cta.overview', 'Übersicht'), aria: tt('marketing.landing.how.cta.overview_aria', 'Zur How‑it‑works Übersicht') };

          return (
            <li key={`${s.title}-${i}`}>
              <Reveal as="div" variant="rise" y={10}>
                <Card
                  variant="bare"
                  data-analytics-id="how-step-card"
                  data-idx={i}
                  data-title={s.title}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 text-sm font-semibold ring-1 ring-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-300/25"
                    >
                      {num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-left typo-card-title text-gray-900 dark:text-white">{s.title}</h3>
                      <p className="mt-1 text-left typo-card-body text-gray-700 dark:text-gray-300 max-w-2xl">{s.desc}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Link
                          to={primary.to}
                          className={`not-prose no-underline ${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
                          aria-label={primary.aria}
                          data-analytics-id={`how-step:${num}:primary`}
                          onClick={() => trackEvent('landing.how.step.click', { step: num, to: primary.to })}
                        >
                          {primary.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            </li>
          );
        })}
      </Stagger>
    </LandingSection>
  );
}
