import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Gift } from 'lucide-react';
import BrandIcon from '../common/BrandIcon';
import { useMenuClose } from '../../hooks/useMenuClose';
import { useMotionProps } from '../../hooks/useMotionProps';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import MenuItem from './MenuItem';
import { getProductItems, getHowtoItems, getPricesItems, buildSectionsItems } from './menuConfig';
import { useActiveSection } from '../../hooks/useActiveSection';
import { scrollToId as scrollToIdUtil, getHashId, buildHashUrl, handleMenuKeyNav } from '../../utils/navigation';
import { useTranslation } from 'react-i18next';
import Dropdown from './Dropdown';

export type MarketingHeaderProps = {
  sectionIds?: string[]; // IDs der Anchor-Sektionen auf der Seite
  stickyOffsetPx?: number; // Höhe des Sticky-Headers für rootMargin
};

/**
 * MarketingHeader
 * - Desktop: Menubar mit Dropdowns (Produkte, Preise)
 * - Mobile: Drawer mit Details/Summary
 * - A11y: Escape zum Schließen, Outside-Click, Fokus-Management
 * - Active Link: via IntersectionObserver für Anchors + via pathname für Routen
 */
export default function MarketingHeader({ sectionIds = [], stickyOffsetPx = 96 }: MarketingHeaderProps) {
  const prefersReduced = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | 'produkte' | 'preise' | 'howto' | 'sections'>(null);
  const productsMenuRef = useRef<HTMLDivElement | null>(null);
  const pricesMenuRef = useRef<HTMLDivElement | null>(null);
  const howtoMenuRef = useRef<HTMLDivElement | null>(null);
  const sectionsMenuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const productsButtonRef = useRef<HTMLButtonElement | null>(null);
  const pricesButtonRef = useRef<HTMLButtonElement | null>(null);
  const howtoButtonRef = useRef<HTMLButtonElement | null>(null);
  const sectionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const hoverCloseTimer = useRef<number | null>(null);
  const [measuredOffset, setMeasuredOffset] = useState<number>(stickyOffsetPx);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Active section via IO
  const rootMargin = useMemo(() => `-${measuredOffset}px 0px -60% 0px`, [measuredOffset]);
  const activeId = useActiveSection({ sectionIds, rootMargin, threshold: 0.2 });

  // Close helpers with hover-intent
  const clearHoverTimer = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  // HowTo Icons/Items kommen aus shared howtoEntries

  // Shared menu entries for Mobile (and future Desktop convergence)
  const productEntries = useMemo(() => getProductItems(t), [t]);
  const howtoEntries = useMemo(() => getHowtoItems(t), [t]);
  const pricesEntries = useMemo(() => getPricesItems(t), [t]);
  const sectionsEntries = useMemo(() => buildSectionsItems(t, sectionIds), [t, sectionIds]);

  // Active state for Sections button (depends on sectionsEntries)
  const sectionsActive = useMemo(() => {
    const hashId = getHashId(location.hash || '');
    return sectionsEntries.some((s) => activeId === s.id || hashId === s.id);
  }, [sectionsEntries, location.hash, activeId]);
  const scheduleClose = () => {
    clearHoverTimer();
    hoverCloseTimer.current = window.setTimeout(() => setOpenMenu(null), 120);
  };
  const closeAll = () => {
    clearHoverTimer();
    setOpenMenu(null);
  };
  const toggleMenu = (name: 'produkte' | 'preise' | 'howto' | 'sections') => {
    clearHoverTimer();
    setOpenMenu((prev) => (prev === name ? null : name));
  };
  // Adapter: Hook erwartet (val: string | null) => void
  const setOpenMenuAdapter = (val: string | null) => setOpenMenu(val as unknown as typeof openMenu);
  // Globales Close-Handling via Hook (Outside-Click + Escape)
  useMenuClose({ openMenu, setOpenMenu: setOpenMenuAdapter, mobileOpen, setMobileOpen, triggerRef });

  // Schließe Dropdowns bei Route-/Hash-Wechsel; Mobile-Drawer bei Routenwechsel schließen
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fokus-Management: beim Öffnen erstes Item fokussieren
  useEffect(() => {
    const ref = openMenu === 'produkte'
      ? productsMenuRef
      : openMenu === 'preise'
      ? pricesMenuRef
      : openMenu === 'howto'
      ? howtoMenuRef
      : openMenu === 'sections'
      ? sectionsMenuRef
      : null;
    if (ref?.current && openMenu) {
      const first = ref.current.querySelector<HTMLElement>('[role="menuitem"]');
      first?.focus();
    }
  }, [openMenu]);

  // Helper: Ist Route aktiv?
  const isPath = (path: string) => location.pathname === path;
  const isUnder = (prefix: string) => location.pathname.startsWith(prefix);
  // Helper: Ist Anchor aktiv?
  const isAnchorActive = (id: string) => {
    const hashId = getHashId(location.hash || '');
    return activeId === id || hashId === id;
  };

  // Section Icons/Items kommen aus shared sectionsEntries

  // Smooth Scroll mit Sticky-Offset
  const scrollToId = (id: string) => {
    scrollToIdUtil(id, { offset: measuredOffset, extraGap: 8, behavior: 'smooth' });
  };

  // Handle Klicks auf Anchors; optional mit Routenwechsel
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    route?: string,
  ) => {
    e.preventDefault();
    closeAll();
    if (route && location.pathname !== route) {
      navigate(`${route}#${id}`);
      // Scroll nach Navigation (nächster Frame + kleiner Delay)
      requestAnimationFrame(() => setTimeout(() => scrollToId(id), 50));
    } else {
      // Hash in URL setzen, damit Back/Share funktionieren
      try {
        navigate(buildHashUrl(location.pathname, id), { replace: false });
      } catch {}
      requestAnimationFrame(() => setTimeout(() => scrollToId(id), 20));
    }
  };

  // Auto-Scroll bei Hash in URL (Initial/Route-Wechsel)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // kleinem Delay, bis DOM bereit ist
      setTimeout(() => scrollToId(id), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  // Dynamische Messung des Sticky-Header Offsets (ResizeObserver + Fallback)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (Number.isFinite(h) && h > 0) setMeasuredOffset(h);
    };

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    } else {
      globalThis.addEventListener?.('resize', measure as EventListenerOrEventListenerObject);
    }

    measure();
    return () => {
      if (ro) {
        ro.disconnect();
      } else {
        globalThis.removeEventListener?.('resize', measure as EventListenerOrEventListenerObject);
      }
    };
  }, []);

  // Body scroll-lock when mobile menu is open
  useEffect(() => {
    const root = document.documentElement;
    if (mobileOpen) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
    }
    return () => {
      root.style.overflow = '';
    };
  }, [mobileOpen]);

  // Motion Presets für Mobile-Drawer
  const drawerMotion = useMotionProps('fadeSlideDown');

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 supports-[backdrop-filter]:bg-black/30 backdrop-blur-xl text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-[1050px] items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap" aria-label="Zur Startseite">
          {/* Marken-Icon als wiederverwendbare Komponente (auch in AgentsSection) */}
          <BrandIcon className="h-6 w-6" animated ariaHidden />
          <motion.span
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: prefersReduced ? 0 : 1.6 }}
            className={[
              'text-lg font-semibold tracking-tight whitespace-nowrap',
              // Text gradient matching Hero contrast variant (left direction)
              'bg-clip-text text-transparent bg-gradient-to-l from-teal-500 via-sky-300 to-cyan-100',
              prefersReduced ? '' : 'brand-gradient--glow-strong is-animated',
            ].join(' ')}
          >
            SIGMACODE AI
          </motion.span>
        </Link>

        {/* Desktop Menubar */}
        <nav
          className="hidden items-center gap-1.5 md:flex md:flex-nowrap md:overflow-visible overflow-x-auto whitespace-nowrap"
          aria-label="Hauptnavigation"
          role="menubar"
          onKeyDown={(e) => {
            const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
            if (!keys.includes(e.key)) return;
            e.preventDefault();
            const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-dropdown-trigger]'));
            if (triggers.length === 0) return;
            let index = triggers.indexOf(document.activeElement as HTMLElement);
            if (index < 0) index = 0;
            if (e.key === 'Home') index = 0;
            else if (e.key === 'End') index = triggers.length - 1;
            else if (e.key === 'ArrowRight') index = (index + 1) % triggers.length;
            else if (e.key === 'ArrowLeft') index = (index - 1 + triggers.length) % triggers.length;
            triggers[index]?.focus();
          }}
        >
          {/* Produkte Dropdown (refactored to generic Dropdown, now from shared menuConfig) */}
          <Dropdown
            name="produkte"
            label={t('marketing.header.products')}
            widthClass="w-64"
            items={productEntries.map((entry) => ({
              id: entry.id,
              to: entry.to,
              label: entry.label,
              analyticsId: entry.analyticsId,
              icon: entry.icon,
            }))}
            isOpen={openMenu === 'produkte'}
            setOpenMenu={(val) => setOpenMenu(val)}
            clearHoverTimer={clearHoverTimer}
            scheduleClose={scheduleClose}
            onCloseAll={closeAll}
            prefersReduced={!!prefersReduced}
            buttonActive={openMenu === 'produkte' || !!isUnder('/ai-agents') || isPath('/business-ai')}
            isPath={isPath}
            setTriggerEl={(el) => {
              if (openMenu === 'produkte') triggerRef.current = el;
              productsButtonRef.current = el;
            }}
            glassClasses="bg-black/98 supports-[backdrop-filter]:bg-black/90 backdrop-blur-2xl backdrop-saturate-150 backdrop-contrast-110"
            panelBorderClass="border-0"
            panelShadowClass="shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            analyticsPrefix="header-menu-products"
          />

          {/* So funktioniert’s Dropdown (refactored, now from shared menuConfig) */}
          <Dropdown
            name="howto"
            label={t('marketing.header.howto')}
            widthClass="w-72"
            items={howtoEntries.map((entry) => ({
              id: entry.id,
              to: entry.to,
              label: entry.label,
              analyticsId: entry.analyticsId,
              icon: entry.icon,
            }))}
            isOpen={openMenu === 'howto'}
            setOpenMenu={(val) => setOpenMenu(val)}
            clearHoverTimer={clearHoverTimer}
            scheduleClose={scheduleClose}
            onCloseAll={closeAll}
            prefersReduced={!!prefersReduced}
            buttonActive={openMenu === 'howto' || !!isUnder('/how-it-works')}
            isPath={isPath}
            setTriggerEl={(el) => {
              if (openMenu === 'howto') triggerRef.current = el;
              howtoButtonRef.current = el;
            }}
            glassClasses="bg-black/98 supports-[backdrop-filter]:bg-black/90 backdrop-blur-2xl backdrop-saturate-150 backdrop-contrast-110"
            panelBorderClass="border-0"
            panelShadowClass="shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            analyticsPrefix="header-menu-howto"
          />

          {/* Preise Dropdown (refactored, now from shared menuConfig) */}
          <Dropdown
            name="preise"
            label={t('marketing.header.prices')}
            widthClass="w-64"
            items={pricesEntries.map((entry) => ({
              id: entry.id,
              to: entry.isAnchor ? (entry.routeForAnchor ?? entry.to) : entry.to,
              label: entry.label,
              analyticsId: entry.analyticsId,
              icon: entry.icon,
              isAnchor: entry.isAnchor,
            }))}
            isOpen={openMenu === 'preise'}
            setOpenMenu={(val) => setOpenMenu(val)}
            clearHoverTimer={clearHoverTimer}
            scheduleClose={scheduleClose}
            onCloseAll={closeAll}
            prefersReduced={!!prefersReduced}
            buttonActive={openMenu === 'preise' || isPath('/pricing')}
            isPath={isPath}
            isAnchorActive={isAnchorActive}
            onAnchorClick={(e, id, route) => handleAnchorClick(e, id, route)}
            setTriggerEl={(el) => {
              if (openMenu === 'preise') triggerRef.current = el;
              pricesButtonRef.current = el;
            }}
            glassClasses="bg-black/98 supports-[backdrop-filter]:bg-black/90 backdrop-blur-2xl backdrop-saturate-150 backdrop-contrast-110"
            panelBorderClass="border-0"
            panelShadowClass="shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            analyticsPrefix="header-menu-prices"
          />

          {/* Sektionen Dropdown (refactored, now from shared menuConfig) */}
          {sectionsEntries.length > 0 && (
            <Dropdown
              name="sections"
              label={t('marketing.header.sections', { defaultValue: 'Sektionen', returnObjects: false }) as string}
              widthClass="w-56"
              items={sectionsEntries.map((entry) => ({
                id: entry.id,
                label: entry.label,
                analyticsId: entry.analyticsId,
                icon: entry.icon,
                isAnchor: true,
              }))}
              isOpen={openMenu === 'sections'}
              setOpenMenu={(val) => setOpenMenu(val)}
              clearHoverTimer={clearHoverTimer}
              scheduleClose={scheduleClose}
              onCloseAll={closeAll}
              prefersReduced={!!prefersReduced}
              buttonActive={openMenu === 'sections' || !!sectionsActive}
              isPath={isPath}
              isAnchorActive={isAnchorActive}
              onAnchorClick={(e, id) => handleAnchorClick(e, id)}
              setTriggerEl={(el) => {
                if (openMenu === 'sections') triggerRef.current = el;
                sectionsButtonRef.current = el;
              }}
              glassClasses="bg-black/98 supports-[backdrop-filter]:bg-black/90 backdrop-blur-2xl backdrop-saturate-150 backdrop-contrast-110"
              panelBorderClass="border-0"
              panelShadowClass="shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              analyticsPrefix="header-menu-sections"
            />
          )}

          

          {/* Roadmap (Desktop Top-Level Link) */}
          <Link
            to="/roadmap"
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-border ${
              isPath('/roadmap')
                ? 'bg-surface-hover text-accent'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
            aria-current={isPath('/roadmap') ? 'page' : undefined}
            data-analytics-id="header-menu-roadmap"
          >
            {t('marketing.header.roadmap', { defaultValue: 'Roadmap' }) as string}
          </Link>

          {/* Referrals (Desktop Top-Level Link) */}
          <Link
            to="/referrals"
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-border ${
              isPath('/referrals')
                ? 'bg-surface-hover text-accent'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
            aria-current={isPath('/referrals') ? 'page' : undefined}
            data-analytics-id="header-menu-referrals"
          >
            <Gift className="h-4 w-4" aria-hidden />
            {t('marketing.header.referrals', { defaultValue: 'Empfehlen & verdienen' }) as string}
          </Link>

          <Link
            to="/c/new"
            className="inline-flex shrink-0 items-center rounded-md bg-gradient-to-r from-teal-500 via-sky-400 to-cyan-300 px-3.5 py-1.5 text-sm font-medium text-black shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
            data-analytics-id="header-cta-chat"
          >
            {t('marketing.header.cta_chat')}
          </Link>
          {/* Theme Toggle Desktop */}
          <LanguageToggle className="ml-2" />
          <ThemeToggle className="ml-2" />
        </nav>

        {/* Mobile Toggle */}
        <div className="relative z-[60] flex items-center gap-2 md:hidden">
          {/* Theme Toggle Mobile */}
          <LanguageToggle />
          <ThemeToggle />
          <button
            className="group inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-border/60"
            aria-label="Menü öffnen"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <motion.svg
                className="h-5 w-5 will-change-transform"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                initial={false}
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <defs>
                  <linearGradient id="mhIconGradX" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M6 6L18 18"
                  stroke="url(#mhIconGradX)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  whileHover={{ pathLength: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                />
                <motion.path
                  d="M18 6L6 18"
                  stroke="url(#mhIconGradX)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  whileHover={{ pathLength: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                />
              </motion.svg>
            ) : (
              <motion.svg
                className="h-5 w-5 will-change-transform"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                initial={false}
                whileHover={{ scaleX: 1.08 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <defs>
                  <linearGradient id="mhIconGradMenu" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M4 7H20"
                  stroke="url(#mhIconGradMenu)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  whileHover={{ pathLength: 1, transition: { duration: 0.5 } }}
                />
                <motion.path
                  d="M4 12H20"
                  stroke="url(#mhIconGradMenu)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  whileHover={{ pathLength: 1, transition: { duration: 0.5, delay: 0.03 } }}
                />
                <motion.path
                  d="M4 17H20"
                  stroke="url(#mhIconGradMenu)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  whileHover={{ pathLength: 1, transition: { duration: 0.5, delay: 0.06 } }}
                />
              </motion.svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay + Drawer */}
      {mobileOpen && (
        <>
          {/* Overlay to dim background and enable click-to-close */}
          <div
            className="fixed inset-0 z-40 bg-black/50 supports-[backdrop-filter]:backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 md:hidden">
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              className="border-t border-border px-4 py-3 rounded-xl bg-surface-primary/70 supports-[backdrop-filter]:backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              {...drawerMotion}
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-hover">
                  {t('marketing.header.products')}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="mt-1 space-y-1 pl-2">
                  {productEntries.map((entry) => (
                    <MenuItem
                      key={entry.id}
                      entry={entry}
                      active={!!entry.to && isPath(entry.to)}
                      variant="mobile"
                      analyticsPrefix="header-mobile-products"
                      onClick={() => {
                        setMobileOpen(false);
                      }}
                    />
                  ))}
                </div>
              </details>
            <details className="group mt-2">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-hover">
                {t('marketing.header.howto')}
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-2">
                {howtoEntries.map((entry) => (
                  <MenuItem
                    key={entry.id}
                    entry={entry}
                    active={!!entry.to && isPath(entry.to)}
                    variant="mobile"
                    analyticsPrefix="header-mobile-howto"
                    onClick={() => { setMobileOpen(false); closeAll(); }}
                  />
                ))}
              </div>
            </details>
            <details className="group mt-2">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-hover">
                {t('marketing.header.prices')}
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1 pl-2">
                {pricesEntries.length > 0 && (
                  <MenuItem
                    key={pricesEntries[0].id}
                    entry={pricesEntries[0]}
                    active={!!pricesEntries[0].to && isPath(pricesEntries[0].to!)}
                    variant="mobile"
                    analyticsPrefix="header-mobile-prices"
                    onClick={() => { setMobileOpen(false); closeAll(); }}
                  />
                )}
                <div className="my-1 h-px bg-gradient-to-r from-white/0 via-white/12 to-white/0" role="separator" />
                {pricesEntries.slice(1).map((entry) => (
                  <MenuItem
                    key={entry.id}
                    entry={entry}
                    active={false}
                    variant="mobile"
                    analyticsPrefix="header-mobile-prices"
                    onClick={() => { setMobileOpen(false); closeAll(); }}
                    onAnchorClick={handleAnchorClick}
                  />
                ))}
              </div>
            </details>
            

            {/* Roadmap (Mobile Top-Level Link) */}
            <Link
              to="/roadmap"
              className={`mt-2 block rounded px-2 py-2.5 text-sm hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-primary ${isPath('/roadmap') ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-cyan-200' : 'text-text-secondary'}`}
              onClick={() => { setMobileOpen(false); closeAll(); }}
              aria-current={isPath('/roadmap') ? 'page' : undefined}
              data-analytics-id="header-mobile-roadmap"
            >
              {t('marketing.header.roadmap', { defaultValue: 'Roadmap' }) as string}
            </Link>

            {/* Referrals (Mobile Top-Level Link) */}
            <Link
              to="/referrals"
              className={`mt-2 block rounded px-2 py-2.5 text-sm hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-primary ${isPath('/referrals') ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-cyan-200' : 'text-text-secondary'}`}
              onClick={() => { setMobileOpen(false); closeAll(); }}
              aria-current={isPath('/referrals') ? 'page' : undefined}
              data-analytics-id="header-mobile-referrals"
            >
              {t('marketing.header.referrals', { defaultValue: 'Empfehlen & verdienen' }) as string}
            </Link>
            {sectionsEntries.length > 0 && (
              <div className="mt-2 space-y-1">
                {sectionsEntries.map((entry, idx) => (
                  <MenuItem
                    key={entry.id}
                    entry={entry}
                    active={isAnchorActive(entry.id)}
                    variant="mobile"
                    analyticsPrefix="header-mobile-anchor"
                    onClick={() => { setMobileOpen(false); closeAll(); }}
                    onAnchorClick={handleAnchorClick}
                  />
                ))}
              </div>
            )}
              <Link
                to="/c/new"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-teal-500 via-sky-400 to-cyan-300 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
                onClick={() => setMobileOpen(false)}
                data-analytics-id="header-mobile-cta-chat"
              >
                {t('marketing.header.cta_chat')}
              </Link>
            </motion.div>
          </div>
        </>
      )}
    </header>
  );
}
