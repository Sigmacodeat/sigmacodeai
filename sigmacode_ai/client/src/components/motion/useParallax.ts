import { useEffect, useRef, useState } from 'react';

export type ParallaxAxis = 'y' | 'x';

interface UseParallaxOptions {
  /** Max translation in px at extremes of scroll progress */
  strength?: number; // default 8
  /** Axis to translate on */
  axis?: ParallaxAxis; // default 'y'
  /** Optional clamp for progress mapping (0..1) */
  clamp?: { min: number; max: number };
}

/**
 * useParallax: GPU-safe, throttled parallax based on viewport scroll position relative to element.
 * - Uses rAF to throttle updates
 * - Respects prefers-reduced-motion (returns neutral transform)
 * - Works without layout shifts (transform only)
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>({ strength = 8, axis = 'y', clamp }: UseParallaxOptions = {}) {
  const ref = useRef<T | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReduced);

    const el = ref.current;
    if (prefersReduced) {
      // Clear transform for accessibility and avoid stale transforms after toggling RPRM
      if (el) el.style.transform = 'none';
      return;
    }
    if (!el) return;

    let frame = 0;

    const read = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: 0 at top off-screen, 1 at bottom off-screen; center ~0.5
      const progress = 1 - Math.min(1, Math.max(0, (rect.top + rect.height) / (vh + rect.height)));
      const clamped = clamp ? Math.min(clamp.max, Math.max(clamp.min, progress)) : progress;
      const offset = (clamped - 0.5) * 2 * strength; // [-strength .. +strength]
      el.style.transform = axis === 'x' ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    };

    // initial
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [axis, strength, clamp?.min, clamp?.max]);

  return { ref, reduced } as const;
}
