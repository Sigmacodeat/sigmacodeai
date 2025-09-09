import React from 'react';

export interface LandingSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  children: React.ReactNode;
  /**
   * Entfernt die obere Border-Linie.
   */
  noBorder?: boolean;
  /**
   * Weniger vertikales Padding (py-12/md:py-20 statt py-16/md:py-24)
   */
  compact?: boolean;
  /**
   * Mehr vertikales Padding (py-20/md:py-28 statt py-16/md:py-24)
   */
  spacious?: boolean;
  /**
   * Zusätzliche Klassen für die Section
   */
  className?: string;
  /**
   * aria-labelledby Unterstützung
   */
  ariaLabelledby?: string;
  /**
   * Optionale Analytics-ID. Falls nicht gesetzt und eine `id` vorhanden ist,
   * wird automatisch `section-<id>` als `data-analytics-id` vergeben.
   */
  analyticsId?: string;
}

/**
 * Einheitlicher Section-Wrapper für Landing-Seiten.
 * Standard: border-t, scroll-mt-24, py-16 md:py-24.
 */
export default function LandingSection({
  id,
  children,
  noBorder = true,
  compact,
  spacious,
  className = '',
  ariaLabelledby,
  analyticsId,
  ...rest
}: LandingSectionProps) {
  const base = 'relative overflow-x-visible overflow-y-visible';
  const border = noBorder ? '' : 'border-t border-app';
  const pad = compact
    ? 'py-12 md:py-20'
    : spacious
      ? 'py-20 md:py-28'
      : 'py-16 md:py-24';
  const scroll = 'scroll-mt-24';
  const classes = [base, border, pad, scroll, className].filter(Boolean).join(' ');
  const computedAnalyticsId = analyticsId ?? (id ? `section-${id}` : undefined);

  return (
    <section
      id={id}
      className={classes}
      aria-labelledby={ariaLabelledby}
      data-section={id}
      data-analytics-id={computedAnalyticsId}
      {...rest}
    >
      <div className="mx-auto w-full max-w-[1050px] px-4 sm:px-6">
        {children}
      </div>
    </section>
  );
}

