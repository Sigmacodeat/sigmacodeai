import React, { PropsWithChildren, Suspense } from 'react';

export type LazySectionProps = {
  /** Deprecated: ignoriert – IntersectionObserver wird nicht mehr hier benutzt. */
  threshold?: number;
  /** Deprecated: ignoriert – Mounting passiert sofort. */
  once?: boolean;
  /** Reservierter Platz zur CLS-Vermeidung. */
  reserveSpace?: number | string;
  /** Deprecated: bitte eigene Animationshülle im Kind nutzen. */
  reveal?: boolean;
  className?: string;
  fallback?: React.ReactNode;
};

/**
 * DEPRECATED: Bitte `sequential/SequentialLazySection` verwenden.
 * 
 * Diese Komponente ist nun ein schlanker Pass-Through:
 * - Rendert Kinder sofort (kein IntersectionObserver)
 * - Beibehaltung von Suspense `fallback`
 * - Optionaler minHeight zur CLS-Vermeidung
 */
export default function LazySection({ className, fallback = null, children }: PropsWithChildren<LazySectionProps>) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </div>
  );
}
