import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '~/components/SEO/Seo';
import { useProviderDetail } from '~/hooks/providers';
import { tt as makeTt } from '~/utils/i18n/tt';
import { trackEvent } from '~/utils/analytics';
import { useCallback, useEffect, useState } from 'react';
import Loading from '~/components/common/Loading';
import ErrorState from '~/components/common/ErrorState';
import { getProviderDetailJsonLd } from '~/utils/seo/providers';
import { motion, useReducedMotion } from 'framer-motion';
import { useMotionProps } from '~/hooks/useMotionProps';
import { ExternalLink, Globe, BookOpen, CheckCircle2, Cpu, Layers, Wallet, Shield, Star } from 'lucide-react';

export default function ProviderDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();
  const tt = makeTt(t);
  const { data: p, isLoading, error, refetch } = useProviderDetail(slug, i18n);
  const prefersReduced = useReducedMotion();
  const fadeIn = useMotionProps('fadeIn');

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.06 },
    },
  } as const;

  const itemVariants = {
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.22 },
    },
  } as const;

  if (isLoading) return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Loading label={tt('common.loading', 'Laden…')} />
      </main>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <main className="container mx-auto px-4 py-8">
        <ErrorState
          message={(error as Error).message || tt('common.error', 'Fehler beim Laden')}
          onRetry={() => refetch()}
          retryLabel={tt('common.retry', 'Erneut versuchen')}
        />
      </main>
    </div>
  );
  if (!p) return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/providers" className="text-sm text-blue-600 hover:underline dark:text-blue-400">{tt('marketing.providers.actions.back', 'Zurück zur Übersicht')}</Link>
        </div>
        <ErrorState message={tt('marketing.providers.detail.notFound', 'Provider nicht gefunden')} />
      </main>
    </div>
  );

  const title = p?.name ? `${p.name} — ${tt('marketing.providers.detail.titleSuffix', 'LLM Provider')}` : undefined;
  const description = p?.subtitle || p?.description;
  const canonical = typeof window !== 'undefined' && p ? `${window.location.origin}/providers/${p.slug}` : undefined;
  const indexName = tt('marketing.providers.index.title', 'LLM Provider');
  const indexUrl = typeof window !== 'undefined' ? `${window.location.origin}/providers` : '/providers';
  const jsonLd = getProviderDetailJsonLd(p, canonical, indexName, indexUrl);

  return (
    <div className="min-h-screen scroll-smooth bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title: title || p?.name, description: description, type: 'article', url: canonical }}
        twitter={{ card: 'summary', title: title || p?.name, description: description }}
        jsonLd={jsonLd}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-4">
          <Link to="/providers" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            {tt('marketing.providers.actions.back', 'Zurück zur Übersicht')}
          </Link>
        </div>

        {/* Hero */}
        <motion.section
          className="ui-glass-card mb-8 rounded-2xl p-6 border border-gray-200/60 dark:border-white/10"
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          transition={fadeIn.transition}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-sky-500/20 to-teal-400/20 text-sky-600 dark:text-sky-300 flex items-center justify-center text-base font-semibold" aria-hidden>
              {p.name?.slice(0,2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{p.name}</h1>
              {p.subtitle && (
                <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-normal break-words">{p.subtitle}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    onClick={() => trackEvent('providers.detail.website_click', { slug: p.slug, name: p.name, url: p.website })}
                  >
                    <Globe className="h-3.5 w-3.5" /> {tt('marketing.providers.actions.website', 'Website')}
                  </a>
                )}
                {p.docsUrl && (
                  <a
                    href={p.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => trackEvent('providers.detail.docs_click', { slug: p.slug, name: p.name, url: p.docsUrl })}
                  >
                    <BookOpen className="h-3.5 w-3.5" /> {tt('marketing.providers.actions.docs', 'Dokumentation')}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Kennzahlen (abgeleitet) */}
          {Array.isArray(p.models) && p.models.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-white/60 p-3 text-sm dark:bg-gray-900/50">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Cpu className="h-4 w-4" />{tt('marketing.providers.detail.models', 'Modelle')}</div>
                <div className="mt-1 text-lg font-semibold">{p.models.length}</div>
              </div>
              <div className="rounded-lg bg-white/60 p-3 text-sm dark:bg-gray-900/50">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Layers className="h-4 w-4" />{tt('marketing.providers.table.context', 'Kontext')}</div>
                <div className="mt-1 text-lg font-semibold">
                  {(() => {
                    const maxCtx = Math.max(
                      ...p.models.map((m: any) => Number.isFinite(m.contextWindow) ? m.contextWindow : 0),
                    );
                    return maxCtx > 0 ? `${maxCtx.toLocaleString()} tokens` : '—';
                  })()}
                </div>
              </div>
              <div className="rounded-lg bg-white/60 p-3 text-sm dark:bg-gray-900/50">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Shield className="h-4 w-4" />{tt('marketing.providers.table.tools', 'Tools')}</div>
                <div className="mt-1 text-lg font-semibold">
                  {p.models.some((m: any) => m.supportsTools) ? tt('common.yes', 'Ja') : tt('common.no', 'Nein')}
                </div>
              </div>
              <div className="rounded-lg bg-white/60 p-3 text-sm dark:bg-gray-900/50">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Star className="h-4 w-4" />{tt('common.highlights', 'Highlights')}</div>
                <div className="mt-1 text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                  {(() => {
                    const strengths = p.models.flatMap((m: any) => Array.isArray(m.strengths) ? m.strengths : []);
                    const unique = Array.from(new Set(strengths));
                    return unique.length ? unique.slice(0, 3).join(', ') : '—';
                  })()}
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* Quick Navigation */}
        <nav
          aria-label={tt('common.navigation', 'Navigation')}
          className="sticky top-0 z-30 mb-8 -mx-4 px-4 py-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 border-b border-gray-200 dark:border-gray-800"
        >
          <ul className="flex flex-wrap gap-2 text-sm">
            {p.description && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#description">{tt('marketing.providers.detail.description', 'Beschreibung')}</a></li>
            )}
            {Array.isArray(p.models) && p.models.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#models">{tt('marketing.providers.detail.models', 'Modelle')}</a></li>
            )}
            {Array.isArray(p.pricing) && p.pricing.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#pricing">{tt('marketing.providers.detail.pricing', 'Preise')}</a></li>
            )}
            {Array.isArray(p.tasks) && p.tasks.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#tasks">{tt('marketing.providers.detail.tasks', 'Empfohlene Aufgaben')}</a></li>
            )}
            {Array.isArray(p.agentPatterns) && p.agentPatterns.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#agent-patterns">{tt('marketing.providers.detail.agentPatterns', 'Agent-Patterns')}</a></li>
            )}
            {Array.isArray(p.integrations) && p.integrations.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#integrations">{tt('marketing.providers.detail.integrations', 'Integrationen')}</a></li>
            )}
            {Array.isArray(p.sdks) && p.sdks.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#sdks">SDKs</a></li>
            )}
            {(Array.isArray(p.regions) && p.regions.length > 0) && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#regions">{tt('marketing.providers.detail.regions', 'Regionen')}</a></li>
            )}
            {(Array.isArray(p.compliance) && p.compliance.length > 0) && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#compliance">{tt('marketing.providers.detail.compliance', 'Compliance')}</a></li>
            )}
            {Array.isArray(p.faq) && p.faq.length > 0 && (
              <li><a className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" href="#faq">FAQ</a></li>
            )}
          </ul>
        </nav>

        {/* Beschreibung */}
        {p.description && (
          <section id="description" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold mb-2">{tt('marketing.providers.detail.description', 'Beschreibung')}</h2>
            <p className="text-gray-700 dark:text-gray-200">{p.description}</p>
          </section>
        )}

        {/* Pricing */}
        {Array.isArray(p.pricing) && p.pricing.length > 0 && (
          <section id="pricing" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold mb-3">{tt('marketing.providers.detail.pricing', 'Preise')}</h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {p.pricing.map((pr: any, idx: number) => (
                <motion.div key={idx} className="ui-glass-card rounded-lg p-3 border border-gray-200/60 dark:border-white/10" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium flex items-center gap-2"><Wallet className="h-4 w-4" />{pr.plan}</div>
                    {pr.url && (
                      <a href={pr.url} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400">
                        <ExternalLink className="h-3.5 w-3.5" /> {tt('marketing.providers.actions.more', 'Details')}
                      </a>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {tt('marketing.providers.detail.unit', 'Einheit')}: {pr.unit || '—'}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {tt('marketing.providers.detail.input', 'Input')}: {typeof pr.input === 'number' ? pr.input : '—'}
                    {' · '}
                    {tt('marketing.providers.detail.output', 'Output')}: {typeof pr.output === 'number' ? pr.output : '—'}
                  </div>
                  {pr.notes && <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">{pr.notes}</div>}
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Modelle */}
        {Array.isArray(p.models) && p.models.length > 0 && (
          <section id="models" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold mb-3">{tt('marketing.providers.detail.models', 'Modelle')}</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/70">
                  <tr>
                    <th className="text-left p-2 font-medium">{tt('marketing.providers.table.model', 'Modell')}</th>
                    <th className="text-left p-2 font-medium">{tt('marketing.providers.table.context', 'Kontext')}</th>
                    <th className="text-left p-2 font-medium">{tt('marketing.providers.table.tools', 'Tools')}</th>
                    <th className="text-left p-2 font-medium">{tt('marketing.providers.table.strengths', 'Stärken')}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.models.map((m: any) => (
                    <tr key={m.name} className="border-t border-gray-200 dark:border-gray-800">
                      <td className="p-2 font-medium">{m.name}</td>
                      <td className="p-2">{m.contextWindow ? `${m.contextWindow.toLocaleString()} tokens` : '—'}</td>
                      <td className="p-2">
                        {m.supportsTools ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {tt('common.yes', 'Ja')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">{tt('common.no', 'Nein')}</span>
                        )}
                      </td>
                      <td className="p-2">{Array.isArray(m.strengths) ? m.strengths.join(', ') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Aufgaben */}
        {Array.isArray(p.tasks) && p.tasks.length > 0 && (
          <section id="tasks" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold mb-3">{tt('marketing.providers.detail.tasks', 'Empfohlene Aufgaben')}</h2>
            <motion.ul
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {p.tasks.map((tItem: any, idx: number) => (
                <motion.li key={idx} className="ui-glass-card rounded-lg p-3 border border-gray-200/60 dark:border-white/10" variants={itemVariants}>
                  <div className="text-sm font-medium">{tItem.type}</div>
                  <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                    {tt('marketing.providers.detail.recommended', 'Empfohlen:')} {Array.isArray(tItem.recommendedModels) ? tItem.recommendedModels.join(', ') : '—'}
                  </div>
                  {tItem.notes && <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">{tItem.notes}</div>}
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}

        {/* Agent Patterns */}
        {Array.isArray(p.agentPatterns) && p.agentPatterns.length > 0 && (
          <section id="agent-patterns" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold mb-3">{tt('marketing.providers.detail.agentPatterns', 'Agent-Patterns')}</h2>
            <motion.ul
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {p.agentPatterns.map((ap: any, idx: number) => (
                <motion.li key={idx} className="ui-glass-card rounded-lg p-3 border border-gray-200/60 dark:border-white/10" variants={itemVariants}>
                  <div className="text-sm font-medium">{ap.name}</div>
                  <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{tt('marketing.providers.detail.bestWith', 'Am besten mit')}: {Array.isArray(ap.bestWith) ? ap.bestWith.join(', ') : '—'}</div>
                  {Array.isArray(ap.pitfalls) && ap.pitfalls.length > 0 && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">{tt('marketing.providers.detail.pitfalls', 'Fallstricke')}: {ap.pitfalls.join(', ')}</div>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}

        {/* FAQ */}
        {Array.isArray(p.faq) && p.faq.length > 0 && (
          <section id="faq" className="mb-8 scroll-mt-24">
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>
            <motion.ul
              className="space-y-3"
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {p.faq.map((f: any, idx: number) => (
                <motion.li key={idx} className="ui-glass-card rounded-lg p-3 border border-gray-200/60 dark:border-white/10" variants={itemVariants}>
                  <div className="font-medium">{f.q}</div>
                  <div className="text-gray-700 dark:text-gray-200 text-sm">{f.a}</div>
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}

        {/* Footer-Links */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <Globe className="h-3.5 w-3.5" /> {tt('marketing.providers.actions.website', 'Website')}
            </a>
          )}
          {p.docsUrl && (
            <a
              href={p.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <BookOpen className="h-3.5 w-3.5" /> {tt('marketing.providers.actions.docs', 'Dokumentation')}
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
