import type { ComponentType, ReactNode } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '~/utils';
import { Badge, type BadgeVariant } from '../ui/Badge';

interface SectionBadgeProps {
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'indigo' | 'success' | 'warning' | 'danger' | 'teal' | 'amber' | 'violet' | 'pink';
  ariaLabel?: string;
  /** Horizontale Ausrichtung des Badges */
  align?: 'start' | 'center';
  /**
   * Aktiviert die Scroll-Einblendung (grau -> Farbe). Standard: true
   */
  animateOnView?: boolean;
  /**
   * Anteil des Elements, der sichtbar sein muss, um als "inView" zu gelten (0..1). Default: 0.35
   */
  inViewAmount?: number;
  /**
   * Startverzögerung für die Badge-Animation (in Sekunden). Standard: 0
   */
  startDelaySec?: number;
  /**
   * Dauer der Farbtransition (Grau -> Farbe) in Sekunden. Standard: 2.0s
   */
  colorDurationSec?: number;
  /**
   * Callback, wenn die Farbtransition vollständig abgeschlossen ist
   */
  onColorComplete?: () => void;
}

/**
 * SectionBadge: Kleiner, semantischer Badge direkt über Section-Titeln.
 * Einheitliche Abstände und Fokus-Styles für Marketing/Landing Sections.
 */
export default function SectionBadge({
  icon,
  children,
  className = '',
  variant = 'outline',
  size = 'md',
  tone = 'teal',
  ariaLabel,
  align = 'center',
  animateOnView = true,
  inViewAmount = 0.55,
  startDelaySec = 0,
  colorDurationSec = 2.0,
  onColorComplete,
}: SectionBadgeProps) {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rootRef, { amount: inViewAmount, once: true });

  // Melde Abschluss der Farbtransition (inkl. Start-Delay), sobald der Badge im Viewport ist
  useEffect(() => {
    if (!onColorComplete) return;
    if (prefersReduced) {
      // Bei Reduced Motion sofort melden
      onColorComplete();
      return;
    }
    if (!inView) return;
    const totalMs = (startDelaySec + colorDurationSec) * 1000;
    const t = window.setTimeout(() => onColorComplete(), totalMs);
    return () => window.clearTimeout(t);
  }, [inView, onColorComplete, prefersReduced, startDelaySec, colorDurationSec]);
  // Motion-Props: respektiert prefers-reduced-motion
  const motionProps = animateOnView
    ? {
        initial: { opacity: 0, y: 8, filter: 'blur(1px) grayscale(60%) saturate(60%)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px) grayscale(0%) saturate(100%)' },
        transition: { duration: colorDurationSec, delay: startDelaySec, ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number] },
        viewport: { once: true, amount: inViewAmount },
      }
    : {};

  return (
    <motion.div ref={rootRef} className={cn('mb-4 md:mb-5 flex', align === 'start' ? 'justify-start' : 'justify-center')} {...motionProps}>
      <Badge
        icon={icon}
        variant={variant}
        size={size}
        tone={tone}
        className={cn(
          // Base pill with subtle dark glass surface
          'group relative overflow-hidden rounded-full bg-slate-900/35 dark:bg-slate-900/45 backdrop-blur-sm text-sky-200',
          // Inner border and soft inset line for premium depth
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.045)]',
          // Hover ring accent
          'transition-shadow hover:ring-1 hover:ring-sky-300/20 dark:hover:ring-sky-400/20',
          className,
        )}
        ariaLabel={ariaLabel}
      >
        {/* Outer aurora glow frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-sky-400/8 via-teal-400/8 to-cyan-400/8 blur-[1.5px]"
        />
        {/* Inner crisp border */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[1px] rounded-full shadow-[inset_0_0_0_1px_rgba(56,189,248,0.20)]"
        />

        {/* CSS-basierter Shine: einmalig bei InView, zusätzlich sanft bei Hover. Respektiert Reduced Motion. */}
        {!prefersReduced && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-y-0 -left-[45%] w-[65%] rounded-full',
              'bg-gradient-to-r from-transparent via-white/22 to-transparent dark:via-white/12',
              // Trigger: InView (über framer-motion useInView) und Hover
              animateOnView && inView ? 'animate-badge-shimmer' : '',
              'group-hover:animate-badge-shimmer',
            )}
            style={{ backgroundSize: '240% 100%', animationDuration: '5s' }}
          />
        )}

        {/* Stronger color and shine for text */}
        <span
          className={cn(
            'relative z-[1] bg-clip-text text-transparent bg-gradient-to-r from-sky-200 via-teal-200 to-cyan-200',
            'drop-shadow-[0_0_6px_rgba(56,189,248,0.35)] dark:drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]',
            !prefersReduced && animateOnView && inView ? 'animate-text-shine' : '',
            !prefersReduced ? 'group-hover:animate-text-shine' : '',
          )}
          style={{ backgroundSize: '220% 100%', animationDuration: '5.5s' }}
        >
          {children}
        </span>
      </Badge>
    </motion.div>
  );
}
