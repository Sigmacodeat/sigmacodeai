import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress, useParallax, usePrefersReducedMotion } from './useScrollHooks';

interface ParallaxRobotProps {
  src: string;
  alt?: string;
  range?: [number, number]; // translateY in px
  opacity?: number;
  className?: string;
}

/**
 * Subtile Parallax-Ebene für Robot-Silhouetten/Bilder.
 * Erwartet, dass "src" in public/ liegt (z. B. /pitchdeck/robots/robot1.webp)
 */
export default function ParallaxRobot({ src, alt = '', range = [-12, 12], opacity = 0.08, className = '' }: ParallaxRobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);
  const y = useParallax(progress, range);
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 overflow-visible ${className}`} aria-hidden>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, opacity: reduced ? 0.06 : opacity }}
        className="select-none object-contain w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
