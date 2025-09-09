import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, type Variants, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Server } from 'lucide-react';

import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { trackEvent } from '../../../utils/analytics';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import { useMotionProps } from '../../../hooks/useMotionProps';

// Ring-Intro: sequentielles Aufpoppen (global definiert, um vor Nutzung verfügbar zu sein)
const ringContainerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ringItemVar: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProvidersSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string) => string;
  const tAny = t as unknown as (key: string, options?: Record<string, unknown>) => unknown;
  const prefersReduced = useReducedMotion();
  const fadeIn = useMotionProps('fadeIn');
  const [orbitSize, setOrbitSize] = useState<number>(480);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~2.399963
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Responsive Canvas Size: an die Containerbreite koppeln (state of the art: ResizeObserver)
  useEffect(() => {
    const SAFE_PAD = 16; // Sicherheitsabstand, damit Ränder/Buttons nicht abgeschnitten werden
    const el = containerRef.current ?? document.getElementById('providers-orbit-container');
    if (!el) {
      // Fallback auf window-Breite, falls Ref noch nicht verfügbar
      const handleResize = () => {
        const next = Math.min(Math.floor(window.innerWidth * 0.9), 560) - SAFE_PAD;
        setOrbitSize(Math.max(280, next));
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Maximal 560px, minimal 280px, minus Sicherheitsabstand
        const next = Math.min(Math.floor(width), 560) - SAFE_PAD;
        setOrbitSize(Math.max(280, next));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const defaultProviders = [
    'OpenAI',
    'Anthropic',
    'Mistral',
    'Groq',
    'DeepSeek',
    'Google Vertex/Gemini',
    'Azure OpenAI',
    'AWS Bedrock',
    'OpenRouter',
  ];

  const logoBySlug: Record<string, { src: string; alt: string; invertOnDark?: boolean }> = {
    openai: { src: '/assets/openai.svg', alt: 'OpenAI', invertOnDark: true },
    anthropic: { src: '/assets/anthropic.svg', alt: 'Anthropic' },
    deepseek: { src: '/assets/deepseek.svg', alt: 'DeepSeek', invertOnDark: true },
    'google-vertex-gemini': { src: '/assets/google.svg', alt: 'Google Vertex/Gemini' },
    'azure-openai': { src: '/assets/azure-openai.svg', alt: 'Azure OpenAI' },
    'aws-bedrock': { src: '/assets/aws-bedrock.svg', alt: 'AWS Bedrock' },
  };

  const normalize = (s?: string) =>
    String(s ?? '')
      .toLowerCase()
      .replace(/\s*[\+\/]\s*/g, '-')
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

  const rawProviders = tAny('marketing.landing.providers.items', { returnObjects: true, defaultValue: defaultProviders });
  type ProviderI18n = string | { name: string; slug?: string };

  const providerNames = Array.isArray(rawProviders)
    ? (rawProviders as ProviderI18n[])
        .map((p) =>
          typeof p === 'string'
            ? { name: p, slug: normalize(p) }
            : { name: p?.name ?? '', slug: p?.slug ?? normalize(p?.name) }
        )
        .filter((p) => p.name && p.slug)
    : defaultProviders.map((n) => ({ name: n, slug: normalize(n) }));

  // Ensure we always have items to render even if i18n returned an empty/malformed structure
  const effectiveProviderNames =
    providerNames.length > 0
      ? providerNames
      : defaultProviders.map((n) => ({ name: n, slug: normalize(n) }));

  // Deduplication
  const seen = new Set<string>();
  const uniqueNames = effectiveProviderNames.filter(({ name }) => {
    const key = (name ?? '').trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  type ProviderItem = { name: string; slug: string; subtitle: string; content: string };
  const providers: ProviderItem[] = uniqueNames.map((p) => {
    const slug = p.slug === 'google-vertex-gemini' ? p.slug : normalize(p.name);
    return {
      name: tt(`marketing.landing.providers.details.${slug}.title`, p.name),
      slug,
      subtitle: tt(`marketing.landing.providers.details.${slug}.subtitle`, ''),
      content: tt(`marketing.landing.providers.details.${slug}.content`, ''),
    };
  });

  // SEO JSON-LD
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: providers.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: { '@type': 'Organization', name: p.name, description: p.subtitle || p.content || undefined },
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [providers]);

  // Helper: Items auf konzentrische Ringe verteilen (3 Ringe)
  const rings: [ProviderItem[], ProviderItem[], ProviderItem[]] = [[], [], []];
  providers.forEach((p, idx) => {
    rings[idx % 3].push(p);
  });

  const ringSizes = useMemo(() => {
    // Ableitung aus Canvas-Größe: 48%, 75%, 100%
    const inner = Math.round(orbitSize * 0.48);
    const middle = Math.round(orbitSize * 0.75);
    const outer = orbitSize; // 100%
    return [
      { size: inner, speed: 50 },
      { size: middle, speed: 70 },
      { size: outer, speed: 90 },
    ];
  }, [orbitSize]);

  return (
    <LandingSection id="providers" ariaLabelledby="providers-heading" className="-mt-px">
      <SectionHeader
        icon={Server}
        badgeText={t('marketing.landing.sections.badges.providers')}
        id="providers-heading"
        title={tt('marketing.landing.providers.title', 'Modelle & Provider')}
        subtitle={tt(
          'marketing.landing.providers.description',
          'Multi-Provider by Design. BYOK oder Managed – nutze führende LLMs.'
        )}
      />

      {/* Orbit Canvas */}
      <motion.div
        id="providers-orbit-container"
        ref={containerRef}
        className="relative mx-auto mt-8 flex items-center justify-center overflow-visible px-2 sm:px-4"
        style={{ width: orbitSize, height: orbitSize }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Hintergrund: leichtes Grid/Gradient optional */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/60 to-transparent dark:from-gray-900/60" />

        {rings.map((items, ringIdx) => {
          const { size, speed } = ringSizes[ringIdx];
          return (
            <div
              key={ringIdx}
              className={`pointer-events-none absolute z-0 rounded-full border border-gray-200/70 dark:border-white/10 ${
                prefersReduced || activeSlug ? '' : `transform-gpu will-change-transform animate-[spin_${speed}s_linear_infinite]`
              }`}
              style={{ width: size, height: size }}
              aria-hidden
            />
          );
        })}

        {rings.map((items, ringIdx) => {
          if (!items || items.length === 0) return null;
          const { size } = ringSizes[ringIdx];
          const R = size / 2;
          // pro Ring ein Phasen-Offset für bessere Verteilung
          const phase = ringIdx * (Math.PI / 7);
          return (
            <motion.div
              key={`items-${ringIdx}`}
              className="absolute z-10"
              style={{ width: size, height: size }}
              variants={ringContainerVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div
                className={
                  prefersReduced || activeSlug
                    ? 'h-full w-full'
                    : `h-full w-full transform-gpu will-change-transform animate-[spin_${ringSizes[ringIdx].speed}s_linear_infinite]`
                }
              >
                {items.map((p, i) => {
                  // Goldener-Winkel-Verteilung + Phasenversatz
                  const angle = (i * GOLDEN_ANGLE + phase) % (Math.PI * 2);
                  const pad = 20; // leicht erhöht: mehr Sicherheit gegen Clipping
                  const x = R + (R - pad) * Math.cos(angle);
                  const y = R + (R - pad) * Math.sin(angle);
                  const logo = logoBySlug[p.slug];
                  return (
                    <OrbitItem
                      key={p.slug}
                      x={x}
                      y={y}
                      provider={p}
                      logo={logo}
                      rotating={!prefersReduced}
                      speed={ringSizes[ringIdx].speed}
                      // Intro-Animation per Variants (sequentiell)
                      itemVariants={ringItemVar}
                      activeSlug={activeSlug}
                      onActivate={(slug) => setActiveSlug(slug)}
                      onDeactivate={() => setActiveSlug(null)}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </LandingSection>
  );
}

type ProviderItem = { name: string; slug: string; subtitle: string; content: string };
type LogoInfo = { src: string; alt: string; invertOnDark?: boolean } | undefined;

const popoverVar: Variants = {
  hidden: { opacity: 0, y: 4, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16 } },
};

function OrbitItem({
  x,
  y,
  rotating = false,
  speed = 0,
  provider,
  logo,
  itemVariants,
  activeSlug,
  onActivate,
  onDeactivate,
}: {
  x: number;
  y: number;
  rotating?: boolean;
  speed?: number;
  provider: ProviderItem;
  logo: LogoInfo;
  itemVariants?: Variants;
  activeSlug: string | null;
  onActivate: (slug: string) => void;
  onDeactivate: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [pressing, setPressing] = useState(false);
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string) => string;
  const prefersReduced = useReducedMotion();
  const isOpen = activeSlug === provider.slug;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = `provider-panel-${provider.slug}`;
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const titleId = `provider-panel-title-${provider.slug}`;
  const wasOpenRef = useRef<boolean>(false);

  // Outside-Click zum Schließen (nur aktiv, wenn Popover offen ist)
  useEffect(() => {
    if (!isOpen) return;
    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const withinButton = !!buttonRef.current && buttonRef.current.contains(target);
      const withinPopover = !!popoverRef.current && popoverRef.current.contains(target);
      if (!withinButton && !withinPopover) {
        onDeactivate();
      }
    };
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onDeactivate();
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    document.addEventListener('keydown', onDocKeyDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [isOpen, onDeactivate]);

  // Beim Öffnen Fokus in das Popover (Close-Button) setzen
  useEffect(() => {
    if (isOpen) {
      // Delay, bis DOM/animation mounted ist
      const id = window.setTimeout(() => closeBtnRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  // Fokusrückgabe, wenn Popover geschlossen wird
  useEffect(() => {
    if (!isOpen && wasOpenRef.current) {
      // kurze Verzögerung, um event bubbling/animations abzuwarten
      const id = window.setTimeout(() => buttonRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);
  return (
    <motion.div
      ref={rootRef}
      className="group absolute"
      style={{ left: x - 20, top: y - 20 }}
      // Hover zeigt nur visuelles Feedback; Popover öffnet erst beim Loslassen
      variants={itemVariants}
    >
      <motion.div
        initial={false}
        animate={prefersReduced ? undefined : { y: [0, -3, 0, 3, 0] }}
        transition={prefersReduced ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
        <motion.button
          type="button"
          className="relative z-20 h-10 w-10 rounded-full bg-white/70 dark:bg-gray-900/70 border border-gray-200/70 dark:border-white/10 shadow-sm backdrop-blur flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-primary-500 hover:ring-2 hover:ring-primary/30 transform-gpu will-change-transform [filter:drop-shadow(0_0_10px_rgba(59,130,246,0.12))] hover:[filter:drop-shadow(0_0_14px_rgba(59,130,246,0.25))] overflow-hidden"
          aria-label={`Provider ${provider.name}`}
          title={provider.name}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={panelId}
          ref={buttonRef}
          whileHover={prefersReduced ? undefined : { scale: 1.05 }}
          whileTap={prefersReduced ? undefined : { scale: 1.12 }}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          onPointerDown={(e) => {
            setPressing(true);
            e.preventDefault();
            // Stelle sicher, dass der Button Fokus erhält (A11y & Keyboard Flow)
            buttonRef.current?.focus();
            // Öffne/schließe sofort beim Down, um Drift durch Rotation zu vermeiden
            if (isOpen) {
              onDeactivate();
            } else {
              onActivate(provider.slug);
            }
            trackEvent('landing.providers.orbit.circle_pointer_down', { slug: provider.slug, name: provider.name });
          }}
          onPointerUp={() => {
            setPressing(false);
            // Bereits auf pointerdown getoggelt – hier kein weiteres Toggle nötig
            trackEvent('landing.providers.orbit.circle_click', { slug: provider.slug, name: provider.name });
          }}
          onMouseUp={() => {
            // Down hat bereits geöffnet/geschlossen – belasse es dabei
            trackEvent('landing.providers.orbit.circle_mouse_up', { slug: provider.slug, name: provider.name });
          }}
          onClick={() => {
            // Fallback: Falls onPointerUp nicht feuert (z. B. durch Bewegung/Animation), öffne via Click
            // Bereits auf pointerdown getoggelt – kein erneutes Toggle
            trackEvent('landing.providers.orbit.circle_click_fallback', { slug: provider.slug, name: provider.name });
          }}
          onTouchEnd={() => {
            // Mobile-Sicherheit: Tap-Ende triggert ebenfalls Öffnen
            // Bereits auf pointerdown getoggelt – kein erneutes Toggle
            trackEvent('landing.providers.orbit.circle_touch_end', { slug: provider.slug, name: provider.name });
          }}
          onPointerCancel={() => setPressing(false)}
          // Blur schließt NICHT sofort, damit Popover klickbar bleibt
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPressing(true);
            } else if (e.key === 'Escape') {
              e.stopPropagation();
              onDeactivate();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPressing(false);
              onActivate(provider.slug);
              trackEvent('landing.providers.orbit.circle_key', { slug: provider.slug, name: provider.name });
            }
          }}
          // Exakte Kreis-Klickfläche (nicht nur optisch rund)
          style={{ clipPath: 'circle(20px at 20px 20px)' }}
        >
          {/* Halo-Effekt */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(59,130,246,0.22), rgba(59,130,246,0.12) 45%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={prefersReduced ? { opacity: 0 } : { opacity: hover || pressing ? 1 : 0, scale: pressing ? 1.25 : hover ? 1.08 : 0.94 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          />
          {logo ? (
            <img
              src={logo.src}
              alt={logo.alt}
              width={20}
              height={20}
              loading="lazy"
              className={`h-5 w-5 object-contain transition ${logo.invertOnDark ? 'dark:invert' : ''} drop-shadow-[0_0_6px_rgba(59,130,246,0.25)] group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]`}
            />
          ) : (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {provider.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* Popover */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 z-30"
        variants={popoverVar}
        initial="hidden"
        animate={isOpen ? 'show' : 'hidden'}
      >
        <div
          ref={popoverRef}
          className="relative pointer-events-auto w-64 rounded-lg p-3 bg-transparent border-0 shadow-none"
          role="dialog"
          aria-modal="false"
          id={panelId}
          aria-labelledby={titleId}
        >
          {/* Close (X) Button */}
          <button
            type="button"
            aria-label={tt('common.close', 'Schließen')}
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            ref={closeBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              onDeactivate();
              trackEvent('landing.providers.orbit.popover_close', { slug: provider.slug, name: provider.name });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo.src} alt="" className={`h-5 w-5 object-contain ${logo.invertOnDark ? 'dark:invert' : ''}`} />
            ) : null}
            <div className="min-w-0">
              <div id={titleId} className="truncate typo-card-title">{provider.name}</div>
              <div className="truncate typo-card-body text-gray-600 dark:text-gray-300">{provider.subtitle}</div>
            </div>
          </div>
          <p className="mt-2 line-clamp-3 typo-card-body text-gray-600 dark:text-gray-300">{provider.content}</p>
          <div className="mt-3">
            <Link
              to={`/providers/${provider.slug}`}
              className={`${buttonStyles.ghost} ${buttonSizeXs.ghost} inline-flex`}
              onClick={() => trackEvent('landing.providers.orbit.popover_click', { slug: provider.slug, name: provider.name })}
            >
              {tt('marketing.landing.providers.details', 'Details ansehen')}
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}