import { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

export type IconGlowProps = {
  Icon: ComponentType<LucideProps>;
  size?: number; // px
  colorClass?: string; // Tailwind text-*
  glowColor?: string; // CSS color for radial gradient
};

/**
 * Einheitlicher Icon-Container mit dezentem Glow und optionaler Atmung.
 */
export default function IconGlow({ Icon, size = 24, colorClass = 'text-teal-600', glowColor = 'rgba(13,148,136,0.42)' }: IconGlowProps) {
  return (
    <div className="relative inline-grid place-items-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10"
        style={{ width: size + 18, height: size + 18, borderRadius: 9999, background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(10px)' }}
      />
      <Icon className={`${colorClass}`} style={{ width: size, height: size }} />
    </div>
  );
}
