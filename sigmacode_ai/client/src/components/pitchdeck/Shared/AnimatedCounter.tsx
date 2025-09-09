import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePrefersReducedMotion } from './useScrollHooks';

export type AnimatedCounterProps = {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 1.2,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });
  const value = useMotionValue(from);
  const rounded = useTransform(value, (latest) => Math.round(latest));
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls?.stop?.();
  }, [isInView, to, duration, value, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
