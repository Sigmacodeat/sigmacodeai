import type React from 'react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buttonStyles, buttonSizeXs } from '../ui/Button';

export type MarketingTeaserProps = {
  id: string;
  title: string;
  description?: string;
  bullets?: string[];
  ctaHref: string;
  ctaLabel: string;
  icon?: ReactNode;
  className?: string;
  // Accent tone to align icons/bullets with section badge colors
  tone?: 'indigo' | 'teal' | 'amber' | 'violet' | 'pink' | 'neutral';
  /** When true, the section has no background gradient (transparent background) */
  transparentBackground?: boolean;
  /** Optional: kompaktere Variante mit engeren Abständen & kleineren Typografien */
  compact?: boolean;
  /** Optional: statt Scroll-In-View die Bullet-Reveal-Animation per Click starten */
  playOnClick?: boolean;
  /** Optional: Stagger zwischen Bullet-Items (Sekunden), Standard 0.05 */
  stagger?: number;
  /** Optional analytics ids */
  dataAnalyticsId?: string;
  bulletAnalyticsId?: string;
  ctaAnalyticsId?: string;
  /** Optional: CTA vollständig ausblenden */
  hideCta?: boolean;
  /** Optional: Größe des Header-Icon-Containers */
  iconSize?: 'sm' | 'md' | 'lg';
  /** Optional: Stil der Bullet-Icons */
  bulletVariant?: 'default' | 'subtle';
  /** Optional: Darstellungsvariante – plain (Default) oder card (Glass-Card mit Ring) */
  variant?: 'plain' | 'card';
  /** Optional: Ausrichtung des Headers samt Icon/Titel */
  align?: 'left' | 'center';
  /** Optional: Darstellungsstil der Bullet-Container */
  bulletStyle?: 'card' | 'bare';
  /** Optional: Icon ohne Container (kein Hintergrund, kein Ring) */
  iconBare?: boolean;
  /** Optional: Ausrichtung nur für das Icon (überschreibt align für das Icon) */
  iconAlign?: 'left' | 'center';
};

/**
 * MarketingTeaser
 * - Reusable Card-like teaser section with optional bullets and icon
 * - Uses semantic heading structure (h2 in landing-level context)
 * - Accessible CTA link
 */
export default function MarketingTeaser({
  id,
  title,
  description,
  bullets = [],
  ctaHref,
  ctaLabel,
  icon,
  className,
  tone = 'teal',
  transparentBackground = false,
  compact = false,
  playOnClick = false,
  stagger = 0.05,
  dataAnalyticsId,
  bulletAnalyticsId,
  ctaAnalyticsId,
  hideCta = false,
  iconSize = 'md',
  bulletVariant = 'default',
  variant = 'plain',
  align = 'left',
  bulletStyle = 'card',
  iconBare = false,
  iconAlign,
}: MarketingTeaserProps) {
  const prefersReduced = useReducedMotion();
  const [played, setPlayed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const readyEmittedRef = useRef(false);
  const emitSectionReady = useCallback(() => {
    if (readyEmittedRef.current) return;
    readyEmittedRef.current = true;
    sectionRef.current?.dispatchEvent(
      new CustomEvent('section:ready', { bubbles: true })
    );
  }, []);
  const onPlay = useCallback(() => {
    if (!playOnClick) return;
    setPlayed(true);
  }, [playOnClick]);
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (!playOnClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setPlayed(true);
    }
  }, [playOnClick]);
  // Map tone to Tailwind classes for a refined dark-friendly look
  const toneMap = {
    indigo: {
      iconBox: 'bg-indigo-500/10 text-indigo-300 ring-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20',
      bulletDot: 'text-indigo-300',
      bulletRing: 'ring-white/10',
      cta: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus-visible:ring-indigo-500',
      cardBorder: 'border-indigo-200/60 dark:border-indigo-400/20',
      cardHover: 'hover:ring-indigo-400/25 dark:hover:ring-indigo-300/25',
    },
    teal: {
      iconBox: 'bg-teal-500/10 text-teal-300 ring-teal-400/20 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/20',
      bulletDot: 'text-teal-300',
      bulletRing: 'ring-white/10',
      cta: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 focus-visible:ring-teal-500',
      cardBorder: 'border-teal-200/60 dark:border-teal-400/20',
      cardHover: 'hover:ring-teal-400/25 dark:hover:ring-teal-300/25',
    },
    amber: {
      iconBox: 'bg-amber-500/10 text-amber-300 ring-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
      bulletDot: 'text-amber-300',
      bulletRing: 'ring-white/10',
      cta: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 focus-visible:ring-amber-500',
      cardBorder: 'border-amber-200/60 dark:border-amber-400/20',
      cardHover: 'hover:ring-amber-400/25 dark:hover:ring-amber-300/25',
    },
    violet: {
      iconBox: 'bg-violet-500/10 text-violet-300 ring-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20',
      bulletDot: 'text-violet-300',
      bulletRing: 'ring-white/10',
      cta: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 focus-visible:ring-violet-500',
      cardBorder: 'border-violet-200/60 dark:border-violet-400/20',
      cardHover: 'hover:ring-violet-400/25 dark:hover:ring-violet-300/25',
    },
    pink: {
      iconBox: 'bg-pink-500/10 text-pink-300 ring-pink-400/20 dark:bg-pink-500/10 dark:text-pink-300 dark:ring-pink-400/20',
      bulletDot: 'text-pink-300',
      bulletRing: 'ring-white/10',
      cta: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 focus-visible:ring-pink-500',
      cardBorder: 'border-pink-200/60 dark:border-pink-400/20',
      cardHover: 'hover:ring-pink-400/25 dark:hover:ring-pink-300/25',
    },
    neutral: {
      iconBox: 'bg-white/5 text-gray-200 ring-white/10 dark:bg-white/5 dark:text-gray-200 dark:ring-white/10',
      bulletDot: 'text-gray-300',
      bulletRing: 'ring-white/10',
      cta: 'bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 focus-visible:ring-slate-500',
      cardBorder: 'border-gray-200/60 dark:border-gray-600/40',
      cardHover: 'hover:ring-white/20 dark:hover:ring-white/15',
    },
  } as const;
  const toneClasses = toneMap[tone] ?? toneMap.teal;
  const hasBullets = (bullets?.length ?? 0) > 0;
  const iconSizeMap = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-12 w-12',
  } as const;
  const iconBoxSize = iconSizeMap[iconSize] ?? (compact ? 'h-10 w-10' : 'h-11 w-11');
  const cardWrapper = variant === 'card';
  const cardClasses =
    // Use shared glass card utilities for consistent look & theming
    'ui-glass-card ui-glass-card-hover rounded-2xl transition duration-200';
  const cardPad = compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6';
  const headerAlignClasses = align === 'center'
    ? 'items-center text-center'
    : 'items-start text-left';
  const headerTitleAlign = align === 'center' ? 'text-center' : 'text-left';

  // In Reduced Motion sollte die Section sofort freigegeben werden
  useEffect(() => {
    if (prefersReduced) {
      emitSectionReady();
    }
  }, [prefersReduced, emitSectionReady]);
  // Wenn playOnClick aktiv ist, gibt es keine automatische Header-/Bullet-Animation,
  // daher on mount/in-view direkt freigeben, damit die Sequenz nicht blockiert.
  useEffect(() => {
    if (!prefersReduced && playOnClick) {
      emitSectionReady();
    }
  }, [playOnClick, prefersReduced, emitSectionReady]);
  return (
    <section
      id={id}
      className={`border-t-0 ${compact ? 'py-8 lg:py-10' : 'py-14 sm:py-16 lg:py-20'} scroll-mt-24 ${
        transparentBackground ? '' : 'bg-gradient-to-b from-white to-gray-50/60 dark:from-gray-950 dark:to-gray-900/30'
      } min-h-0 md:min-h-[46vh] ${className ?? ''}`}
      aria-labelledby={`${id}-heading`}
      onClick={onPlay}
      role={playOnClick ? 'group' : undefined}
      tabIndex={playOnClick ? 0 : undefined}
      onKeyDown={onKeyDown}
      data-analytics-id={dataAnalyticsId}
      ref={sectionRef}
    >
      <div className="mx-auto max-w-none px-4">
        {cardWrapper ? (
          <div className={`${cardClasses} ${cardPad}`}>
            <div className={`grid grid-cols-1 ${compact ? 'gap-6' : 'gap-10'} ${hasBullets ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
              <div className={`${hasBullets ? 'md:col-span-1' : ''}`}>
                <motion.div
                  className={`flex flex-col ${headerAlignClasses} gap-3 ${align === 'center' ? '' : 'sm:flex-row sm:items-center sm:text-left'}`}
                  initial={playOnClick ? { opacity: 1, y: 0 } : prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  whileInView={playOnClick ? undefined : prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={playOnClick ? undefined : { once: true, amount: 0.2 }}
                  transition={{ duration: prefersReduced ? 0.3 : 0.45 }}
                  onAnimationComplete={() => {
                    if (!prefersReduced) {
                      const bulletCount = bullets?.length ?? 0;
                      if (bulletCount === 0 || playOnClick) {
                        emitSectionReady();
                      }
                    }
                  }}
                >
                  {icon ? (
                    iconBare ? (
                      <span className={(iconAlign ?? align) === 'center' ? 'mx-auto' : ''}>{icon}</span>
                    ) : (
                      <div className={`grid ${iconBoxSize} place-items-center rounded-xl ring-1 backdrop-blur-sm ${toneClasses.iconBox} ${(iconAlign ?? align) === 'center' ? 'mx-auto' : ''}`}>
                        {icon}
                      </div>
                    )
                  ) : null}
                  <h2
                    id={`${id}-heading`}
                    className={`typo-section-title text-gray-900 dark:text-white ${headerTitleAlign}`}
                  >
                    {title}
                  </h2>
                </motion.div>
                {description ? (
                  <p className={`${compact ? 'mt-3' : 'mt-4'} max-w-none typo-card-body leading-relaxed text-gray-700/90 dark:text-gray-300 ${headerTitleAlign}`}>
                    {description}
                  </p>
                ) : null}
                {!hideCta && (
                  <div className={`mt-6 flex ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    {ctaHref.startsWith('#') ? (
                      <a
                        href={ctaHref}
                        aria-label={`${title} – ${ctaLabel}`}
                        className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                        data-analytics-id={ctaAnalyticsId}
                        data-title={ctaLabel}
                      >
                        {ctaLabel}
                      </a>
                    ) : (
                      <Link
                        to={ctaHref}
                        aria-label={`${title} – ${ctaLabel}`}
                        className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                        data-analytics-id={ctaAnalyticsId}
                        data-title={ctaLabel}
                      >
                        {ctaLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
              {hasBullets && (
                <div className="md:col-span-2">
                  <div className={`grid grid-cols-1 ${compact ? 'gap-3.5' : 'gap-5'} md:grid-cols-2`}>
                    {bullets.map((b, i) => (
                      <motion.div
                        key={b}
                        className={
                          bulletStyle === 'bare'
                            ? `${compact ? 'py-1.5' : 'py-2'} text-sm`
                            : `group relative ui-glass-card ui-glass-card-hover rounded-2xl ${toneClasses.cardBorder} ${compact ? 'p-4 text-[13px]' : 'p-5 text-sm'}`
                        }
                        initial={playOnClick ? { opacity: 0, y: prefersReduced ? 0 : 10 } : prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={playOnClick ? (played ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReduced ? 0 : 10 }) : undefined}
                        whileInView={playOnClick ? undefined : prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        viewport={playOnClick ? undefined : { once: true, amount: 0.2 }}
                        transition={{ duration: prefersReduced ? 0.25 : 0.4, delay: playOnClick ? i * stagger : i * 0.05 }}
                        data-analytics-id={bulletAnalyticsId}
                        data-idx={i}
                        data-title={b}
                        onAnimationComplete={() => {
                          if (i === bullets.length - 1 && !prefersReduced) {
                            emitSectionReady();
                          }
                        }}
                      >
                        <div className={`flex items-start gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
                          {bulletVariant === 'subtle' ? (
                            <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-gray-400 dark:text-gray-300`}>
                              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </span>
                          ) : (
                            <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 ${toneClasses.bulletRing} ${toneClasses.bulletDot}`}>
                              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          <p className={`typo-card-body text-gray-800 dark:text-gray-200 ${align === 'center' ? 'text-center' : ''}`}>{b}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${compact ? 'gap-6' : 'gap-10'} ${hasBullets ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
            <div className={`${hasBullets ? 'md:col-span-1' : ''}`}>
              <motion.div
                className={`flex flex-col ${headerAlignClasses} gap-3 ${align === 'center' ? '' : 'sm:flex-row sm:items-center sm:text-left'}`}
                initial={playOnClick ? { opacity: 1, y: 0 } : prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                whileInView={playOnClick ? undefined : prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={playOnClick ? undefined : { once: true, amount: 0.2 }}
                transition={{ duration: prefersReduced ? 0.3 : 0.45 }}
                onAnimationComplete={() => {
                  if (!prefersReduced) {
                    const bulletCount = bullets?.length ?? 0;
                    if (bulletCount === 0 || playOnClick) {
                      emitSectionReady();
                    }
                  }
                }}
              >
                {icon ? (
                  iconBare ? (
                    <span className={(iconAlign ?? align) === 'center' ? 'mx-auto' : ''}>{icon}</span>
                  ) : (
                    <div className={`grid ${iconBoxSize} place-items-center rounded-xl ring-1 backdrop-blur-sm ${toneClasses.iconBox} ${(iconAlign ?? align) === 'center' ? 'mx-auto' : ''}`}>
                      {icon}
                    </div>
                  )
                ) : null}
                <h2
                  id={`${id}-heading`}
                  className={`typo-section-title text-gray-900 dark:text-white ${headerTitleAlign}`}
                >
                  {title}
                </h2>
              </motion.div>
              {description ? (
                <p className={`${compact ? 'mt-3' : 'mt-4'} max-w-none typo-card-body leading-relaxed text-gray-700/90 dark:text-gray-300 ${headerTitleAlign}`}>
                  {description}
                </p>
              ) : null}
              {!hideCta && (
                <div className={`mt-6 flex ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
                  {ctaHref.startsWith('#') ? (
                    <a
                      href={ctaHref}
                      aria-label={`${title} – ${ctaLabel}`}
                      className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                      data-analytics-id={ctaAnalyticsId}
                      data-title={ctaLabel}
                    >
                      {ctaLabel}
                    </a>
                  ) : (
                    <Link
                      to={ctaHref}
                      aria-label={`${title} – ${ctaLabel}`}
                      className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                      data-analytics-id={ctaAnalyticsId}
                      data-title={ctaLabel}
                    >
                      {ctaLabel}
                    </Link>
                  )}
                </div>
              )}
            </div>
            {hasBullets && (
              <div className="md:col-span-2">
                <div className={`grid grid-cols-1 ${compact ? 'gap-3.5' : 'gap-5'} md:grid-cols-2`}>
                  {bullets.map((b, i) => (
                    <motion.div
                      key={b}
                      className={
                        bulletStyle === 'bare'
                          ? `${compact ? 'py-1.5' : 'py-2'} text-sm`
                          : `group relative rounded-2xl border ${toneClasses.cardBorder} bg-white/60 ${compact ? 'p-4 text-[13px]' : 'p-5 text-sm'} shadow-sm ring-1 ring-black/5 transition hover:shadow-md ${toneClasses.cardHover} dark:bg-gray-900/60 dark:ring-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/40`
                      }
                      initial={playOnClick ? { opacity: 0, y: prefersReduced ? 0 : 10 } : prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={playOnClick ? (played ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReduced ? 0 : 10 }) : undefined}
                      whileInView={playOnClick ? undefined : prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      viewport={playOnClick ? undefined : { once: true, amount: 0.2 }}
                      transition={{ duration: prefersReduced ? 0.25 : 0.4, delay: playOnClick ? i * stagger : i * 0.05 }}
                      data-analytics-id={bulletAnalyticsId}
                      data-idx={i}
                      data-title={b}
                      onAnimationComplete={() => {
                        if (i === bullets.length - 1 && !prefersReduced) {
                          emitSectionReady();
                        }
                      }}
                    >
                      <div className={`flex items-start gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
                        {bulletVariant === 'subtle' ? (
                          <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-gray-400 dark:text-gray-300`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                        ) : (
                          <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 ${toneClasses.bulletRing} ${toneClasses.bulletDot}`}>
                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        <p className={`typo-card-body text-gray-800 dark:text-gray-200 ${align === 'center' ? 'text-center' : ''}`}>{b}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
