import React, { useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

interface SectionRevealProps {
  children: React.ReactNode;
  /** Anteil der Sichtbarkeit im Viewport, der die Einblendung triggert. Default: 0.3 (30%) */
  threshold?: number;
  /** Nur einmal triggern. Default: true */
  once?: boolean;
  /** Verzögerung der Einblendung (Sekunden). Default: 0 */
  delay?: number;
  /** Zusätzliche Klassen für das Wrapper-Element */
  className?: string;
}

/**
 * DEPRECATED: Bitte bevorzugt `Landing/sequential/SequentialLazySection` + explizite Animations-Wrapper
 * innerhalb der Section verwenden. Diese Komponente bleibt für bestehende Seiten kompatibel.
 *
 * SectionReveal: Mountet Children erst, wenn der Bereich zu einem definierten Anteil sichtbar ist.
 * - Nutzt IntersectionObserver via framer-motion useInView
 * - Respektiert prefers-reduced-motion indirekt (wir animieren nur Opacity/Translate kurz)
 */
export default function SectionReveal({
  children,
  threshold = 0.3,
  once = true,
  delay = 0,
  className,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: threshold, once });

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay, ease: [0.22, 0.08, 0.14, 0.99] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
