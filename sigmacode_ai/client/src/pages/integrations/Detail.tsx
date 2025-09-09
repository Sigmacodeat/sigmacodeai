import { Link, useParams } from 'react-router-dom';
import { getIntegrationBySlug, integrations } from './data';
import Seo from '~/components/SEO/Seo';

export default function IntegrationDetail() {
  const { slug } = useParams();
  const integration = slug ? getIntegrationBySlug(slug) : undefined;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const hubUrl = typeof window !== 'undefined' ? `${window.location.origin}/integrations` : '/integrations';

  if (!integration) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-semibold">Integration nicht gefunden</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Die angeforderte Integration existiert nicht oder wurde umbenannt.
        </p>
        <div className="mt-4">
          <Link to="/integrations" className="text-teal-600 hover:underline">
            Zur Integrationsübersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Seo
        title={`${integration.title} – Integration – SigmacodeAI`}
        description={integration.description}
        canonical={url}
        openGraph={{
          title: `${integration.title} – Integration – SigmacodeAI`,
          description: integration.description,
          type: 'article',
          url,
          image: integration.ogImage || integration.logo || '',
          siteName: 'SigmacodeAI',
        }}
        twitter={{
          card: 'summary_large_image',
          title: `${integration.title} – Integration – SigmacodeAI`,
          description: integration.description,
          image: integration.ogImage || integration.logo || '',
        }}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Integrationen', item: hubUrl },
              { '@type': 'ListItem', position: 2, name: integration.title, item: url },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: integration.title,
            applicationCategory: integration.category,
            description: integration.description,
            url,
            image: integration.ogImage || integration.logo,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          },
          integration.faqs.length
            ? {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: integration.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }
            : (undefined as unknown as Record<string, unknown>),
        ].filter(Boolean as unknown as <T>(x: T) => x is T)}
      />
      <header className="mb-6">
        <div className="flex items-center gap-3">
          {integration.logo ? (
            <img src={integration.logo} alt="" className="h-8 w-8" aria-hidden />
          ) : (
            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" aria-hidden />
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{integration.title}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{integration.description}</p>
          </div>
        </div>
      </header>

      {integration.features.length > 0 && (
        <section className="mb-8" aria-labelledby="features-heading">
          <h2 id="features-heading" className="mb-2 text-lg font-semibold">Features</h2>
          <ul className="list-disc space-y-1 pl-5">
            {integration.features.map((f, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">{f}</li>
            ))}
          </ul>
        </section>
      )}

      {integration.steps.length > 0 && (
        <section className="mb-8" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="mb-2 text-lg font-semibold">Setup Schritte</h2>
          <ol className="list-decimal space-y-1 pl-5">
            {integration.steps.map((s, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">{s}</li>
            ))}
          </ol>
        </section>
      )}

      {integration.faqs.length > 0 && (
        <section className="mb-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-2 text-lg font-semibold">FAQ</h2>
          <div className="space-y-3">
            {integration.faqs.map((f, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="text-sm font-medium">{f.q}</div>
                <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{f.a}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-8">
        <Link
          to={integration.cta.href}
          className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          {integration.cta.label}
        </Link>
        <div className="mt-6">
          <Link to="/integrations" className="text-sm text-teal-600 hover:underline">
            Zur Integrationsübersicht
          </Link>
        </div>
      </footer>

      {/* Related Integrations */}
      {(() => {
        const related = integrations
          .filter((i) => i.category === integration.category && i.slug !== integration.slug)
          .slice(0, 6);
        if (!related.length) return null;
        return (
          <section className="mt-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-3 text-lg font-semibold">
              Verwandte Integrationen
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
              {related.map((i) => (
                <li key={i.slug}>
                  <Link
                    to={`/integrations/${i.slug}`}
                    className="block rounded-xl border border-gray-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
                    aria-label={`${i.title}: ${i.description}`}
                  >
                    <div className="flex items-center gap-3">
                      {i.logo ? (
                        <img src={i.logo} alt="" className="h-7 w-7" aria-hidden />
                      ) : (
                        <div className="h-7 w-7 rounded bg-gray-200 dark:bg-gray-700" aria-hidden />
                      )}
                      <div>
                        <div className="text-sm font-semibold">{i.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{i.description}</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}
    </article>
  );
}
