/**
 * PitchDeck Route
 *
 * Wichtiger Hinweis:
 * - Diese Route ist die einzige Stelle, an der die modularen PitchDeck-Sections
 *   (aus `components/pitchdeck/Sections/`) gerendert werden.
 * - Bitte KEINE PitchDeck-Sections in anderen Routen/Seiten importieren, um doppelte Renderings
 *   und SEO-Konflikte zu vermeiden. Für Landing-Previews/Teaser separate Landing-Sections verwenden.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Cover from '@/components/pitchdeck/Sections/Cover.tsx';
import Problem from '@/components/pitchdeck/Sections/Problem.tsx';
import Solution from '@/components/pitchdeck/Sections/Solution.tsx';
import Product from '@/components/pitchdeck/Sections/Product.tsx';
import Market from '@/components/pitchdeck/Sections/Market.tsx';
import Business from '@/components/pitchdeck/Sections/Business.tsx';
import Pricing from '@/components/pitchdeck/Sections/Pricing.tsx';
import UnitEconomics from '@/components/pitchdeck/Sections/UnitEconomics.tsx';
import KPIs from '@/components/pitchdeck/Sections/KPIs.tsx';
import Financials from '@/components/pitchdeck/Sections/Financials.tsx';
import Costs from '@/components/pitchdeck/Sections/Costs.tsx';
import Competition from '@/components/pitchdeck/Sections/Competition.tsx';
import Technology from '@/components/pitchdeck/Sections/Technology.tsx';
import GTM from '@/components/pitchdeck/Sections/GTM.tsx';
import Traction from '@/components/pitchdeck/Sections/Traction.tsx';
import Roadmap from '@/components/pitchdeck/Sections/Roadmap.tsx';
import Risks from '@/components/pitchdeck/Sections/Risks.tsx';
import Ask from '@/components/pitchdeck/Sections/Ask.tsx';
import Exit from '@/components/pitchdeck/Sections/Exit.tsx';
import Team from '@/components/pitchdeck/Sections/Team.tsx';
import Contact from '@/components/pitchdeck/Sections/Contact.tsx';
import Impact from '@/components/pitchdeck/Sections/Impact.tsx';
import CTA from '@/components/pitchdeck/Sections/CTA.tsx';
import { costData, revenueData } from '@/components/pitchdeck/Sections/data.ts';

// Theme-Observer: erkennt Wechsel zwischen Light/Dark anhand der 'dark'-Klasse auf <html>
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
  );
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

// Hinweis: Counter/Charts werden in modularen Sections gekapselt.

export default function PitchDeck() {
  const isDark = useIsDarkMode();
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Scroll-Progress über Framer Motion (Container-basiert)
  const { scrollYProgress } = useScroll({ container: rootRef });
  const progressSpring = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  // Feature-Flag: Progress-Navigation (kleine Punkte rechts) anzeigen
  const SHOW_PROGRESS_NAV = false;
  const sectionOrder = useMemo(
    () => [
      'Cover',
      'Problem',
      'Lösung',
      'Produkt',
      'Markt',
      'Wettbewerb',
      'Technik',
      'GTM',
      'Traction',
      'Business',
      'Roadmap',
      'Kosten',
      'Risiken',
      'Pricing',
      'UnitEconomics',
      'KPIs',
      'Financials',
      'Ask',
      'Exit',
      'Team',
      'Kontakt',
      'Impact',
      'CTA',
    ],
    [],
  );
  const [activeId, setActiveId] = useState<string>('Cover');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const [navShadow, setNavShadow] = useState(false);

  // Daten werden zentral aus Sections/data.ts importiert (costData, revenueData)

  // Recharts Theme-Farben je Modus
  const chartColors = useMemo(() => {
    const axisTick = isDark ? '#D1D5DB' : '#374151'; // gray-300 / gray-700
    const axisLine = isDark ? '#374151' : '#E5E7EB'; // gray-700 / gray-200
    const grid = isDark ? '#374151' : '#E5E7EB';
    const tooltipBg = isDark ? '#111827' : '#FFFFFF'; // gray-900 / white
    const tooltipText = isDark ? '#F9FAFB' : '#111827'; // gray-50 / gray-900
    const bar = isDark ? '#60A5FA' : '#3B82F6'; // blue-400 / blue-600
    return { axisTick, axisLine, grid, tooltipBg, tooltipText, bar };
  }, [isDark]);

  // SEO: via Helmet (deklarativ)
  const helmetTitle = 'Pitchdeck – SIGMACODE AI';
  const helmetOgTitle = 'SigmaCode AI Pitchdeck';
  const helmetDescription =
    'Humanoide Roboter as a Service: KI-OS, Skill-Store, RaaS – Marktstart EU. Investoren- und Förder-ready Pitchdeck.';
  const helmetUrl = typeof window !== 'undefined' ? window.location.href : 'https://sigmacode.ai/pitchdeck';
  const helmetImage = 'https://sigmacode.ai/og-image.png';

  useEffect(() => {
    // Scroll-Spy via IntersectionObserver
    const els = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // Wähle die Section mit größter Sichtbarkeit
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { threshold: [0.2, 0.6, 0.9] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionOrder]);

  // Keyboard Shortcuts: j/k oder Pfeiltasten für nächste/vorherige Sektion
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Eingaben in Formularen nicht abfangen
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const idx = sectionOrder.indexOf(activeId);
      const goto = (nextIdx: number) => {
        const bounded = Math.min(Math.max(nextIdx, 0), sectionOrder.length - 1);
        const id = sectionOrder[bounded];
        const el = document.getElementById(id);
        if (el) {
          setActiveId(id);
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          goto(idx + 1);
          break;
        case 'k':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          goto(idx - 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeId, sectionOrder]);

  // Auto-center aktiven Link in der horizontal scrollbaren Link-Leiste
  useEffect(() => {
    const container = linksRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeId]);

  // Navbar-Shadow bei Scroll: zeigt subtilen Schatten, sobald Inhalt gescrollt ist
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onScroll = () => setNavShadow(el.scrollTop > 2);
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll as any);
  }, []);

  const progressPct = useMemo(() => {
    const idx = Math.max(0, sectionOrder.indexOf(activeId));
    return Math.round(((idx + 1) / sectionOrder.length) * 100);
  }, [activeId, sectionOrder]);

  const handleExport = async () => {
    setExportError(null);
    setIsExporting(true);
    // Verbesserter PDF-Export: versuche html2pdf.js (optional), sonst Fallback print
    try {
      const el = rootRef.current ?? document.body;
      // dynamischer Import ohne statische Modulauflösung
      const mod = (await (Function('return import("html2pdf.js")')() as Promise<any>)) as any;
      const html2pdf = mod?.default ?? mod;
      if (html2pdf && el) {
        const opt = {
          margin: [10, 10, 14, 10],
          filename: 'SigmaCodeAI-Pitchdeck.pdf',
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        } as any;
        await html2pdf().set(opt).from(el).save();
        setIsExporting(false);
        return;
      }
      // Fallback
      window.print();
    } catch (e: any) {
      console.error('PDF Export fehlgeschlagen', e);
      setExportError('Export fehlgeschlagen. Bitte erneut versuchen oder Browser-Print nutzen.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={rootRef} className="w-full h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-y-auto snap-y snap-mandatory print:bg-white">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        <meta property="og:title" content={helmetOgTitle} />
        <meta property="og:description" content={helmetDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={helmetUrl} />
        <meta property="og:image" content={helmetImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={helmetOgTitle} />
        <meta name="twitter:description" content={helmetDescription} />
        <meta name="twitter:image" content={helmetImage} />
      </Helmet>
      <style>{`
        @media print {
          nav { display: none !important; }
          .print-section { page-break-before: always; break-before: page; }
          .print-section:first-of-type { page-break-before: avoid; break-before: auto; }
          .snap-start { height: auto !important; min-height: auto !important; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      {/* Top-Navigation */}
      <nav aria-label="Pitchdeck Navigation" className={[
        'sticky top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-between px-4 md:px-8 py-3 relative',
        navShadow ? 'shadow-sm' : '',
      ].join(' ')}>
        <div className="flex items-center gap-4 min-w-0">
          {/* Mobile TOC */}
          <label className="sm:hidden text-xs text-gray-600 dark:text-gray-300" htmlFor="toc-select">Sektion</label>
          <select
            id="toc-select"
            className="sm:hidden block text-sm bg-white dark:bg-gray-900 rounded-md px-2 py-1 text-gray-800 dark:text-gray-100"
            value={activeId}
            onChange={(e) => {
              const id = e.target.value;
              setActiveId(id);
              const el = document.getElementById(id);
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {sectionOrder.filter((s) => s !== 'Cover').map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {/* Desktop/Tablet Link-Leiste */}
          <div ref={linksRef} className="hidden sm:flex items-center gap-6 overflow-x-auto">
            {['Problem', 'Lösung', 'Produkt', 'Markt', 'Wettbewerb', 'Technik', 'GTM', 'Traction', 'Business', 'Roadmap', 'Kosten', 'Risiken', 'Pricing', 'UnitEconomics', 'KPIs', 'Financials', 'Ask', 'Exit', 'Team', 'Kontakt', 'Impact', 'CTA'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={[
                  'text-sm font-medium transition-colors whitespace-nowrap',
                  activeId === item
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600',
                ].join(' ')}
                aria-current={activeId === item ? 'page' : undefined}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#Cover" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600">Cover</a>
          <button
            type="button"
            onClick={async () => {
              try {
                const url = `${window.location.origin}${window.location.pathname}#${activeId}`;
                await navigator.clipboard.writeText(url);
                setCopiedLink(url);
                setTimeout(() => setCopiedLink(null), 2000);
              } catch (err) {
                setCopiedLink('Fehler beim Kopieren');
                setTimeout(() => setCopiedLink(null), 2000);
              }
            }}
            className="inline-flex items-center gap-2 rounded-md text-gray-800 dark:text-gray-100 text-sm px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            aria-label="Link zur aktiven Sektion kopieren"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 5"/>
              <path d="M14 11a5 5 0 00-7.07 0L5.5 12.43a5 5 0 007.07 7.07L14 19"/>
            </svg>
            Link kopieren
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            aria-busy={isExporting}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white text-sm px-3 py-2 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Export läuft…
              </>
            ) : (
              'Export als PDF'
            )}
          </button>
        </div>
        {/* Fehler-Hinweis bei Export */}
        {exportError && (
          <div role="alert" className="absolute -bottom-7 left-4 right-4 text-xs text-red-600 dark:text-red-400">
            {exportError}
          </div>
        )}
        {/* Kopiert-Toast */}
        {copiedLink && (
          <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
            {copiedLink === 'Fehler beim Kopieren' ? copiedLink : 'Link kopiert!'}
          </div>
        )}
        {/* Progress Bar (useScroll-basiert) */}
        <div className="absolute left-0 bottom-0 h-0.5 bg-blue-100 dark:bg-gray-700 w-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            style={{ scaleX: progressSpring, transformOrigin: 'left' }}
          />
        </div>
      </nav>

      {/* Cover (modular) */}
      <Cover scrollYProgress={scrollYProgress} />

      {/* Problem (modular) */}
      <Problem />

      {/* Lösung (modular) */}
      <Solution />

      {/* Produkt (modular) */}
      <Product />

      {/* Markt (modular) */}
      <Market />

      {/* Wettbewerb (modular) */}
      <Competition />

      {/* Technik (modular) */}
      <Technology />

      {/* Business (modular) */}
      <Business />

      {/* GTM (modular) */}
      <GTM />

      {/* Traction (modular) */}
      <Traction />

      {/* Roadmap (modular) */}
      <Roadmap />

      {/* Kosten (modular) */}
      <Costs data={costData} chartColors={chartColors} isDark={isDark} />

      {/* Risiken (modular) */}
      <Risks />

      {/* Pricing (modular) */}
      <Pricing />

      {/* Unit Economics (modular) */}
      <UnitEconomics />

      {/* KPIs (modular) */}
      <KPIs />

      {/* Financials (modular) */}
      <Financials data={revenueData} chartColors={chartColors} isDark={isDark} />

      {/* Ask (modular) */}
      <Ask />

      {/* Exit (modular) */}
      <Exit />

      {/* Team (modular) */}
      <Team />

      {/* Kontakt (modular) */}
      <Contact />

      {/* Impact (modular) */}
      <Impact />

      {/* CTA (modular) */}
      <CTA />

      {/* Progress Dots (mobil unten zentriert, Desktop rechts vertikal) */}
      {SHOW_PROGRESS_NAV && (
        <div
          aria-label="Progress Navigation"
          className="no-print fixed z-40 flex gap-2 p-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm
                     bottom-3 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-3 md:top-1/2 md:-translate-y-1/2 md:translate-x-0
                     md:flex-col"
        >
          {sectionOrder.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveId(id);
                const el = document.getElementById(id);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              aria-label={`Gehe zu ${id}`}
              aria-current={activeId === id ? 'page' : undefined}
              className={[
                'h-2.5 w-2.5 rounded-full transition-all',
                activeId === id ? 'bg-blue-600 scale-110' : 'bg-gray-400/70 hover:bg-gray-500',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
