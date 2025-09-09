import { useTranslation } from 'react-i18next';
import { Plug, Database, Boxes, KeySquare, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonStyles, buttonSizeXs } from '../../components/ui/Button';
import SectionBadge from '../../components/marketing/SectionBadge';
import SEO from '../../components/marketing/SEO';
import NumberedSteps from '../../components/marketing/NumberedSteps';

export default function HowToConnect() {
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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <SEO
        title={`${tt('marketing.howto.connect.title')} · SIGMACODE AI`}
        description={tt('marketing.howto.connect.description')}
        canonical="/how-it-works/connect"
        keywords={[tt('marketing.howto.connect.badge'), ...items.map(i => i.title)]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: tt('marketing.landing.sections.badges.flow'), item: '/how-it-works' },
              { '@type': 'ListItem', position: 2, name: tt('marketing.howto.connect.badge'), item: '/how-it-works/connect' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: tt('marketing.howto.connect.title'),
            description: tt('marketing.howto.connect.description'),
            mainEntityOfPage: '/how-it-works/connect',
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
          <Link className="hover:underline" to="/how-it-works">{tt('marketing.landing.sections.badges.flow')}</Link>
          <span className="mx-2">/</span>
          <span>{tt('marketing.howto.connect.badge')}</span>
        </nav>

        <SectionBadge icon={Plug} variant="glass">{tt('marketing.howto.connect.badge')}</SectionBadge>
        <h1 className="mt-2 text-3xl font-bold">{tt('marketing.howto.connect.title')}</h1>
        <p className="mt-2 max-w-3xl text-gray-700 dark:text-gray-300">{tt('marketing.howto.connect.description')}</p>

        <h2 className="sr-only">{tt('marketing.howto.connect.title')}</h2>
        <NumberedSteps
          steps={items}
          prefixKeyOverride="marketing.howto.connect.steps.prefix"
          ariaKeyOverride="marketing.howto.connect.steps.aria"
          colsMd={3}
        />

        <div className="mt-10 text-base md:text-[17px] leading-relaxed text-gray-700 dark:text-gray-300">
          <h3 className="font-semibold">{tt('marketing.howto.connect.badge')}</h3>
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
        <section className="mt-12" aria-labelledby="howto-connect-cta-title">
          <h2 id="howto-connect-cta-title" className="sr-only">{tt('marketing.howto.cta.title')}</h2>
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
