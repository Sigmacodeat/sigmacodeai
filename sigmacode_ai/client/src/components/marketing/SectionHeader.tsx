import type { ComponentType, ReactNode, ElementType } from 'react';
import SectionBadge from './SectionBadge';
import type { BadgeVariant } from '../ui/Badge';

interface SectionHeaderProps {
  // Badge
  icon?: ComponentType<{ className?: string }>;
  badgeText: string;
  badgeVariant?: BadgeVariant;
  badgeTone?: 'neutral' | 'indigo' | 'success' | 'warning' | 'danger' | 'teal' | 'amber' | 'violet' | 'pink';
  badgeSize?: 'sm' | 'md' | 'lg';
  badgeClassName?: string;
  badgeAriaLabel?: string;
  /** Optional: Badge-Animation beim Scrollen aktivieren/deaktivieren (Default: true) */
  badgeAnimateOnView?: boolean;
  /** Optional: Anteil des Badges, der sichtbar sein muss (0..1), bevor animiert wird (Default: 0.55) */
  badgeInViewAmount?: number;
  /** Startverzögerung für die Badge-Animation (Sekunden) */
  badgeStartDelaySec?: number;
  /** Dauer der Farbtransition (grau -> farbe) (Sekunden) */
  badgeColorDurationSec?: number;
  /** Zeitabstand zwischen farbfertigem Badge und Content-Reveal (Sekunden) */
  contentLagSec?: number;
  /** Callback, sobald Badge-Completion (+Lag) erreicht ist und Content erscheinen darf */
  onReady?: () => void;
  /** Optional: Minimaler Badge-Stil als Convenience-Flag (Backward-compat) */
  badgeMinimal?: boolean;
  /** Optional: Ausrichtung des Badges */
  badgeAlign?: 'left' | 'center' | 'right';

  // Headline
  title: string;
  /** Optional id für Ankerlinks & aria-labelledby */
  id?: string;
  /** Semantische Überschriftenebene (SEO/A11y), Standard: h2 */
  as?: ElementType;
  titleClassName?: string;
  /**
   * Optional: Ausrichtung des Headline-Blocks (Titel + RightContent)
   * - 'left' (Default): bisheriges Verhalten
   * - 'center': zentriert nur in der jeweiligen Section
   */
  contentAlign?: 'left' | 'center';

  // Optional Subtext
  subtitle?: ReactNode;
  subtitleClassName?: string;

  // Optional: Content rechts neben der Headline (CTA, Links, etc.)
  rightContent?: ReactNode;
  rightClassName?: string;

  // Timing
  baseDelay?: number; // start time for headline relative to badge (default 0.12s)
}

/**
 * SectionHeader: Vereinheitlicht Badge + Titel (+ optional Subtext) für Landing Sections.
 * - Badge: nutzt SectionBadge mit on‑view animation (grau -> farbe)
 * - Headline: erscheint kurz nach dem Badge mit inViewProps
 * - Subtitle: optional, minimal später
 */
export default function SectionHeader({
  icon,
  badgeText,
  badgeVariant = 'glass',
  badgeTone = 'teal',
  badgeSize = 'md',
  badgeClassName = 'h-8 py-0',
  badgeAriaLabel,
  badgeAnimateOnView = true,
  badgeInViewAmount,
  badgeStartDelaySec = 0,
  badgeColorDurationSec = 2.0,
  contentLagSec = 0.5,
  onReady,
  badgeMinimal,
  badgeAlign = 'center',
  title,
  id,
  as,
  // titleClassName is intentionally not honored to enforce global uniform H2 typography
  // Keep the prop for backward-compat, but compute a unified class below.
  titleClassName = 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white',
  contentAlign = 'left',
  subtitle,
  subtitleClassName = 'mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300',
  baseDelay = 0.12,
  rightContent,
  rightClassName,
}: SectionHeaderProps) {
  const Heading: ElementType = as ?? 'h2';
  const unifiedTitleClass = '!text-[36px] font-bold !font-bold tracking-tight !tracking-tight text-gray-900 dark:text-white';
  const headingId = id ?? undefined;
  const badgeAlignClass =
    badgeAlign === 'center' ? 'justify-center' : badgeAlign === 'right' ? 'justify-end' : 'justify-start';
  const headRowClass =
    contentAlign === 'center'
      ? 'mt-2 md:mt-3 flex flex-col items-center justify-center gap-2 text-center'
      : 'mt-2 md:mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2';

  return (
    <div aria-labelledby={headingId} className="mb-6 sm:mb-8 md:mb-10">
      <div className={`flex ${badgeAlignClass}`}>
        <SectionBadge
          icon={icon}
          variant={badgeMinimal ? 'glass' : badgeVariant}
          tone={badgeTone}
          size={badgeSize}
          className={badgeClassName}
          ariaLabel={badgeAriaLabel ?? badgeText}
          animateOnView={badgeAnimateOnView}
          inViewAmount={badgeInViewAmount}
          startDelaySec={badgeStartDelaySec}
          colorDurationSec={badgeColorDurationSec}
          onColorComplete={() => {
            if (!onReady) return;
            const lag = Math.max(0, contentLagSec ?? 0) * 1000;
            if (lag === 0) {
              onReady();
            } else {
              window.setTimeout(onReady, lag);
            }
          }}
        >
          {badgeText}
        </SectionBadge>
      </div>
      <div className={headRowClass}>
        <Heading id={headingId} className={`not-prose ${unifiedTitleClass} ${contentAlign === 'center' ? 'text-center' : ''}`}>
          {title}
        </Heading>
        {rightContent ? (
          <div className={rightClassName}>{rightContent}</div>
        ) : null}
      </div>
      {subtitle ? <p className={`${subtitleClassName} ${contentAlign === 'center' ? 'text-center' : ''}`}>{subtitle}</p> : null}
    </div>
  );
}
