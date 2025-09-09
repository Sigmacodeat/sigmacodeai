import { Link } from 'react-router-dom';
import { integrations } from './data';
import Seo from '~/components/SEO/Seo';

export default function IntegrationsIndex() {
  const categories = Array.from(new Set(integrations.map((i) => i.category)));
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Seo
        title="Integrationen – SigmacodeAI"
        description="Alle verfügbaren Integrationen für SigmacodeAI: Von Kommunikation über Knowledge bis hin zu Automations. Finde passende Anbindungen und Setup-Anleitungen."
        canonical={url}
        openGraph={{ title: 'Integrationen – SigmacodeAI', description: 'Alle verfügbaren Integrationen für SigmacodeAI', type: 'website', url }}
        twitter={{ card: 'summary', title: 'Integrationen – SigmacodeAI', description: 'Alle verfügbaren Integrationen' }}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Integrationen',
                item: url,
              },
            ],
          },
        ]}
      />
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Integrationen</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Entdecke verfügbare Integrationen und ihre Anwendungsfälle. Wähle eine Integration aus, um Setup-Schritte, Features und FAQs zu sehen.
        </p>
      </header>

      <div className="space-y-10">
        {categories.map((cat) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <h2 id={`cat-${cat}`} className="mb-3 text-lg font-semibold">
              {cat}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" role="list">
              {integrations
                .filter((i) => i.category === cat)
                .map((i) => (
                  <li key={i.slug}>
                    <Link
                      to={`/integrations/${i.slug}`}
                      className="block rounded-xl border border-gray-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
                      aria-label={`${i.title}: ${i.description}`}
                    >
                      <div className="flex items-center gap-3">
                        {i.logo ? (
                          <img src={i.logo} alt="" className="h-8 w-8" aria-hidden />
                        ) : (
                          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" aria-hidden />
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
        ))}
      </div>
    </div>
  );
}
