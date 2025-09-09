import React, { useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePrefersReducedMotion } from './useScrollHooks';

export type ProgressRingProps = {
  size?: number; // px
  stroke?: number; // px
  value: number; // 0..100
  trackColor?: string;
  progressColor?: string;
  className?: string;
  'aria-label'?: string;
};

/**
 * Lightweight radial progress ring that animates when entering the viewport.
 */
export default function ProgressRing({
  size = 80,
  stroke = 6,
  value,
  trackColor = 'rgba(148, 163, 184, 0.25)',
  progressColor = '#6366f1',
  className = '',
  'aria-label': ariaLabel,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef<SVGCircleElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const mv = useMotionValue(0);
  const dash = useTransform(mv, (v) => ((100 - v) / 100) * circumference);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!inView) return;
    const clamped = Math.max(0, Math.min(100, value));
    if (reduced) {
      mv.set(clamped);
      return;
    }
    const controls = animate(mv, clamped, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => controls?.stop?.();
  }, [inView, value, reduced, mv]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel} className={className}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <motion.circle
        ref={ref}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={progressColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeDasharray={circumference}
        style={{ strokeDashoffset: dash }}
      />
    </svg>
  );
}
