import React, { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot } from 'lucide-react';

export type BrandIconProps = {
  className?: string; // Containergröße steuert Icongröße (z. B. h-6 w-6)
  strokeWidth?: number;
  animated?: boolean;
  ariaHidden?: boolean;
};

/**
 * BrandIcon – exakt das Marken-Icon aus dem Header als wiederverwendbare Komponente
 * - Bot-Kopf mit Verlaufs-Stroke
 * - Augen als zwei Kreise mit eigenem Verlauf
 * - Animation optional (reduced motion respektiert)
 */
export default function BrandIcon({
  className = 'h-6 w-6',
  strokeWidth = 2,
  animated = true,
  ariaHidden = true,
}: BrandIconProps) {
  const prefersReduced = useReducedMotion();
  // Eigene IDs pro Instanz, getrennt für Light/Dark
  const gradLightId = useId();
  const gradDarkId = useId();
  const eyesLightId = useId();
  const eyesDarkId = useId();
  const enableAnim = animated && !prefersReduced;

  return (
    <span className={["relative inline-flex items-center justify-center", className].join(' ')}>
      {/* Kopf */}
      <motion.span
        initial={enableAnim ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={enableAnim ? { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0 } : undefined}
        className="contents"
      >
        {/* Light-Mode Variante: kräftigere Töne + subtiler Schatten für Kontrast */}
        <Bot
          className="h-full w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] dark:drop-shadow-none dark:hidden"
          stroke={`url(#brandIconGradLight-${gradLightId})`}
          fill="none"
          strokeWidth={strokeWidth}
          aria-hidden={ariaHidden}
        >
          <defs>
            <linearGradient id={`brandIconGradLight-${gradLightId}`} x1="100%" y1="0%" x2="0%" y2="0%">
              {/* teal-600 -> teal-500 -> sky-400 sorgt für mehr Kontrast auf hellem Grund */}
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#0ea5a6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </Bot>
        {/* Dark-Mode Variante: etwas hellere, edle Töne */}
        <Bot
          className="hidden dark:block h-full w-full"
          stroke={`url(#brandIconGradDark-${gradDarkId})`}
          fill="none"
          strokeWidth={strokeWidth}
          aria-hidden={ariaHidden}
        >
          <defs>
            <linearGradient id={`brandIconGradDark-${gradDarkId}`} x1="100%" y1="0%" x2="0%" y2="0%">
              {/* teal-300 -> sky-300 -> cyan-200 wirkt edel im Dark Mode */}
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#a5f3fc" />
            </linearGradient>
          </defs>
        </Bot>
      </motion.span>

      {/* Augen */}
      {/* Wir rendern zwei Layer für die Augen und togglen mit Tailwind Dark-Classes */}
      <motion.svg
        className="absolute inset-0 h-full w-full dark:hidden"
        viewBox="0 0 24 24"
        aria-hidden={ariaHidden}
        initial={enableAnim ? { opacity: 0, y: -2 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enableAnim ? { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 } : undefined}
      >
        <defs>
          <linearGradient id={`brandIconEyesGradLight-${eyesLightId}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="50%" stopColor="#0ea5a6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle cx="9" cy="13" r="1.25" fill={`url(#brandIconEyesGradLight-${eyesLightId})`} />
        <circle cx="15" cy="13" r="1.25" fill={`url(#brandIconEyesGradLight-${eyesLightId})`} />
      </motion.svg>
      <motion.svg
        className="absolute inset-0 hidden h-full w-full dark:block"
        viewBox="0 0 24 24"
        aria-hidden={ariaHidden}
        initial={enableAnim ? { opacity: 0, y: -2 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enableAnim ? { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 } : undefined}
      >
        <defs>
          <linearGradient id={`brandIconEyesGradDark-${eyesDarkId}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
        </defs>
        <circle cx="9" cy="13" r="1.25" fill={`url(#brandIconEyesGradDark-${eyesDarkId})`} />
        <circle cx="15" cy="13" r="1.25" fill={`url(#brandIconEyesGradDark-${eyesDarkId})`} />
      </motion.svg>
    </span>
  );
}
