import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Roadmap from '@/components/pitchdeck/Sections/Roadmap.tsx';

export default function RoadmapOnly() {
  const { t } = useTranslation();
  // Lokaler Helper für typsichere i18n-Strings
  const tt = t as unknown as (key: string, options?: Record<string, unknown>) => string;
  const helmetTitle = tt('marketing.roadmap.title', { defaultValue: 'Roadmap – SIGMACODE AI' });
  const helmetDescription = tt('marketing.roadmap.description', { defaultValue: 'Öffentliche Roadmap mit animierter Scroll-Führung durch unsere Meilensteine.' });
  const helmetUrl = typeof window !== 'undefined' ? window.location.href : 'https://sigmacode.ai/roadmap';
  const helmetImage = 'https://sigmacode.ai/og-image.png';

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        <meta property="og:title" content={helmetTitle} />
        <meta property="og:description" content={helmetDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={helmetUrl} />
        <meta property="og:image" content={helmetImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={helmetTitle} />
        <meta name="twitter:description" content={helmetDescription} />
        <meta name="twitter:image" content={helmetImage} />
      </Helmet>

      {/* Nur die Roadmap-Sektion, eigenständig nutzbar */}
      <Roadmap />

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">{tt('marketing.roadmap.cta_title', { defaultValue: 'Nächster Schritt' })}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{tt('marketing.roadmap.cta_subtitle', { defaultValue: 'Interesse an der Umsetzung oder Partnerschaft? Lass uns sprechen.' })}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/support/contact"
                className="inline-flex items-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                data-analytics-id="roadmap-cta-contact"
              >
                {tt('marketing.roadmap.cta_contact', { defaultValue: 'Kontakt aufnehmen' })}
              </Link>
              <Link
                to="/c/new"
                className="inline-flex items-center rounded-md text-gray-800 dark:text-gray-100 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border"
                data-analytics-id="roadmap-cta-chat"
              >
                {tt('marketing.roadmap.cta_chat', { defaultValue: 'Jetzt chatten' })}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
