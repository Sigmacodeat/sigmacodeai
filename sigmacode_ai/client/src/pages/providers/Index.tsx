import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Seo from '~/components/SEO/Seo';
import { useProvidersList } from '~/hooks/providers';
import { tt as makeTt } from '~/utils/i18n/tt';
import { trackEvent } from '~/utils/analytics';
import Loading from '~/components/common/Loading';
import ErrorState from '~/components/common/ErrorState';
import { getProvidersIndexJsonLd } from '~/utils/seo/providers';
import { Search, ArrowUpDown, ExternalLink, Wallet } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMotionProps } from '~/hooks/useMotionProps';

export default function ProvidersIndex() {
  const { i18n, t } = useTranslation();
  const { data: providers = [], isLoading, error, refetch } = useProvidersList(i18n);
  const tt = makeTt(t);
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

  // UI State: Suche + Sortierung (client-seitig)
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'name_asc' | 'name_desc'>('name_asc');
  // Filter
  const [toolsOnly, setToolsOnly] = useState(false);
  const [minContext, setMinContext] = useState<number>(0);
  const [hasPricingOnly, setHasPricingOnly] = useState(false);

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8">
      <Loading label={tt('common.loading', 'Laden…')} />
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <ErrorState
        message={(error as Error).message || tt('common.error', 'Fehler beim Laden')}
        onRetry={() => refetch()}
        retryLabel={tt('common.retry', 'Erneut versuchen')}
      />
    </div>
  );

  const title = tt('marketing.providers.index.title', 'LLM Provider');
  const description = tt('marketing.providers.index.subtitle', 'Übersicht über Modelle, Stärken und Use-Cases');
  const canonical = typeof window !== 'undefined' ? `${window.location.origin}/providers` : undefined;
  const jsonLd = getProvidersIndexJsonLd(providers, title, description, canonical);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = providers;
    if (q) {
      list = list.filter((p: any) =>
        [p.name, p.subtitle]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    // Apply filters
    if (toolsOnly) {
      list = list.filter((p: any) => Array.isArray(p.models) && p.models.some((m: any) => m.supportsTools));
    }
    if (minContext && Number.isFinite(minContext) && minContext > 0) {
      list = list.filter((p: any) => {
        const maxCtx = Math.max(...(Array.isArray(p.models) ? p.models.map((m: any) => (Number.isFinite(m.contextWindow) ? m.contextWindow : 0)) : [0]));
        return maxCtx >= minContext;
      });
    }
    if (hasPricingOnly) {
      list = list.filter((p: any) => Array.isArray(p.pricing) && p.pricing.length > 0);
    }
    const sorted = [...list].sort((a: any, b: any) => {
      const an = (a.name || '').toLowerCase();
      const bn = (b.name || '').toLowerCase();
      if (sort === 'name_asc') return an.localeCompare(bn);
      return bn.localeCompare(an);
    });
    return sorted;
  }, [providers, query, sort, toolsOnly, minContext, hasPricingOnly]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, type: 'website', url: canonical }}
        twitter={{ card: 'summary', title, description }}
        jsonLd={jsonLd}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

        {/* Controls: Suche + Sortierung + Filter */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <label htmlFor="providers-search" className="sr-only">{tt('common.search', 'Suche')}</label>
              <input
                id="providers-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tt('marketing.providers.index.search_placeholder', 'Anbieter oder Beschreibung suchen…')}
                className="w-full rounded-md border border-gray-200 bg-white/70 px-10 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-50"
              />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="providers-sort" className="text-sm text-gray-600 dark:text-gray-300">
                {tt('common.sort', 'Sortierung')}
              </label>
              <div className="relative">
                <select
                  id="providers-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="appearance-none rounded-md border border-gray-200 bg-white/70 py-2 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-50"
                >
                  <option value="name_asc">{tt('common.name_asc', 'Name (A–Z)')}</option>
                  <option value="name_desc">{tt('common.name_desc', 'Name (Z–A)')}</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" checked={toolsOnly} onChange={(e) => setToolsOnly(e.target.checked)} />
              {tt('marketing.providers.filters.tools_only', 'Nur mit Tools')}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300">{tt('marketing.providers.filters.min_context', 'Min. Kontext')}</span>
              <select
                value={minContext}
                onChange={(e) => setMinContext(Number(e.target.value))}
                className="rounded-md border border-gray-200 bg-white/70 py-1.5 px-2 text-sm text-gray-900 shadow-sm focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-50"
              >
                <option value={0}>{tt('common.any', 'Beliebig')}</option>
                <option value={32000}>32k</option>
                <option value={128000}>128k</option>
                <option value={200000}>200k</option>
                <option value={1000000}>1M</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" checked={hasPricingOnly} onChange={(e) => setHasPricingOnly(e.target.checked)} />
              {tt('marketing.providers.filters.has_pricing', 'Nur mit Preisen')}
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-white/50 dark:bg-gray-900/50 text-sm text-gray-600 dark:text-gray-300">
            {query
              ? tt('marketing.providers.index.empty_query', 'Keine Anbieter passend zur Suche gefunden.')
              : tt('marketing.providers.index.empty', 'Keine Anbieter gefunden.')}
          </div>
        ) : (
          <motion.ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {filtered.map((p: any) => (
              <motion.li
                key={p.slug}
                className="ui-glass-card group rounded-xl p-5 border border-gray-200/60 dark:border-white/10 transition hover:shadow-md"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 shrink-0 rounded-md bg-gradient-to-br from-sky-500/15 to-teal-400/15 text-sky-600 dark:text-sky-300 flex items-center justify-center text-sm font-semibold"
                    aria-hidden
                  >
                    {p.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      <Link
                        to={`/providers/${p.slug}`}
                        className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                        onClick={() => trackEvent('providers.card.title_click', { slug: p.slug, name: p.name })}
                      >
                        {p.name}
                      </Link>
                    </h2>
                    {p.subtitle && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{p.subtitle}</p>
                    )}
                    {/* Badges */}
                    {Array.isArray(p.models) && p.models.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {p.models.length} {tt('marketing.providers.detail.models', 'Modelle')}
                        </span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {p.models.some((m: any) => m.supportsTools) ? tt('common.tools_supported', 'Tools') : tt('common.no_tools', 'Ohne Tools')}
                        </span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {(() => {
                            const maxCtx = Math.max(
                              ...p.models.map((m: any) => Number.isFinite(m.contextWindow) ? m.contextWindow : 0),
                            );
                            return maxCtx > 0 ? `${maxCtx.toLocaleString()} ctx` : '—';
                          })()}
                        </span>
                        {Array.isArray(p.pricing) && p.pricing.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <Wallet className="h-3 w-3" /> {tt('marketing.providers.detail.pricing', 'Preise')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    to={`/providers/${p.slug}`}
                    className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    onClick={() => trackEvent('providers.card.details_click', { slug: p.slug, name: p.name })}
                  >
                    {tt('marketing.providers.actions.details', 'Details ansehen')}
                  </Link>
                  {p.docsUrl && (
                    <a
                      href={p.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => trackEvent('providers.card.docs_click', { slug: p.slug, name: p.name, url: p.docsUrl })}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {tt('marketing.providers.actions.docs', 'Dokumentation')}
                    </a>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </main>
    </div>
  );
}
