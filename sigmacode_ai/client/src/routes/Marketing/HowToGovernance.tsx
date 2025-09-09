import { useTranslation } from 'react-i18next';
import { ShieldCheck, KeySquare, ServerCog, Users2, FileSearch2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonStyles, buttonSizeXs } from '../../components/ui/Button';
import SectionBadge from '../../components/marketing/SectionBadge';
import SEO from '../../components/marketing/SEO';
import NumberedSteps from '../../components/marketing/NumberedSteps';

export default function HowToGovernance() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;

  const items = [
    { icon: ShieldCheck, title: tt('marketing.howto.gov.items.policies.title'), desc: tt('marketing.howto.gov.items.policies.desc') },
    { icon: KeySquare, title: tt('marketing.howto.gov.items.secrets.title'), desc: tt('marketing.howto.gov.items.secrets.desc') },
    { icon: ServerCog, title: tt('marketing.howto.gov.items.compliance.title'), desc: tt('marketing.howto.gov.items.compliance.desc') },
    { icon: Users2, title: tt('marketing.howto.gov.items.rbac.title'), desc: tt('marketing.howto.gov.items.rbac.desc') },
    { icon: FileSearch2, title: tt('marketing.howto.gov.items.audit.title'), desc: tt('marketing.howto.gov.items.audit.desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <SEO
        title={`${tt('marketing.howto.gov.title')} · SIGMACODE AI`}
        description={items.map(i => i.desc).join(' ')}
        canonical="/how-it-works/governance"
        keywords={[tt('marketing.howto.gov.badge'), ...items.map(i => i.title)]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: tt('marketing.landing.sections.badges.flow'), item: '/how-it-works' },
              { '@type': 'ListItem', position: 2, name: tt('marketing.howto.gov.badge'), item: '/how-it-works/governance' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: tt('marketing.howto.gov.title'),
            description: items.map(i => i.desc).join(' '),
            mainEntityOfPage: '/how-it-works/governance',
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
          <Link className="hover:underline" to="/how-it-works">{tt('marketing.landing.sections.badges.flow')}</Link>
          <span className="mx-2">/</span>
          <span>{tt('marketing.howto.gov.badge')}</span>
        </nav>

        <SectionBadge icon={ShieldCheck} variant="outline">{tt('marketing.howto.gov.badge')}</SectionBadge>
        <h1 className="mt-2 text-3xl font-bold">{tt('marketing.howto.gov.title')}</h1>

        <h2 className="sr-only">{tt('marketing.howto.gov.title')}</h2>
        <NumberedSteps
          steps={items}
          colsMd={3}
          prefixKeyOverride="marketing.howto.gov.steps.prefix"
          ariaKeyOverride="marketing.howto.gov.steps.aria"
        />

        <div className="mt-10 text-base md:text-[17px] leading-relaxed text-gray-700 dark:text-gray-300">
          <h3 className="font-semibold">{tt('marketing.howto.gov.badge')}</h3>
          <ul className="mt-2 list-inside list-disc">
            {items.map((i) => (
              <li key={`kw-${i.title}`}>{i.title}</li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div
          className="mt-12 h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/40 to-brand-accent/0"
          aria-hidden="true"
        />

        {/* Unified CTA Panel */}
        <section className="mt-12" aria-labelledby="howto-governance-cta-title">
          <h2 id="howto-governance-cta-title" className="sr-only">{tt('marketing.howto.cta.title')}</h2>
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
      </main>
    </div>
  );
}
