import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Plug,
  Workflow,
  Rocket,
  ShieldCheck,
  Gauge,
  Database,
  FileText,
  Boxes,
  ServerCog,
  Network,
  CloudCog,
  LineChart,
  Layers3,
  KeySquare,
  Link2,
  Users,
  FileSearch,
  Book,
  Bell,
  ArrowRight,
} from 'lucide-react';
import SectionHeader from '../../components/marketing/SectionHeader';
import SEO from '../../components/marketing/SEO';
import { buttonStyles, buttonSizeXs } from '../../components/ui/Button';

export default function HowItWorks() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <SEO
        title={`${tt('marketing.howto.meta.title')} · SIGMACODE AI`}
        description={tt('marketing.howto.meta.description')}
        canonical="/how-it-works"
        keywords={[
          tt('marketing.howto.connect.title'),
          tt('marketing.howto.orchestrate.title'),
          tt('marketing.howto.deploy.title'),
          tt('marketing.howto.gov.title'),
          tt('marketing.howto.ops.title'),
        ]}
        robots="index,follow"
        openGraph={{
          title: tt('marketing.howto.meta.title'),
          description: tt('marketing.howto.meta.description'),
          type: 'website',
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary_large_image',
          title: tt('marketing.howto.meta.title'),
          description: tt('marketing.howto.meta.description'),
        }}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: tt('marketing.howto.meta.title'), item: '/how-it-works' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: tt('marketing.howto.meta.title'),
            description: tt('marketing.howto.meta.description'),
            mainEntityOfPage: '/how-it-works',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: tt('marketing.howto.faq.q1.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.howto.faq.q1.a') } },
              { '@type': 'Question', name: tt('marketing.howto.faq.q2.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.howto.faq.q2.a') } },
              { '@type': 'Question', name: tt('marketing.howto.faq.q3.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.howto.faq.q3.a') } },
              { '@type': 'Question', name: tt('marketing.howto.faq.q4.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.howto.faq.q4.a') } },
              { '@type': 'Question', name: tt('marketing.howto.faq.q5.q'), acceptedAnswer: { '@type': 'Answer', text: tt('marketing.howto.faq.q5.a') } },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SIGMACODE AI',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: '/how-it-works',
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <Hero />
        <SubpagesNav />
        <Connect />
        <Orchestrate />
        <Deploy />
        <Governance />
        <Operations />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ================== SUBPAGES NAV ================== */
function SubpagesNav() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const links = [
    { to: '/how-it-works/connect', icon: Plug, label: tt('marketing.howto.connect.title') },
    { to: '/how-it-works/orchestrate', icon: Workflow, label: tt('marketing.howto.orchestrate.title') },
    { to: '/how-it-works/deploy', icon: Rocket, label: tt('marketing.howto.deploy.title') },
    { to: '/how-it-works/governance', icon: ShieldCheck, label: tt('marketing.howto.gov.title') },
    { to: '/how-it-works/operations', icon: ServerCog, label: tt('marketing.howto.ops.title') },
  ];

  return (
    <nav aria-label={tt('marketing.howto.meta.title')} className="mt-6 sm:mt-8">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              aria-label={l.label}
              className="block rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <span className="inline-flex items-center gap-2">
                <l.icon className="h-4 w-4 text-brand-primary" />
                <span>{l.label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const badges = [
    { icon: Plug, text: tt('marketing.howto.hero.badges.b1') },
    { icon: Workflow, text: tt('marketing.howto.hero.badges.b2') },
    { icon: Rocket, text: tt('marketing.howto.hero.badges.b3') },
  ];

  return (
    <section className="py-14 md:py-20" aria-labelledby="howto-hero-title">
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 md:grid-cols-2">
        <div>
          <h1 id="howto-hero-title" className="text-[2rem] leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            {tt('marketing.howto.hero.title')}
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-300">
            {tt('marketing.howto.hero.subtitle')}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.text} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs sm:text-sm dark:bg-gray-900">
                <b.icon className="h-5 w-5 text-brand-primary" /> {b.text}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/c/new"
              className={`${buttonStyles.primary} ${buttonSizeXs.primary} bg-gradient-to-r from-[#0ea5e9] via-[#7dd3fc] to-[#cffafe] hover:from-[#38bdf8] hover:via-[#a5e3ff] hover:to-[#e0faff] text-slate-900`}
            >
              <span className="inline-flex items-center">{tt('marketing.howto.hero.primary')} <ArrowRight className="ml-2 h-4 w-4" /></span>
            </Link>
            <Link
              to="/pricing"
              className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
            >
              {tt('marketing.howto.hero.secondary')}
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-72 sm:h-80 overflow-hidden p-5 sm:p-6"
          aria-hidden="true"
        >
          {[
            { pos: 'right-6 top-6', icon: Network, text: tt('marketing.howto.hero.illus.providers'), color: 'text-brand-primary', delay: 0 },
            { pos: 'left-6 top-6', icon: Database, text: tt('marketing.howto.hero.illus.rag'), color: 'text-brand-accent', delay: 0.2 },
            { pos: 'bottom-8 right-8', icon: Plug, text: tt('marketing.howto.hero.illus.actions'), color: 'text-brand-primary', delay: 0.4 },
            { pos: 'bottom-8 left-8', icon: ShieldCheck, text: tt('marketing.howto.hero.illus.policies'), color: 'text-brand-accent', delay: 0.6 },
          ].map((el) => (
            <motion.div
              key={el.text}
              className={`absolute ${el.pos} ui-glass-card px-3 py-2 text-xs sm:text-sm`}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 + el.delay }}
            >
              <span className="inline-flex items-center gap-2">
                <el.icon className={`h-4 w-4 ${el.color}`} /> {el.text}
              </span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ================== CONNECT ================== */
function Connect() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { icon: Plug, title: tt('marketing.howto.connect.items.actions.title'), desc: tt('marketing.howto.connect.items.actions.desc') },
    { icon: Database, title: tt('marketing.howto.connect.items.data.title'), desc: tt('marketing.howto.connect.items.data.desc') },
    { icon: Boxes, title: tt('marketing.howto.connect.items.providers.title'), desc: tt('marketing.howto.connect.items.providers.desc') },
    { icon: KeySquare, title: tt('marketing.howto.connect.items.secrets.title'), desc: tt('marketing.howto.connect.items.secrets.desc') },
    { icon: Link2, title: tt('marketing.howto.connect.items.webhooks.title'), desc: tt('marketing.howto.connect.items.webhooks.desc') },
  ];

  return (
    <section id="connect" className="py-14 md:py-20" aria-labelledby="connect-title">
      <SectionHeader
        icon={Plug}
        badgeText={tt('marketing.howto.connect.badge')}
        badgeVariant="glass"
        title={tt('marketing.howto.connect.title')}
        id="connect-title"
        as="h2"
        subtitle={tt('marketing.howto.connect.description')}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            to="/how-it-works/connect"
            aria-label={`${tt('marketing.howto.connect.title')} – ${it.title}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-xl"
          >
            <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
              <it.icon className="h-5 w-5 text-brand-primary" />
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================== ORCHESTRATE ================== */
function Orchestrate() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { icon: Workflow, title: tt('marketing.howto.orchestrate.items.planner.title'), desc: tt('marketing.howto.orchestrate.items.planner.desc') },
    { icon: Layers3, title: tt('marketing.howto.orchestrate.items.moA.title'), desc: tt('marketing.howto.orchestrate.items.moA.desc') },
    { icon: FileText, title: tt('marketing.howto.orchestrate.items.artifacts.title'), desc: tt('marketing.howto.orchestrate.items.artifacts.desc') },
    { icon: ShieldCheck, title: tt('marketing.howto.orchestrate.items.guardrails.title'), desc: tt('marketing.howto.orchestrate.items.guardrails.desc') },
    { icon: LineChart, title: tt('marketing.howto.orchestrate.items.eval.title'), desc: tt('marketing.howto.orchestrate.items.eval.desc') },
  ];

  return (
    <section id="orchestrate" className="py-14 md:py-20" aria-labelledby="orchestrate-title">
      <SectionHeader
        icon={Workflow}
        badgeText={tt('marketing.howto.orchestrate.badge')}
        badgeVariant="glass"
        title={tt('marketing.howto.orchestrate.title')}
        id="orchestrate-title"
        as="h2"
        subtitle={tt('marketing.howto.orchestrate.description')}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            to="/how-it-works/orchestrate"
            aria-label={`${tt('marketing.howto.orchestrate.title')} – ${it.title}`}
            className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
              <it.icon className="h-5 w-5 text-brand-primary" />
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================== DEPLOY ================== */
function Deploy() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const steps = [
    { title: tt('marketing.howto.deploy.s1.title'), desc: tt('marketing.howto.deploy.s1.desc') },
    { title: tt('marketing.howto.deploy.s2.title'), desc: tt('marketing.howto.deploy.s2.desc') },
    { title: tt('marketing.howto.deploy.s3.title'), desc: tt('marketing.howto.deploy.s3.desc') },
    { title: tt('marketing.howto.deploy.s4.title'), desc: tt('marketing.howto.deploy.s4.desc') },
    { title: tt('marketing.howto.deploy.s5.title'), desc: tt('marketing.howto.deploy.s5.desc') },
  ];

  return (
    <section id="deploy" className="py-14 md:py-20" aria-labelledby="deploy-title">
      <SectionHeader
        icon={Rocket}
        badgeText={tt('marketing.howto.deploy.badge')}
        badgeVariant="outline"
        title={tt('marketing.howto.deploy.title')}
        id="deploy-title"
        as="h2"
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {steps.map((s) => (
          <Link
            key={s.title}
            to="/how-it-works/deploy"
            aria-label={`${tt('marketing.howto.deploy.title')} – ${s.title}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-xl"
          >
            <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================== GOVERNANCE ================== */
function Governance() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { icon: ShieldCheck, title: tt('marketing.howto.gov.items.policies.title'), desc: tt('marketing.howto.gov.items.policies.desc') },
    { icon: KeySquare, title: tt('marketing.howto.gov.items.secrets.title'), desc: tt('marketing.howto.gov.items.secrets.desc') },
    { icon: ServerCog, title: tt('marketing.howto.gov.items.compliance.title'), desc: tt('marketing.howto.gov.items.compliance.desc') },
    { icon: Users, title: tt('marketing.howto.gov.items.rbac.title'), desc: tt('marketing.howto.gov.items.rbac.desc') },
    { icon: FileSearch, title: tt('marketing.howto.gov.items.audit.title'), desc: tt('marketing.howto.gov.items.audit.desc') },
  ];

  return (
    <section id="governance" className="py-14 md:py-20" aria-labelledby="gov-title">
      <SectionHeader
        icon={ShieldCheck}
        badgeText={tt('marketing.howto.gov.badge')}
        badgeVariant="outline"
        title={tt('marketing.howto.gov.title')}
        id="gov-title"
        as="h2"
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            to="/how-it-works/governance"
            aria-label={`${tt('marketing.howto.gov.title')} – ${it.title}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-xl"
          >
            <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
              <it.icon className="h-5 w-5 text-brand-primary" />
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================== OPERATIONS ================== */
function Operations() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { icon: Gauge, title: tt('marketing.howto.ops.items.metrics.title'), desc: tt('marketing.howto.ops.items.metrics.desc') },
    { icon: CloudCog, title: tt('marketing.howto.ops.items.scaling.title'), desc: tt('marketing.howto.ops.items.scaling.desc') },
    { icon: LineChart, title: tt('marketing.howto.ops.items.eval.title'), desc: tt('marketing.howto.ops.items.eval.desc') },
    { icon: Book, title: tt('marketing.howto.ops.items.runbooks.title'), desc: tt('marketing.howto.ops.items.runbooks.desc') },
    { icon: Bell, title: tt('marketing.howto.ops.items.alerts.title'), desc: tt('marketing.howto.ops.items.alerts.desc') },
  ];

  return (
    <section id="ops" className="py-14 md:py-20" aria-labelledby="ops-title">
      <SectionHeader
        icon={ServerCog}
        badgeText={tt('marketing.howto.ops.badge')}
        badgeVariant="outline"
        title={tt('marketing.howto.ops.title')}
        id="ops-title"
        as="h2"
        subtitle={tt('marketing.howto.ops.description')}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            to="/how-it-works/operations"
            aria-label={`${tt('marketing.howto.ops.title')} – ${it.title}`}
            className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
              <it.icon className="h-5 w-5 text-brand-primary" />
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================== FAQ ================== */
function FAQ() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const faqs = [
    { q: tt('marketing.howto.faq.q1.q'), a: tt('marketing.howto.faq.q1.a') },
    { q: tt('marketing.howto.faq.q2.q'), a: tt('marketing.howto.faq.q2.a') },
    { q: tt('marketing.howto.faq.q3.q'), a: tt('marketing.howto.faq.q3.a') },
    { q: tt('marketing.howto.faq.q4.q'), a: tt('marketing.howto.faq.q4.a') },
    { q: tt('marketing.howto.faq.q5.q'), a: tt('marketing.howto.faq.q5.a') },
  ];

  return (
    <section id="faq" className="py-14 md:py-20" aria-labelledby="howto-faq-title">
      <SectionHeader
        icon={FileText}
        badgeText={tt('marketing.howto.faq.badge')}
        badgeVariant="glass"
        badgeTone="teal"
        title={tt('marketing.howto.faq.title')}
        id="howto-faq-title"
        as="h2"
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {faqs.map((f, i) => (
          <div key={`howto-faq-${i}`} className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow text-sm">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1.5 text-gray-600 dark:text-gray-300">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================== CTA ================== */
function CTA() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <section className="py-14 md:py-20" aria-labelledby="howto-cta-title">
      {/* Divider */}
      <div
        className="mb-12 h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/40 to-brand-accent/0"
        aria-hidden="true"
      />
      <SectionHeader
        icon={Rocket}
        badgeText={tt('marketing.howto.cta.badge')}
        badgeVariant="glass"
        badgeTone="teal"
        title={tt('marketing.howto.cta.title')}
        id="howto-cta-title"
        as="h2"
        subtitle={tt('marketing.howto.cta.subtitle')}
      />
      <div className="rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent px-6 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{tt('marketing.howto.cta.title')}</h3>
          <p className="mt-2 text-base md:text-lg opacity-90">{tt('marketing.howto.cta.subtitle')}</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/c/new"
            aria-label={tt('marketing.howto.cta.primary_aria')}
            className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
          >
            {tt('marketing.howto.cta.primary')}
          </Link>
          <Link
            to="/pricing#calculator"
            className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
          >
            {tt('marketing.howto.cta.secondary_pricing')}
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
        <span>{tt('marketing.footer.copyright', { year: new Date().getFullYear() })}</span>
        <nav aria-label={tt('marketing.footer.nav_aria')} className="flex items-center gap-4">
          <Link className="hover:underline" to="/ai-agents">{tt('marketing.footer.agents')}</Link>
          <Link className="hover:underline" to="/business-ai">{tt('marketing.footer.business_ai')}</Link>
          <Link className="hover:underline" to="/pricing">{tt('marketing.footer.pricing')}</Link>
        </nav>
      </div>
    </footer>
  );
}
