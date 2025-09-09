import React, { ElementType, HTMLAttributes } from 'react';
import { useInView } from './useInView';

export type RevealProps<T extends ElementType> = {
  as?: T;
  variant?: 'rise' | 'fade' | 'scale' | 'spring' | 'elevation';
  delay?: number; // ms
  duration?: number; // ms
  once?: boolean;
  y?: number; // px for rise
  easing?: string; // optional custom timing function
} & Omit<HTMLAttributes<HTMLElement>, 'as'> & {
  children?: React.ReactNode;
};

const variantToAnimClass: Record<NonNullable<RevealProps<any>['variant']>, string> = {
  rise: 'animate-rise-in',
  fade: 'animate-fade-in',
  scale: 'animate-scale-in',
  spring: 'animate-spring-in',
  elevation: 'animate-elevation-pop',
};

export function Reveal<T extends ElementType = 'div'>(props: RevealProps<T>) {
  const { as, children, className = '', variant = 'rise', delay = 0, duration, once = true, y = 16, easing, style, ...rest } = props as RevealProps<any>;
  const Tag = (as || 'div') as ElementType;
  const { ref, inView, reduced } = useInView({ once, threshold: 0.25 });

  const animClass = inView && !reduced ? variantToAnimClass[variant] : '';
  const mergedStyle: React.CSSProperties = {
    ...(style as React.CSSProperties),
    // respect tokens via CSS variables; fallbacks for duration/y
    animationDelay: `${Math.max(0, delay)}ms`,
    ...(duration ? { animationDuration: `${duration}ms` } : {}),
    ...(easing ? { animationTimingFunction: easing } : {}),
    // Provide inline CSS variables to allow per-instance tuning
    // NOTE: Tailwind keyframes read global tokens; here we can override per element
    ['--motion-rise-y' as any]: `${y}px`,
  };

  // initial state to avoid CLS, visible when reduced motion
  const baseClasses = `opacity-0 will-change-transform ${className}`.trim();
  // Fallback: Wenn keine Animationsklasse vorhanden (z. B. CSS nicht geladen), dennoch sichtbar machen
  const visibleClass = reduced ? 'opacity-100' : (animClass || 'opacity-100');

  return (
    <Tag
      ref={ref as any}
      data-inview={inView || reduced ? 'true' : 'false'}
      className={`${baseClasses} ${inView || reduced ? visibleClass : ''}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Reveal.displayName = 'Reveal';

export default Reveal;
