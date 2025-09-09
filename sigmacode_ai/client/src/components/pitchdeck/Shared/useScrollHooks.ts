import { useEffect, useMemo } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

export function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
}

export function useScrollProgress(target?: React.RefObject<HTMLElement> | undefined) {
  const { scrollYProgress } = useScroll({ target: target as any, offset: ['start end', 'end start'] });
  return scrollYProgress as MotionValue<number>;
}

export function useParallax(progress: MotionValue<number>, range: [number, number] = [-20, 20]) {
  return useTransform(progress, [0, 1], range);
}

export function useClampTransform(value: MotionValue<number>, outRange: [number, number]) {
  return useTransform(value, (v) => {
    const [min, max] = outRange;
    if (Number.isNaN(v)) return min;
    if (v < 0) return min;
    if (v > 1) return max;
    return min + (max - min) * v;
  });
}

export function useOnMount(cb: () => void) {
  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
