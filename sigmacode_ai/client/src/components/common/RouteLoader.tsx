import React from 'react';

/**
 * Kleiner, barrierearmer Loader für Route-Level Suspense-Fallbacks
 * - Minimaler DOM/CSS-Footprint
 * - A11y: role, aria-label
 */
export default function RouteLoader() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Loading">
      <span className="inline-block h-4 w-4 animate-ping rounded-full bg-emerald-500/70" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
