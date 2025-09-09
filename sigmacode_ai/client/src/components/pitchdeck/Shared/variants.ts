import { Variants } from 'framer-motion';

export const fadeIn: { initial: any; animate: any } = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: 'beforeChildren' },
  },
};

export const itemVar: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Unified easing/duration presets (non-breaking additions)
export const easing = {
  swift: [0.16, 1, 0.3, 1] as [number, number, number, number],
  gentle: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const durations = {
  xs: 0.25,
  sm: 0.35,
  md: 0.45,
  lg: 0.6,
};

export const viewportOnce = { once: true, amount: 0.3 } as const;

// Additional preset variants for convenience
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: durations.md, ease: easing.swift } },
};

export const fadeInBlur: Variants = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: durations.md, ease: easing.gentle } },
};
