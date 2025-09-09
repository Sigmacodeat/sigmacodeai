import React, { PropsWithChildren, Suspense, useEffect, useMemo } from 'react';

export type SequentialLazySectionProps = {
  index: number;
  /** Viewport-Schwelle in Anteil (0..1). Default 0.3 (30%) */
  threshold?: number;
  /** Einmalig mounten, nicht wieder unmounten. Default true */
  once?: boolean;
  /** Platzhalter-Höhe für CLS-Vermeidung, z.B. '80vh' oder 600 (px). */
  reserveSpace?: number | string;
  /** Suspense Fallback */
  fallback?: React.ReactNode;
  /** Optional: signalisiert, wann die Section vollständig sichtbar/animiert ist. Standard: on first mount complete */
  onFullyRevealed?: () => void;
  /** Zusätzliche Klassen */
  className?: string;
  /**
   * Fallback-Verhalten: Wenn true, wird die Section nach der ersten Mount-Animation automatisch
   * als "revealed" markiert. Wenn false, wartet das Gate auf ein bubbelndes CustomEvent
   * "section:ready" aus dem Inhalt. Default: true (backwards-compatible).
   */
  autoComplete?: boolean;
};

/**
 * Sequenzielles Lazy-Mounting:
 * - Section mountet erst, wenn: (a) 30% im Viewport (threshold) UND (b) vorherige Section fertig ist (Sequenz-Gate)
 * - Nach erstmaliger Anzeige markiert sie sich als "reveal complete" und gibt die nächste frei
 * - Kein Zeit-Delay, rein scroll- und sequenzbasiert
 */
export default function SequentialLazySection({
  index,
  threshold = 0.35,
  once = true,
  reserveSpace,
  fallback = null,
  onFullyRevealed,
  className,
  autoComplete = true,
  children,
}: PropsWithChildren<SequentialLazySectionProps>) {
  // Kompatibilitäts-Props (index, threshold, once, autoComplete) werden ignoriert
  const style = useMemo(() => {
    if (reserveSpace == null) return undefined;
    const minHeight = typeof reserveSpace === 'number' ? `${reserveSpace}px` : reserveSpace;
    return { minHeight } as React.CSSProperties;
  }, [reserveSpace]);

  // Optionales Signal beim ersten Render
  useEffect(() => {
    onFullyRevealed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className} style={style}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </div>
  );
}
