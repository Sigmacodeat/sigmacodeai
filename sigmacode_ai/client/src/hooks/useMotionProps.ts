import { useReducedMotion } from 'framer-motion';

export type MotionPreset = 'fadeSlideDown' | 'fadeIn';

export type MotionProps = {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition: Record<string, any>;
};

/**
 * useMotionProps
 * Liefert framer-motion Props abhängig von prefers-reduced-motion.
 * Standard-Presets: fadeSlideDown (für Drawer/Dropdown), fadeIn (für einfache Effekte)
 */
export function useMotionProps(preset: MotionPreset = 'fadeSlideDown', overrides?: Partial<MotionProps>): MotionProps {
  const prefersReduced = useReducedMotion();

  const base: Record<MotionPreset, MotionProps> = {
    fadeSlideDown: {
      initial: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 },
      animate: { opacity: 1, y: 0 },
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.14, ease: [0.22, 1, 0.36, 1] },
    },
    fadeIn: {
      initial: prefersReduced ? { opacity: 1 } : { opacity: 0 },
      animate: { opacity: 1 },
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const cfg = base[preset];
  return {
    initial: { ...cfg.initial, ...(overrides?.initial || {}) },
    animate: { ...cfg.animate, ...(overrides?.animate || {}) },
    transition: { ...cfg.transition, ...(overrides?.transition || {}) },
  };
}
